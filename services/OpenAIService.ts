import { Platform } from 'react-native';

// Types for OpenAI API
interface Message {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
}

interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  systemMessage?: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }[];
}

// Error types
class OpenAIError extends Error {
  status?: number;
  type?: string;
  code?: string;
  param?: string;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'OpenAIError';
    this.status = status;
  }
}

export class OpenAIService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';
  private defaultModel: string = 'gpt-3.5-turbo';
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // Initial delay in ms

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('OpenAI API key is not set. Please add EXPO_PUBLIC_OPENAI_API_KEY to your environment variables.');
    }
  }

  /**
   * Generate a chat completion using the OpenAI API
   */
  async generateChatCompletion(
    messages: Message[],
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    const {
      model = this.defaultModel,
      temperature = 0.7,
      max_tokens = 1000,
      stream = false,
      systemMessage,
    } = options;

    // Add system message if provided
    if (systemMessage && !messages.some(m => m.role === 'system')) {
      messages.unshift({ role: 'system', content: systemMessage });
    }

    const requestBody = {
      model,
      messages,
      temperature,
      max_tokens,
      stream,
    };

    return this.makeRequest('/chat/completions', requestBody);
  }

  /**
   * Generate a streaming chat completion using the OpenAI API
   */
  async generateStreamingChatCompletion(
    messages: Message[],
    onChunk: (chunk: string) => void,
    options: ChatCompletionOptions = {}
  ): Promise<void> {
    const {
      model = this.defaultModel,
      temperature = 0.7,
      max_tokens = 1000,
      systemMessage,
    } = options;

    // Add system message if provided
    if (systemMessage && !messages.some(m => m.role === 'system')) {
      messages.unshift({ role: 'system', content: systemMessage });
    }

    const requestBody = {
      model,
      messages,
      temperature,
      max_tokens,
      stream: true,
    };

    try {
      await this.makeStreamingRequest('/chat/completions', requestBody, onChunk);
    } catch (error) {
      console.error('Error in streaming chat completion:', error);
      throw error;
    }
  }

  /**
   * Make a request to the OpenAI API
   */
  private async makeRequest(
    endpoint: string,
    body: any,
    retryCount: number = 0
  ): Promise<string> {
    if (!this.apiKey) {
      throw new OpenAIError('OpenAI API key is not set');
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return this.handleErrorResponse(response.status, errorData, endpoint, body, retryCount);
      }

      const data = await response.json() as ChatCompletionResponse;
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new OpenAIError('Network error. Please check your internet connection.');
      }
      throw error;
    }
  }

  /**
   * Make a streaming request to the OpenAI API
   */
  private async makeStreamingRequest(
    endpoint: string,
    body: any,
    onChunk: (chunk: string) => void,
    retryCount: number = 0
  ): Promise<void> {
    if (!this.apiKey) {
      throw new OpenAIError('OpenAI API key is not set');
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = await this.handleErrorResponse(response.status, errorData, endpoint, body, retryCount);
        throw new OpenAIError(errorMessage);
      }

      if (!response.body) {
        throw new OpenAIError('Response body is null');
      }

      // Handle streaming response
      if (Platform.OS === 'web') {
        // Web implementation using ReadableStream
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                return;
              }
              try {
                const chunk = JSON.parse(data) as ChatCompletionChunk;
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                  onChunk(content);
                }
              } catch (e) {
                console.error('Error parsing chunk:', e);
              }
            }
          }
        }
      } else {
        // React Native implementation
        const responseText = await response.text();
        const lines = responseText.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              const chunk = JSON.parse(data) as ChatCompletionChunk;
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new OpenAIError('Network error. Please check your internet connection.');
      }
      throw error;
    }
  }

  /**
   * Handle error responses from the OpenAI API
   */
  private async handleErrorResponse(
    status: number,
    errorData: any,
    endpoint: string,
    body: any,
    retryCount: number
  ): Promise<string> {
    const errorMessage = errorData?.error?.message || 'Unknown error occurred';
    
    // Handle rate limiting and server errors with retries
    if ((status === 429 || status === 500) && retryCount < this.maxRetries) {
      const delay = this.retryDelay * Math.pow(2, retryCount);
      console.warn(`OpenAI API request failed with status ${status}. Retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.makeRequest(endpoint, body, retryCount + 1);
    }

    // Handle specific error types
    switch (status) {
      case 400:
        throw new OpenAIError(`Bad request: ${errorMessage}`, status);
      case 401:
        throw new OpenAIError('Invalid API key. Please check your OpenAI API key.', status);
      case 403:
        throw new OpenAIError('You do not have permission to access this resource.', status);
      case 404:
        throw new OpenAIError(`Resource not found: ${endpoint}`, status);
      case 429:
        throw new OpenAIError('Rate limit exceeded. Please try again later.', status);
      case 500:
      case 502:
      case 503:
      case 504:
        throw new OpenAIError('OpenAI servers are currently unavailable. Please try again later.', status);
      default:
        throw new OpenAIError(`OpenAI API error (${status}): ${errorMessage}`, status);
    }
  }
}

// Export a singleton instance
export const openAIService = new OpenAIService();