import { NextRequest, NextResponse } from 'next/server';
import { createTextResponse } from '@/lib/kakao';
import { prisma } from '@/lib/prisma';

interface KakaoWebhookRequest {
  userId: string;
  text: string;
  action?: {
    name: string;
    parameters?: Record<string, any>;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: KakaoWebhookRequest = await req.json();

    if (!body.userId || !body.text) {
      return NextResponse.json(
        { error: 'Missing userId or text' },
        { status: 400 }
      );
    }

    const userText = body.text.trim();

    // Check if parent is already registered
    let parent = await prisma.parent.findUnique({
      where: { kakaoUserId: body.userId },
      include: { kid: true },
    });

    if (parent) {
      // Parent already registered - they're responding to a session question
      return handleSessionResponse(userText, parent.id);
    }

    // New parent registration flow
    // Try to find matching kid by name
    const matchingKids = await prisma.kid.findMany({
      where: {
        name: {
          contains: userText,
          mode: 'insensitive',
        },
      },
    });

    if (matchingKids.length === 0) {
      return NextResponse.json(
        createTextResponse(
          `죄송하지만 "${userText}" 이름의 학생을 찾을 수 없습니다. 정확한 이름을 입력해주세요.`
        )
      );
    }

    if (matchingKids.length === 1) {
      // Found exactly one match - ask for confirmation
      const kid = matchingKids[0];

      // Create/update parent record
      await prisma.parent.upsert({
        where: { kidId: kid.id },
        create: {
          kidId: kid.id,
          kakaoUserId: body.userId,
        },
        update: {
          kakaoUserId: body.userId,
          registeredAt: new Date(),
        },
      });

      return NextResponse.json(
        createTextResponse(
          `${kid.name} 학생의 보호자로 등록되었습니다! 🎉\n앞으로 훈련 일정과 출석 확인을 받으실 수 있습니다.`,
          [
            {
              messageText: '확인했습니다',
              action: 'registered',
            },
          ]
        )
      );
    }

    // Multiple matches - ask which one
    return NextResponse.json(
      createTextResponse(
        '여러 학생이 검색되었습니다. 다시 한 번 정확한 이름을 입력해주세요.',
        matchingKids.map((kid: (typeof matchingKids)[0]) => ({
          messageText: kid.name,
          action: 'select_kid',
          blockId: kid.id,
        }))
      )
    );
  } catch (error) {
    console.error('Kakao webhook error:', error);
    return NextResponse.json(
      createTextResponse('오류가 발생했습니다. 다시 시도해주세요.')
    );
  }
}

async function handleSessionResponse(
  response: string,
  parentId: string
) {
  // TODO: Parse response and update attendance records
  // This will be implemented when we add session/attendance features

  return NextResponse.json(
    createTextResponse('감사합니다! 응답이 저장되었습니다. 😊')
  );
}
