document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('send-button').addEventListener('click', function() {
        var userInput = document.getElementById('message-input').value;
        document.getElementById('message-input').value = '';

        addMessageToChat('user', userInput);
        showTypingIndicator(true);

        fetch('http://127.0.0.1:5000/generate-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: userInput })
        })
        .then(response => response.json())
        .then(data => {
            showTypingIndicator(false);
            addMessageToChat('ai', data.response);
        })
        .catch(error => {
            showTypingIndicator(false);
            console.error('Error:', error);
        });
    });

    function addMessageToChat(sender, message) {
        var messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'ai' ? 'ai-message' : 'user-message');
        document.getElementById('messages-area').appendChild(messageElement);
        messageElement.scrollIntoView({ behavior: 'smooth' });
    }

    function showTypingIndicator(show) {
        document.getElementById('typing-indicator').style.display = show ? 'flex' : 'none';
    }

    var animation = lottie.loadAnimation({
        container: document.getElementById('lottie-animation'), // the dom element
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: './static/background.json', // the path to the animation json
        name: "MyAnimation", // Name for future reference. Optional.
    });

    // Set the animation speed to 25%
    animation.setSpeed(0.25);
});
