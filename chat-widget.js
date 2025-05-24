
(() => {
  function createChat() {
    const sessionId = 'rdm-' + Math.random().toString(36).substring(2, 15);
    const container = document.createElement('div');
    container.id = 'rdm-chat-launcher';
    document.body.appendChild(container);

    const iframe = document.createElement('iframe');
    iframe.src = 'about:blank';
    iframe.style = 'position:fixed;bottom:20px;right:20px;width:350px;height:500px;border:none;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;';
    container.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <link href="https://cdn.jsdelivr.net/gh/raindanceairirch/chat-widget@main/style.css" rel="stylesheet" />
      <div class="chat-widget">
        <div class="chat-header">
          <img src="https://raindancedigitalmarketing.com.au/wp-content/uploads/2022/05/RDM-logo1.png" alt="RDM" style="height:24px;margin-right:10px;">
          <span>Rich from Raindance</span>
        </div>
        <div class="chat-body" id="chat-body" style="flex:1;overflow-y:auto;padding:10px;"></div>
        <div class="chat-footer" style="padding:10px;">
          <input id="chat-input" placeholder="Type your message..." style="width:calc(100% - 20px);padding:8px;" />
        </div>
      </div>
      <script>
        const chatBody = document.getElementById('chat-body');
        const input = document.getElementById('chat-input');
        function appendMessage(text, from) {
          const el = document.createElement('div');
          el.className = from + '-message';
          el.innerText = text;
          chatBody.appendChild(el);
          chatBody.scrollTop = chatBody.scrollHeight;
        }

        input.addEventListener('keypress', async (e) => {
          if (e.key === 'Enter') {
            const msg = input.value;
            input.value = '';
            appendMessage(msg, 'user');
            const res = await fetch('https://raindance.app.n8n.cloud/webhook/3161f3ec-7804-4429-af0e-a67afb14b596/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'sendMessage',
                chatInput: msg,
                sessionId: '${sessionId}'
              })
            });
            const json = await res.json();
            if (json.reply) appendMessage(json.reply, 'bot');
          }
        });

        appendMessage("Hi, I’m Rich from Raindance. How can I help?", 'bot');
      </script>
    `);
    doc.close();
  }

  window.addEventListener('DOMContentLoaded', createChat);
})();
