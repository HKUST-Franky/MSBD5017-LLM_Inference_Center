import { ChatBody } from '@/types/types';
import { OpenAIStream } from '@/utils/streams/chatStream';
import { EasyStream } from '@/utils/streams/EasyStream';
import { verifyPayment } from '@/utils/payment';

export const runtime = 'edge';

export async function GET(req: Request): Promise<Response> {
  try {
    const { inputMessage, apiKey } = (await req.json()) as ChatBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = "0xaaaa";
    }

    const stream = await EasyStream(inputMessage, apiKeyFinal);
    const { response } = await stream.json();

    return new Response(response);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { inputMessage, apiKey, paymentTxHash } = await req.json();

    // 验证支付
    if (!await verifyPayment(paymentTxHash)) {
      return new Response('Payment required', { status: 402 });
    }

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = "0xaaaa";
    }

    const stream = await EasyStream(inputMessage, apiKeyFinal);
    const { response } = await stream.json();

    return new Response(response);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
