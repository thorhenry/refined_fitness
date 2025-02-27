document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded');
    
    // Initialize EmailJS
    emailjs.init("ry-BoOClBJSvulKCj");
    
    const buttons = document.querySelectorAll('.buy-btn');
    console.log('Found buttons:', buttons.length);

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Button clicked');
            e.preventDefault();
            
            const card = this.closest('.equipment-card');
            const model = card.querySelector('h3').textContent;
            const description = card.querySelector('.description').textContent;
            
            console.log('Model:', model);
            console.log('Description:', description);
            
            sessionStorage.setItem('inquiryModel', model);
            sessionStorage.setItem('inquiryDescription', description);
            
            window.location.href = 'inquiry.html';
        });
    });

    const inquiryForm = document.getElementById('inquiryForm');
    const equipmentInput = document.getElementById('equipment');

    // Pre-fill form if coming from equipment page
    if (equipmentInput && sessionStorage.getItem('inquiryModel')) {
        equipmentInput.value = sessionStorage.getItem('inquiryModel');
        
        // Clear the storage after using it
        sessionStorage.removeItem('inquiryModel');
        sessionStorage.removeItem('inquiryDescription');
    }

    // Only add form submit listener if form exists
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading">Sending...</span>';
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            if (!validateForm(data)) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Inquiry';
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
                        company: data.company || "Not specified",
                        equipment_model: data.equipment,
                        quantity: data.quantity,
                        message: data.message || "No additional message",
                        reply_to: data.email,
                        inquiry_details: `Model: ${data.equipment}\nQuantity: ${data.quantity}\nContact Number: ${data.phone}\nCompany: ${data.company || "Not specified"}`
                    }
                );
                
                showSuccessMessage('Thank you for your inquiry! We will contact you soon.');
                inquiryForm.reset();
                
                sessionStorage.removeItem('inquiryModel');
                sessionStorage.removeItem('inquiryPrice');
                sessionStorage.removeItem('inquiryDescription');
                
            } catch (error) {
                showErrorMessage('Something went wrong. Please try again.');
                console.error('Email error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Inquiry';
            }
        });
    }

    function validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s-]{10,}$/;

        if (!data.name || data.name.length < 2) {
            showErrorMessage('Please enter a valid name');
            return false;
        }

        if (!emailRegex.test(data.email)) {
            showErrorMessage('Please enter a valid email address');
            return false;
        }

        if (!phoneRegex.test(data.phone)) {
            showErrorMessage('Please enter a valid phone number');
            return false;
        }

        if (!data.equipment) {
            showErrorMessage('Please specify the equipment model');
            return false;
        }

        if (!data.quantity || data.quantity < 1) {
            showErrorMessage('Please enter a valid quantity');
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

// Add this CSS to your inquiry.css file
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .loading {
        display: inline-block;
        position: relative;
    }

    .loading::after {
        content: '...';
        position: absolute;
        animation: dots 1.5s infinite;
    }

    @keyframes dots {
        0%, 20% { content: '.'; }
        40%, 60% { content: '..'; }
        80%, 100% { content: '...'; }
    }
`;
document.head.appendChild(style);