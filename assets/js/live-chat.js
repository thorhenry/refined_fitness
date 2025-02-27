const liveChatSystem = {
    init() {
        this.chatMessages = document.querySelector('.chat-messages');
        this.form = document.querySelector('.input-form');
        this.input = this.form.querySelector('input');
        this.setupEventListeners();
        this.responses = this.getResponseDatabase();
        this.typingTimeout = null;
    },

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.form.dispatchEvent(new Event('submit'));
            }
        });
    },

    handleSubmit(e) {
        e.preventDefault();
        const message = this.input.value.trim();
        
        if (message) {
            this.addMessage('user', message);
            this.removeTypingIndicator();
            this.showTypingIndicator();
            this.processUserMessage(message);
            this.input.value = '';
        }
    },

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${this.getCurrentTime()}</div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    },

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    showTypingIndicator() {
        const status = document.createElement('div');
        status.className = 'status';
        status.textContent = 'Agent is typing...';
        this.chatMessages.appendChild(status);
        this.scrollToBottom();
    },

    removeTypingIndicator() {
        const status = document.querySelector('.status');
        if (status) status.remove();
    },

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    },

    processUserMessage(message) {
        clearTimeout(this.typingTimeout);
        
        this.typingTimeout = setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage('agent', response);
        }, 1500);
    },

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for exact matches first
        for (const [key, response] of Object.entries(this.responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        // If no exact match, check categories
        if (lowerMessage.includes('assembly') || lowerMessage.includes('build') || lowerMessage.includes('setup')) {
            return this.responses.assembly;
        }
        if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('track')) {
            return this.responses.shipping;
        }
        if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
            return this.responses.returns;
        }
        if (lowerMessage.includes('broken') || lowerMessage.includes('not working') || lowerMessage.includes('issue')) {
            return this.responses.technical;
        }

        return this.responses.default;
    },

    getResponseDatabase() {
        return {
            'hello': 'Hello! How can I assist you with your fitness equipment today?',
            'hi': 'Hi there! Welcome to Refined Fitness support. How can I help you?',
            'assembly': 'I can help you with assembly instructions. Would you like me to show you our step-by-step guides or connect you with our assembly expert?',
            'shipping': 'For shipping inquiries, I\'ll need your order number to provide specific details. Could you please share that with me?',
            'returns': 'Our return process is straightforward. Would you like me to guide you through the return process or explain our return policy?',
            'technical': 'I understand you\'re experiencing technical issues. Could you please describe the problem in detail, and I\'ll help you troubleshoot?',
            'price': 'I can help you with pricing information. Which equipment are you interested in?',
            'warranty': 'Our equipment comes with comprehensive warranty coverage. Would you like me to explain the warranty terms for a specific product?',
            'maintenance': 'Regular maintenance is important for your equipment. I can provide maintenance tips or schedule a service visit. What would you prefer?',
            'default': 'I understand you need assistance. Could you please provide more details about your inquiry so I can better help you?'
        };
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const quickActions = document.querySelectorAll('.action-btn');

    // Bot responses for different actions
    const botResponses = {
        order: [
            "I'll help you track your order. Please provide your order number.",
            "You can also track your order directly through our website by visiting the 'Order Status' page.",
            "Is there anything specific you'd like to know about your order?"
        ],
        return: [
            "I can help you start a return. Here's what you need to know:",
            "• Returns are accepted within 30 days of delivery for indoor equipment",
            "• 14-day return window for outdoor equipment",
            "• Original packaging is required",
            "Would you like me to guide you through the return process?"
        ],
        warranty: [
            "Here's our warranty information:",
            "• Indoor Equipment: 2-year manufacturer warranty",
            "• Outdoor Equipment: 1-year warranty against defects",
            "• Extended warranty options available",
            "What specific product do you need warranty information for?"
        ]
    };

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Send message function
    // Add this to your existing sendMessage function
    // Modify the sendMessage function
        // Modify the sendMessage function to handle multiple users better
        // Add this function at the beginning
        async function initializeUserLocation() {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    });
                });
        
                const { latitude, longitude } = position.coords;
                
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                );
                const data = await response.json();
                
                const locationInfo = {
                    city: data.address.city || data.address.town || data.address.village || 'Unknown City',
                    country: data.address.country || 'Unknown Country',
                    coords: { latitude, longitude }
                };
        
                localStorage.setItem('userLocation', JSON.stringify(locationInfo));
                return locationInfo;
            } catch (error) {
                console.error('Location error:', error);
                return { city: 'Unknown City', country: 'Unknown Country', coords: null };
            }
        }
    
        function sendMessage(message, type = 'user') {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.innerHTML = `
                <p>${message}</p>
                <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
    
            // Store chat in localStorage
            // Generate new session ID only for new users
            const sessionId = localStorage.getItem('chatSessionId') || generateSessionId();
            const chats = JSON.parse(localStorage.getItem('activeChats')) || {};
            const userLocation = JSON.parse(localStorage.getItem('userLocation'));
            
            if (!chats[sessionId]) {
                chats[sessionId] = {
                    messages: [],
                    lastUpdate: Date.now(),
                    location: userLocation ? `${userLocation.city}, ${userLocation.country}` : 'Location not shared',
                    coordinates: userLocation?.coords || null
                };
            }
    
            chats[sessionId].messages.push({
                type: type,
                content: message,
                timestamp: Date.now()
            });
            chats[sessionId].lastUpdate = Date.now();
    
            localStorage.setItem('activeChats', JSON.stringify(chats));
            localStorage.setItem('chatSessionId', sessionId);
    
            // Forward user messages to agent's email
            if (type === 'user') {
                sendToAgentEmail(message);
            }
        }

    // Function to forward messages to agent
    function sendToAgentEmail(message) {
        const emailData = {
            to: 'thorhenry20@gmail.com',
            subject: 'New Chat Message from Customer',
            body: message,
            timestamp: new Date().toLocaleString(),
            customerInfo: {
                sessionId: generateSessionId(),
                pageUrl: window.location.href
            }
        };

        // Send to your backend endpoint
        fetch('/api/forward-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        })
        .catch(error => console.error('Error forwarding message:', error));
    }

    // Add this function to get user's location
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
                    
                    // Get location name using reverse geocoding
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                        .then(response => response.json())
                        .then(data => {
                            const location = data.display_name;
                            localStorage.setItem('userLocationName', location);
                        })
                        .catch(error => console.error('Error getting location name:', error));
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }

    // Generate unique session ID for conversation tracking
    function generateSessionId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Bot response function
    function sendBotResponses(responses) {
        let delay = 500;
        responses.forEach(response => {
            setTimeout(() => {
                sendMessage(response, 'agent');
            }, delay);
            delay += 1000;
        });
    }

    // Send button click handler
    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            sendMessage(message);
            messageInput.value = '';
            messageInput.style.height = 'auto';
            
            // Generic bot response for regular messages
            setTimeout(() => {
                sendMessage("Thank you for your message. Our support team will respond shortly.", 'agent');
            }, 1000);
        }
    });

    // Enter key handler
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    // Quick action buttons with specific responses
    quickActions.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            let message = '';
            
            switch(action) {
                case 'order':
                    message = 'I would like to track my order.';
                    break;
                case 'return':
                    message = 'I need help with starting a return.';
                    break;
                case 'warranty':
                    message = 'I have a question about warranty coverage.';
                    break;
            }

            if (message) {
                sendMessage(message);
                // Send specific bot responses for the action
                sendBotResponses(botResponses[action]);
            }
        });
    });

    // File attachment functionality
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.multiple = true;
    fileInput.accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png';
    document.body.appendChild(fileInput);

    const paperclip = document.querySelector('.fa-paperclip');
    if (paperclip) {
        paperclip.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
        });
    }

    // Add this function to handle file uploads
    function handleFileUpload(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileData = {
                    url: e.target.result,
                    name: file.name,
                    type: file.type.split('/')[0],
                    size: formatFileSize(file.size)
                };
                resolve(fileData);
            };
            reader.readAsDataURL(file);
        });
    }

    // Add this helper function
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }

    // Modify the sendMessage function
    // Add this function to handle file attachments
    function addMessage(type, content, attachment = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        let messageContent = '';
        if (attachment) {
            switch (attachment.type) {
                case 'image':
                    messageContent = `
                        <div class="attachment-wrapper">
                            <img src="${attachment.url}" alt="${attachment.name}" class="message-image">
                            <div class="attachment-info">
                                <span class="file-name">${attachment.name}</span>
                                <span class="file-size">${attachment.size}</span>
                            </div>
                        </div>`;
                    break;
                default:
                    messageContent = `
                        <div class="file-attachment">
                            <i class="fas fa-file"></i>
                            <span class="file-name">${attachment.name}</span>
                            <span class="file-size">${attachment.size}</span>
                            <a href="${attachment.url}" download="${attachment.name}" class="download-btn">
                                <i class="fas fa-download"></i>
                            </a>
                        </div>`;
            }
        } else {
            messageContent = `<div class="message-content">${content}</div>`;
        }
    
        messageDiv.innerHTML = `
            ${messageContent}
            <div class="message-time">${getCurrentTime()}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Update the sendMessage function
    // Remove the duplicate sendMessage functions and keep this one
    // Add this function to show popup
    function showNotification(message) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        if (!document.querySelector('.notification-container')) {
            document.body.appendChild(container);
        }
    
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
    
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Update the sendMessage function
    function sendMessage(message, type = 'user', attachment = null) {
        if (message || attachment) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.innerHTML = `
                <p>${message}</p>
                <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
    
            // Store chat in localStorage
            // Generate new session ID only for new users
            const sessionId = localStorage.getItem('chatSessionId') || generateSessionId();
            const chats = JSON.parse(localStorage.getItem('activeChats')) || {};
            const userLocation = JSON.parse(localStorage.getItem('userLocation'));
            
            if (!chats[sessionId]) {
                chats[sessionId] = {
                    messages: [],
                    lastUpdate: Date.now(),
                    location: userLocation ? `${userLocation.city}, ${userLocation.country}` : 'Location not shared',
                    coordinates: userLocation?.coords || null
                };
            }
    
            chats[sessionId].messages.push({
                type: type,
                content: message,
                timestamp: Date.now()
            });
            chats[sessionId].lastUpdate = Date.now();
    
            localStorage.setItem('activeChats', JSON.stringify(chats));
            localStorage.setItem('chatSessionId', sessionId);
    
            // Forward user messages to agent's email
            if (type === 'user') {
                sendToAgentEmail(message);
            }
        }
    }

    // Update refreshChat function to handle attachments
    function refreshChat() {
        const sessionId = localStorage.getItem('chatSessionId');
        if (sessionId) {
            const chats = JSON.parse(localStorage.getItem('activeChats')) || {};
            const currentChat = chats[sessionId];
            
            if (currentChat) {
                chatMessages.innerHTML = '';
                
                // Add system welcome message
                const welcomeDiv = document.createElement('div');
                welcomeDiv.className = 'message system';
                welcomeDiv.innerHTML = `
                    <p>Welcome to Refined Fitness Support! How can we help you today?</p>
                    <span class="timestamp">Just now</span>
                `;
                chatMessages.appendChild(welcomeDiv);
    
                // Add all chat messages
                currentChat.messages.forEach(msg => {
                    if (msg.attachment) {
                        sendMessage('', msg.type, msg.attachment);
                    } else {
                        sendMessage(msg.content, msg.type);
                    }
                });
            }
        }
    }

    // Update file input handler
    fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (file) {
            const fileData = await handleFileUpload(file);
            sendMessage('', 'user', fileData);
            this.value = ''; // Reset file input
        }
    });

    // Add this function to refresh chat messages
    function refreshChat() {
        const sessionId = localStorage.getItem('chatSessionId');
        if (sessionId) {
            const chats = JSON.parse(localStorage.getItem('activeChats')) || {};
            const currentChat = chats[sessionId];
            
            if (currentChat) {
                chatMessages.innerHTML = ''; // Clear current messages
                
                // Add system welcome message
                const welcomeDiv = document.createElement('div');
                welcomeDiv.className = 'message system';
                welcomeDiv.innerHTML = `
                    <p>Welcome to Refined Fitness Support! How can we help you today?</p>
                    <span class="timestamp">Just now</span>
                `;
                chatMessages.appendChild(welcomeDiv);

                // Add all chat messages
                currentChat.messages.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message ${msg.type}`;
                    messageDiv.innerHTML = `
                        <p>${msg.content}</p>
                        <span class="timestamp">${new Date(msg.timestamp).toLocaleTimeString()}</span>
                    `;
                    chatMessages.appendChild(messageDiv);
                });
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    }

    // Refresh chat every 3 seconds
    setInterval(refreshChat, 3000);
});