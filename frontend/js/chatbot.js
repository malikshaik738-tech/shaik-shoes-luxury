/**
 * SHAIK LUXURY — AI CHATBOT ASSISTANT
 */

(function () {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotMinimize = document.getElementById('chatbotMinimize');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatbotMessages = document.getElementById('chatbotMessages');

    if (!chatbotToggle) return;

    let isOpen = false;

    // ===== AI RESPONSES =====
    const AI_RESPONSES = {
        'collection': 'Our current collection features 6 exclusive lines: APEX PRO, NOIR, AURUM (Gold Edition), CLASSIQUE, PHANTOM, and ZENITH. Each is handcrafted to perfection. Would you like to explore a specific series?',
        'latest collection': 'Our newest arrivals are the SHAIK NOIR (Midnight Collection) and SHAIK PHANTOM (Shadow Series). Both are limited editions with extraordinary craftsmanship. Shall I show you more details?',
        'price': 'SHAIK sneakers range from ₹54,999 (Classique) to ₹159,999 (Zenith). Each piece represents uncompromising luxury and is priced accordingly. Our most popular model, the APEX PRO, is ₹89,999.',
        'size': 'We offer sizes EU 40–45. For the perfect fit, we recommend measuring your foot and comparing with our size guide. EU sizing tends to be generous — most customers go true to size.',
        'what sizes': 'We offer European sizes 40, 41, 42, 43, 44, and 45. Half sizes are not available, so we recommend sizing up if between sizes. Our concierge team can assist with personalized sizing advice.',
        'shipping': 'We offer worldwide shipping. India: 2-3 business days. International: 5-7 business days. All orders include white-glove packaging, certificate of authenticity, and complimentary leather care kit.',
        'shipping info': 'Domestic delivery (India): 2-3 days via premium courier. International: 5-7 days, fully insured. Free shipping on all orders. Every pair arrives in our signature luxury box with gold-lined interior.',
        'return': 'We offer a 7-day return policy for unworn items in original packaging. Given the exclusive nature of our products, all returns are subject to authentication. Contact our concierge at care@shaikx.com.',
        'material': 'Our sneakers use only the finest materials: Full-grain Italian leather from Florence, artisanal suede, carbon fiber composite soles, and 18-karat gold-plated hardware on limited editions.',
        'contact': 'Reach our luxury concierge team at care@shaikx.com or WhatsApp +91 98765 43210. Our boutique in Mumbai is at 14 Linking Road, Bandra West. We respond within 2 hours during business hours.',
        'order': 'To place an order, simply select your product, choose your size, and add to cart. We accept Stripe, Razorpay, UPI, and bank transfers. All transactions are SSL secured.',
        'recommend': 'Based on our bestsellers, I recommend the SHAIK APEX PRO — it\'s our most beloved model with 5-star reviews. For something more exclusive, the AURUM Gold Edition (only 50 pairs) is extraordinary.',
        'default': 'Thank you for your question. Our luxury concierge would love to assist you personally. Feel free to ask about our collection, sizing, materials, pricing, shipping, or anything else. You can also reach us at care@shaikx.com.'
    };

    function getAIResponse(message) {
        const msg = message.toLowerCase();
        for (const [key, response] of Object.entries(AI_RESPONSES)) {
            if (msg.includes(key)) return response;
        }

        // Smart matching
        if (msg.includes('buy') || msg.includes('purchase')) return AI_RESPONSES['order'];
        if (msg.includes('delivery') || msg.includes('track')) return AI_RESPONSES['shipping'];
        if (msg.includes('shoe') || msg.includes('sneaker') || msg.includes('product')) return AI_RESPONSES['collection'];
        if (msg.includes('expensive') || msg.includes('cost')) return AI_RESPONSES['price'];
        if (msg.includes('care') || msg.includes('clean') || msg.includes('maintain')) return 'For leather care, use a soft cloth and leather conditioner. Avoid direct sunlight and moisture. Our complimentary care kit includes everything you need to keep your SHAIK in pristine condition for decades.';
        if (msg.includes('limited') || msg.includes('exclusive') || msg.includes('rare')) return 'Our Limited and Exclusive editions are produced in runs of 25–200 pairs globally. Once sold out, they do not return. The ZENITH is our rarest, with only 25 pairs ever made. I recommend securing your pair today.';
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) return 'Hello! Welcome to SHAIK Luxury. I\'m your personal style advisor. How may I assist you in finding your perfect pair today?';
        if (msg.includes('thank')) return 'It\'s our pleasure. At SHAIK, luxury is in every detail — including our service. Is there anything else I can help you with?';

        return AI_RESPONSES['default'];
    }

    function addMessage(text, isUser = false, delay = 0) {
        setTimeout(() => {
            const msgEl = document.createElement('div');
            msgEl.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
            msgEl.innerHTML = `<span class="msg-bubble">${text}</span>`;
            chatbotMessages.appendChild(msgEl);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, delay);
    }

    function addTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'chat-msg bot typing-indicator';
        typing.id = 'typingIndicator';
        typing.innerHTML = `<span class="msg-bubble" style="display:flex;gap:4px;align-items:center;">
      <span style="width:6px;height:6px;border-radius:50%;background:#C9A84C;animation:dotBounce 1s ease-in-out infinite;"></span>
      <span style="width:6px;height:6px;border-radius:50%;background:#C9A84C;animation:dotBounce 1s ease-in-out 0.2s infinite;"></span>
      <span style="width:6px;height:6px;border-radius:50%;background:#C9A84C;animation:dotBounce 1s ease-in-out 0.4s infinite;"></span>
    </span>`;
        chatbotMessages.appendChild(typing);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        if (!document.querySelector('[data-dot-anim]')) {
            const style = document.createElement('style');
            style.setAttribute('data-dot-anim', '');
            style.textContent = `@keyframes dotBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`;
            document.head.appendChild(style);
        }
        return typing;
    }

    function sendMessage(text) {
        if (!text.trim()) return;
        addMessage(text, true);
        if (chatInput) chatInput.value = '';

        const typing = addTypingIndicator();
        const responseTime = 800 + Math.random() * 800;

        setTimeout(() => {
            typing.remove();
            addMessage(getAIResponse(text));
        }, responseTime);
    }

    // ===== TOGGLE =====
    chatbotToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        if (chatbotWindow) chatbotWindow.style.display = isOpen ? 'block' : 'none';
    });
    if (chatbotMinimize) {
        chatbotMinimize.addEventListener('click', () => {
            isOpen = false;
            if (chatbotWindow) chatbotWindow.style.display = 'none';
        });
    }

    // ===== SEND =====
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', () => {
            if (chatInput) sendMessage(chatInput.value);
        });
    }
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMessage(chatInput.value);
        });
    }

    // ===== SUGGESTIONS =====
    window.chatSuggest = function (text) {
        if (chatInput) chatInput.value = text;
        sendMessage(text);
    };
})();
