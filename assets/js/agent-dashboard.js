document.addEventListener('DOMContentLoaded', function() {
    const activeChats = document.getElementById('activeChats');
    const chatMessages = document.getElementById('chatMessages');
    const replyInput = document.getElementById('replyInput');
    const sendReply = document.getElementById('sendReply');

    // Load and display active chats
    function loadActiveChats() {
        const chats = JSON.parse(localStorage.getItem('chats')) || {};
        activeChats.innerHTML = '';

        Object.keys(chats).forEach(sessionId => {
            const chat = chats[sessionId];
            const chatDiv = document.createElement('div');
            chatDiv.className = 'chat-item';
            chatDiv.innerHTML = `
                <div class="chat-preview">
                    <h4>Customer ${sessionId}</h4>
                    <p>${chat.messages[chat.messages.length - 1]?.content || 'No messages'}</p>
                    <span class="time">${new Date(chat.lastUpdate).toLocaleTimeString()}</span>
                </div>
            `;
            chatDiv.addEventListener('click', () => loadChatMessages(sessionId));
            activeChats.appendChild(chatDiv);
        });
    }

    // Load messages for selected chat
    function loadChatMessages(sessionId) {
        const chats = JSON.parse(localStorage.getItem('chats')) || {};
        const chat = chats[sessionId];
        
        if (chat) {
            chatMessages.innerHTML = '';
            chat.messages.forEach(msg => {
                addMessageToChat(msg.type, msg.content);
            });
            // Store current chat session
            localStorage.setItem('currentChatSession', sessionId);
        }
    }

    // Check for new messages every 5 seconds
    setInterval(loadActiveChats, 5000);
    
    // Initial load
    loadActiveChats();
});