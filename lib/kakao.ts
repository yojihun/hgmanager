const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY || '';
const KAKAO_CHANNEL_ID = process.env.KAKAO_CHANNEL_PUBLIC_ID || '';
const KAKAO_ADMIN_KEY = process.env.KAKAO_ADMIN_KEY || '';

interface KakaoQuickReply {
  messageText: string;
  action: string;
  blockId?: string;
  extra?: Record<string, any>;
}

interface KakaoResponse {
  version: number;
  template: {
    outputs: Array<{
      simpleText?: {
        text: string;
      };
      simpleImage?: {
        imageUrl: string;
        altText: string;
      };
      carousel?: any;
      basicCard?: any;
    }>;
    quickReplies?: KakaoQuickReply[];
  };
}

export function createTextResponse(text: string, quickReplies?: KakaoQuickReply[]): KakaoResponse {
  return {
    version: 2,
    template: {
      outputs: [
        {
          simpleText: { text },
        },
      ],
      ...(quickReplies && { quickReplies }),
    },
  };
}

export interface SendMessageParams {
  userId: string;
  text: string;
  buttons?: Array<{
    title: string;
    value: string;
  }>;
}

export async function sendFriendTalkMessage(params: SendMessageParams) {
  // 친구톡 (FriendTalk) 전송
  // 사용자가 채널을 친구 추가한 경우에만 가능
  try {
    const response = await fetch('https://kapi.kakao.com/v2/friend/message/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KAKAO_REST_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        user_id: params.userId,
        template_object: JSON.stringify({
          object_type: 'feed',
          content: {
            title: params.text,
            description: '',
            image_url: '',
            link: {
              web_url: '',
            },
          },
          buttons: params.buttons?.map((btn) => ({
            title: btn.title,
            value: btn.value,
          })) || [],
        }),
      }).toString(),
    });

    if (!response.ok) {
      console.error('Kakao API error:', await response.text());
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function sendAlimtalkMessage(params: {
  recipientNumber: string;
  templateCode: string;
  message: string;
  buttons?: Array<{ name: string; linkMobile: string; linkPc?: string }>;
}) {
  // 알림톡 (AlimTalk) 전송
  // 사전에 템플릿 등록 필요
  try {
    const response = await fetch('https://kapi.kakao.com/v2/alimtalk/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KAKAO_ADMIN_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request_id: `${Date.now()}`,
        sender_key: KAKAO_CHANNEL_ID,
        template_code: params.templateCode,
        receiver_1: params.recipientNumber,
        template_parameter: params.message,
        buttons: params.buttons,
      }),
    });

    if (!response.ok) {
      console.error('AlimTalk API error:', await response.text());
      throw new Error('Failed to send alimtalk');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending alimtalk:', error);
    throw error;
  }
}
