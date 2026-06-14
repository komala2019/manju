// src/chat-service.jsx — Chat with AI ticket agent

const TICKET_AGENT_URL = 'http://localhost:3001/api/chat';

export const chatService = {
  async sendMessage(message, history = []) {
    try {
      const res = await fetch(TICKET_AGENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });

      if (!res.ok) {
        throw new Error(`Agent error: ${res.status}`);
      }

      const data = await res.json();
      return {
        success: true,
        answer: data.answer,
        confidence: data.confidence,
        context: data.context,
        route: data.route,
        traceId: data.traceId,
      };
    } catch (err) {
      console.error('[Chat] Failed:', err.message);
      return {
        success: false,
        error: err.message || 'Unable to reach assistant. Try again later.',
      };
    }
  },
};
