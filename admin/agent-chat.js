document.addEventListener('DOMContentLoaded', function() {
    const chatList = document.getElementById('activeChats');
    const chatHistory = document.getElementById('chatHistory');
    const replyInput = document.getElementById('replyInput');
    const sendReply = document.getElementById('sendReply');
    let currentSessionId = null;

    // Add this function to handle mobile view transitions
    function handleMobileView() {
        const chatList = document.querySelector('.chat-list');
        const chatWindow = document.querySelector('.chat-window');
        
        if (window.innerWidth <= 768) {
            chatElement.addEventListener('click', () => {
                chatList.style.display = 'none';
                chatWindow.style.display = 'flex';
            });
    
            // Add back button for mobile
            const backButton = document.createElement('button');
            backButton.className = 'mobile-back-btn';
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Chats';
            backButton.addEventListener('click', () => {
                chatList.style.display = 'block';
                chatWindow.style.display = 'none';
            });
            chatWindow.insertBefore(backButton, chatWindow.firstChild);
        }
    }

    // Add this to your existing loadActiveChats function
    function loadActiveChats() {
        const chats = JSON.parse(localStorage.getItem('activeChats')) || {};
        chatList.innerHTML = '';

        Object.entries(chats).forEach(([sessionId, chat]) => {
            if (!chat.messages || chat.messages.length === 0) return;
            
            const lastMessage = chat.messages[chat.messages.length - 1];
            const chatElement = document.createElement('div');
            chatElement.className = 'chat-item' + (sessionId === currentSessionId ? ' active' : '');
            
            const userName = sessionId.split('_').pop().substring(0, 6);
            chatElement.innerHTML = `
                <div class="chat-preview">
                    <h4>Customer #${userName}</h4>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${chat.location || 'Location pending...'}</p>
                    <p class="last-message">${lastMessage.content.substring(0, 30)}${lastMessage.content.length > 30 ? '...' : ''}</p>
                    <span class="time">${new Date(chat.lastUpdate).toLocaleString()}</span>
                </div>
            `;

            chatElement.addEventListener('click', () => {
                currentSessionId = sessionId;
                loadChatHistory(sessionId);
                document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
                chatElement.classList.add('active');
            });

            chatList.appendChild(chatElement);
        });

        if (chatList.children.length === 0) {
            chatList.innerHTML = '<div class="no-chats">No active conversations</div>';
        }
    }

    function loadChatHistory(sessionId) {
        const chats = JSON.parse(localStorage.getItem('activeChats')) || {};
        const chat = chats[sessionId];
        
        if (chat) {
            chatHistory.innerHTML = '';
            chat.messages.forEach((msg, index) => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.type}`;
                
                const isEditable = (Date.now() - msg.timestamp) <= 300000;
                
                let contentHtml = '';
                if (msg.attachment) {
                    switch (msg.attachment.type) {
                        case 'image':
                            contentHtml = `
                                <div class="attachment-wrapper">
                                    <img src="${msg.attachment.url}" alt="${msg.attachment.name}" class="message-image">
                                    <div class="attachment-info">
                                        <span>${msg.attachment.name}</span>
                                        <span class="file-size">${msg.attachment.size}</span>
                                    </div>
                                </div>`;
                            break;
                        default:
                            contentHtml = `
                                <div class="file-attachment">
                                    <i class="fas fa-file"></i>
                                    <span>${msg.attachment.name}</span>
                                </div>`;
                    }
                } else {
                    contentHtml = `<div class="message-content">${msg.content || ''}</div>`;
                }

                messageDiv.innerHTML = `
                    ${contentHtml}
                    <div class="message-time">${new Date(msg.timestamp).toLocaleString()}</div>
                    ${msg.type === 'agent' ? `
                        <div class="message-actions">
                            ${isEditable ? `
                                <button class="edit-msg" onclick="editMessage('${sessionId}', ${index})">
                                    <i class="fas fa-edit"></i>
                                </button>
                            ` : ''}
                            <button class="delete-msg" onclick="deleteMessage('${sessionId}', ${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    ` : ''}
                `;
                chatHistory.appendChild(messageDiv);
            });
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    }

    // Add these new functions
    // Add these functions outside the DOMContentLoaded event handler
    window.editMessage = function(sessionId, messageIndex) {
        const chats = JSON.parse(localStorage.getItem('activeChats'));
        const message = chats[sessionId].messages[messageIndex];
        
        // Check if message is still editable
        if ((Date.now() - message.timestamp) > 300000) {
            alert('Messages can only be edited within 5 minutes of sending');
            return;
        }
        
        // Create modal for editing
        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <textarea class="edit-textarea">${message.content}</textarea>
                <div class="modal-buttons">
                    <button class="save-btn">Save</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    
        const textarea = modal.querySelector('.edit-textarea');
        const saveBtn = modal.querySelector('.save-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
    
        saveBtn.addEventListener('click', () => {
            const newContent = textarea.value.trim();
            if (newContent && newContent !== message.content) {
                chats[sessionId].messages[messageIndex].content = newContent;
                chats[sessionId].messages[messageIndex].edited = true;
                localStorage.setItem('activeChats', JSON.stringify(chats));
                loadChatHistory(sessionId);
            }
            document.body.removeChild(modal);
        });
    
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    };
    
    window.downloadMessage = function(sessionId, messageIndex) {
        const chats = JSON.parse(localStorage.getItem('activeChats'));
        const message = chats[sessionId].messages[messageIndex];
        const timestamp = new Date(message.timestamp);
        const formattedDate = timestamp.toISOString().split('T')[0];
        
        // Format the message content
        let content = '';
        if (message.type === 'user') {
            content = `Customer Message\n`;
        } else {
            content = `Agent Response\n`;
        }
        content += `Time: ${timestamp.toLocaleString()}\n`;
        content += `Content: ${message.content}\n`;
        
        // Create file based on content type
        let blob;
        let filename;
        
        if (message.content.startsWith('data:image')) {
            // Handle image messages
            const base64Data = message.content.split(',')[1];
            blob = new Blob([atob(base64Data)], { type: 'image/png' });
            filename = `chat-image-${formattedDate}.png`;
        } else if (message.content.includes('<html>')) {
            // Handle HTML content
            blob = new Blob([message.content], { type: 'text/html' });
            filename = `chat-message-${formattedDate}.html`;
        } else {
            // Default to text file
            blob = new Blob([content], { type: 'text/plain' });
            filename = `chat-message-${formattedDate}.txt`;
        }
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    window.deleteMessage = function(sessionId, messageIndex) {
        const modal = document.createElement('div');
        modal.className = 'delete-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <p>Are you sure you want to delete this message?</p>
                <div class="modal-buttons">
                    <button class="confirm-btn">Delete</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    
        const confirmBtn = modal.querySelector('.confirm-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
    
        confirmBtn.addEventListener('click', () => {
            const chats = JSON.parse(localStorage.getItem('activeChats'));
            chats[sessionId].messages.splice(messageIndex, 1);
            localStorage.setItem('activeChats', JSON.stringify(chats));
            loadChatHistory(sessionId);
            document.body.removeChild(modal);
        });
    
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    };
    function deleteMessage(sessionId, messageIndex) {
        if (confirm('Are you sure you want to delete this message?')) {
            const chats = JSON.parse(localStorage.getItem('activeChats'));
            chats[sessionId].messages.splice(messageIndex, 1);
            localStorage.setItem('activeChats', JSON.stringify(chats));
            loadChatHistory(sessionId);
        }
    }

    sendReply.addEventListener('click', () => {
        if (!currentSessionId) {
            alert('Please select a conversation first');
            return;
        }

        const message = replyInput.value.trim();
        if (message) {
            const chats = JSON.parse(localStorage.getItem('activeChats')) || {};
            if (chats[currentSessionId]) {
                chats[currentSessionId].messages.push({
                    type: 'agent',
                    content: message,
                    timestamp: Date.now()
                });
                chats[currentSessionId].lastUpdate = Date.now();
                localStorage.setItem('activeChats', JSON.stringify(chats));
                
                loadChatHistory(currentSessionId);
                replyInput.value = '';
            }
        }
    });

    // Initial load
    loadActiveChats();
    loadChatHistory(currentSessionId);

    // Add auto-refresh functionality
    function autoRefresh() {
        loadActiveChats();
        if (currentSessionId) {
            loadChatHistory(currentSessionId);
        }
    }

    // Set refresh interval (every 5 seconds)
    const refreshInterval = setInterval(autoRefresh, 5000);

    // Clear interval when page is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(refreshInterval);
        } else {
            // Immediate refresh when page becomes visible again
            autoRefresh();
            setInterval(autoRefresh, 5000);
        }
    });

    // Handle Enter key for sending messages
    replyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendReply.click();
        }
    });
    const clearButton = document.getElementById('clearMessages');
    
    clearButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all messages? This action cannot be undone.')) {
            localStorage.removeItem('activeChats');
            chatHistory.innerHTML = '';
            chatList.innerHTML = '<div class="no-chats">No active conversations</div>';
            currentSessionId = null;
            showNotification('All messages have been cleared');
        }
    });

});