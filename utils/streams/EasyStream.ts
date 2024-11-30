import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (inputMessage: string) => {
  const data = (inputMessage: string) => {
    return endent`
      You are Decentralized AI Assistant, powered by LLM Inference Platform.
      ${inputMessage}
    `;
  };

  if (inputMessage) {
    return data(inputMessage);
  }
};

export async function EasyStream(
  prompt: string,
  key: string | undefined,
) {
  const user_prompt = createPrompt(prompt);
  
  const response = await fetch('http://xayah.tpddns.cn:1040/gpt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: user_prompt,
      key: "0xaaaa"
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}
