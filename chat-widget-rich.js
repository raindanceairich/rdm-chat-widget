
// Raindance Chat Widget - Powered by n8n
(function() {
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    const config = Object.assign({
        webhook: { url: '', route: '' },
        branding: {
            logo: 'https://raindancedigitalmarketing.com.au/wp-content/uploads/2022/05/RDM-logo1.png',
            name: 'Raindance',
            welcomeText: 'Hi 👋 I’m Rich from Raindance. How can I help?',
            responseTimeText: 'Typically replies within a few seconds'
        },
        style: {
            primaryColor: '#E91D62',
            secondaryColor: '#F37022',
            backgroundColor: '#ffffff',
            fontColor: '#333333',
            position: 'right'
        }
    }, window.ChatWidgetConfig || {});

    const stylesheet = document.createElement('style');
    stylesheet.textContent = `
      .n8n-chat-widget {
        --chat--color-primary: ${config.style.primaryColor};
        --chat--color-secondary: ${config.style.secondaryColor};
        --chat--color-background: ${config.style.backgroundColor};
        --chat--color-font: ${config.style.fontColor};
        font-family: Arial, sans-serif;
      }
      .n8n-chat-widget .chat-toggle {
        position: fixed;
        bottom: 20px;
        ${config.style.position === 'left' ? 'left: 20px;' : 'right: 20px;'}
        width: 60px;
        height: 60px;
        border-radius: 30px;
        background: linear-gradient(135deg, var(--chat--color-primary), var(--chat--color-secondary));
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }
      .n8n-chat-widget .chat-box {
        position: fixed;
        bottom: 90px;
        ${config.style.position === 'left' ? 'left: 20px;' : 'right: 20px;'}
        width: 360px;
        max-height: 500px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        overflow: hidden;
        background: var(--chat--color-background);
        color: var(--chat--color-font);
        display: none;
        flex-direction: column;
        z-index: 10000;
      }
      .n8n-chat-widget .chat-box.open {
        display: flex;
      }
      .n8n-chat-widget .chat-header {
        padding: 12px;
        background: var(--chat--color-primary);
        color: white;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .n8n-chat-widget .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }
      .n8n-chat-widget .chat-message {
        margin-bottom: 10px;
        padding: 10px 14px;
        border-radius: 10px;
        max-width: 75%;
        font-size: 14px;
      }
      .n8n-chat-widget .chat-message.user {
        align-self: flex-end;
        background: var(--chat--color-primary);
        color: white;
      }
      .n8n-chat-widget .chat-message.bot {
        align-self: flex-start;
        background: #f0f0f0;
        color: #333;
      }
      .n8n-chat-widget .chat-input {
        display: flex;
        padding: 10px;
        border-top: 1px solid #eee;
      }
      .n8n-chat-widget .chat-input textarea {
        flex: 1;
        resize: none;
        border-radius: 8px;
        border: 1px solid #ccc;
        padding: 8px;
        font-family: inherit;
      }
      .n8n-chat-widget .chat-input button {
        margin-left: 8px;
        padding: 0 16px;
        background: var(--chat--color-primary);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(stylesheet);

    const wrapper = document.createElement('div');
    wrapper.className = 'n8n-chat-widget';

    const toggleButton = document.createElement('button');
    toggleButton.className = 'chat-toggle';
    toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4.43-1.017L3 21l1.398-4.194C3.512 15.67 3 13.892 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>';

    const chatBox = document.createElement('div');
    chatBox.className = 'chat-box';
    chatBox.innerHTML = `
      <div class="chat-header">
        <img src="${config.branding.logo}" alt="logo" style="height:24px;" />
        <span>${config.branding.name}</span>
      </div>
      <div class="chat-messages" id="rdm-chat-messages"></div>
      <div class="chat-input">
        <textarea rows="1" id="rdm-chat-input" placeholder="Type your message..."></textarea>
        <button id="rdm-send-btn">Send</button>
      </div>
    `;

    wrapper.appendChild(chatBox);
    wrapper.appendChild(toggleButton);
    document.body.appendChild(wrapper);

    const messages = chatBox.querySelector('#rdm-chat-messages');
    const input = chatBox.querySelector('#rdm-chat-input');
    const sendBtn = chatBox.querySelector('#rdm-send-btn');

    let sessionId = crypto.randomUUID();

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.className = 'chat-message ' + sender;
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    toggleButton.addEventListener('click', () => {
        chatBox.classList.toggle('open');
    });

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const msg = input.value.trim();
        if (!msg) return;
        appendMessage(msg, 'user');
        input.value = '';
        fetch(config.webhook.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'sendMessage',
                sessionId: sessionId,
                chatInput: msg
            })
        })
        .then(res => res.json())
        .then(data => {
            const reply = Array.isArray(data) ? data[0].output : data.output;
            appendMessage(reply || "No response.", 'bot');
        })
        .catch(err => {
            console.error(err);
            appendMessage("Error reaching server.", 'bot');
        });
    }

    // Trigger welcome message
    appendMessage(config.branding.welcomeText, 'bot');
})();
