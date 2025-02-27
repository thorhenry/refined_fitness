document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("ry-BoOClBJSvulKCj");

    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading">Sending...</span>';
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            if (!validateForm(data)) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                return;
            }

            try {
                await emailjs.send(
                    "service_s0mumih",
                    "template_uezxvdh",
                    {
                        to_name: "Refined Fitness",
                        from_name: data.name,
                        from_email: data.email,
                        phone_number: data.phone,
                        message: data.message,
                        reply_to: data.email,
                        subject: data.subject || "General Inquiry"
                    }
                );
                
                showSuccessMessage('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                
            } catch (error) {
                showErrorMessage('Something went wrong. Please try again.');
                console.error('Email error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }

    function validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.name || data.name.length < 2) {
            showErrorMessage('Please enter a valid name');
            return false;
        }

        if (!emailRegex.test(data.email)) {
            showErrorMessage('Please enter a valid email address');
            return false;
        }

        if (!data.message || data.message.length < 10) {
            showErrorMessage('Please enter a message (minimum 10 characters)');
            return false;
        }

        return true;
    }

    function showSuccessMessage(message) {
        const toast = createToast(message, 'success');
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    function showErrorMessage(message) {
        const toast = createToast(message, 'error');
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    function createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        toast.textContent = message;
        return toast;
    }
});