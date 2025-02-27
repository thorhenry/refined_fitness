document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("ry-BoOClBJSvulKCj");

    function handleAgentResponse(customerEmail, message) {
        const templateParams = {
            to_email: customerEmail,
            from_name: "Refined Fitness Support",
            message: message,
            reply_to: "support@refinedfitness.com"
        };

        emailjs.send('service_s0mumih', 'template_6fqe6yt', templateParams)
            .then(function() {
                // Add agent's message to the chat
                sendMessage(message, 'agent');
            })
            .catch(function(error) {
                console.error('Error sending response:', error);
                alert('Failed to send response. Please try again.');
            });
    }

    // Add response button to user messages
    function addResponseButton(messageDiv) {
        const responseBtn = document.createElement('button');
        responseBtn.className = 'response-btn';
        responseBtn.innerHTML = '<i class="fas fa-reply"></i>';
        
        responseBtn.addEventListener('click', () => {
            const response = prompt('Enter your response:');
            if (response) {
                handleAgentResponse(customerEmail, response);
            }
        });

        messageDiv.appendChild(responseBtn);
    }

    // Modify the existing sendMessage function
    const originalSendMessage = window.sendMessage;
    window.sendMessage = function(message, type = 'user') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <p>${message}</p>
            <span class="timestamp">${new Date().toLocaleTimeString()}</span>
        `;

        if (type === 'user') {
            addResponseButton(messageDiv);
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
});