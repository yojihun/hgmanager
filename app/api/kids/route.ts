import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const kids = await prisma.kid.findMany({
    include: {
      parent: {
        select: {
          name: true,
          phone: true,
          kakaoUserId: true,
          registeredAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(kids);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, defaultAttendSat, defaultAttendSun, defaultPickupSat, defaultPickupSun } = body;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const kid = await prisma.kid.create({
    data: {
      name,
      defaultAttendSat: defaultAttendSat ?? true,
      defaultAttendSun: defaultAttendSun ?? true,
      defaultPickupSat: defaultPickupSat ?? false,
      defaultPickupSun: defaultPickupSun ?? false,
      parent: {
        create: {}, // Empty parent record, will be linked when parent self-registers
      },
    },
    include: {
      parent: true,
    },
  });

  return NextResponse.json(kid, { status: 201 });
}
