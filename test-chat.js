// test-chat.js - Verify the chat agent answers queries about Manju using the updated KB
async function testChat() {
  console.log('Testing Chatbot Agent Service with Manju queries...');
  try {
    const res = await fetch('http://127.0.0.1:3002/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'How is the match score calculated?',
        history: []
      })
    });
    
    if (!res.ok) {
      throw new Error(`Agent returned status ${res.status}`);
    }
    
    const data = await res.json();
    console.log('\n--- Chatbot Response ---');
    console.log(`Route Match: ${data.route}`);
    console.log(`Model Used:  ${data.model}`);
    console.log(`Answer:\n${data.answer}`);
    console.log('------------------------\n');
  } catch (err) {
    console.error('Chat test failed:', err.message);
  }
}

testChat();
