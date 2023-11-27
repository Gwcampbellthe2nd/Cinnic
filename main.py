from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the pretrained model and tokenizer
model_name = "TheBloke/llama2_7b_chat_uncensored-AWQ"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Move the model to a CUDA device if available
device = torch.device("cuda:0")
model.to(device)

@app.route('/generate-text', methods=['POST'])
def generate_text():
    data = request.json
    prompt = data['prompt']

    # Tokenize the input prompt
    input_ids = tokenizer.encode(prompt, return_tensors="pt").to(device)

    # Generate text using the model
    output = model.generate(input_ids, max_length=512, num_return_sequences=1, temperature=0.8, top_p=0.95)

    # Decode the generated text
    generated_text = tokenizer.decode(output[0], skip_special_tokens=True)

    # Process the text to remove the repeated prompt
    processed_text = process_response(prompt, generated_text)

    return jsonify(response=processed_text)

def process_response(prompt, text):
    # Remove the prompt from the start of the text, if present
    if text.lower().startswith(prompt.lower()):
        text = text[len(prompt):].strip()
    # You can add additional processing here if necessary
    return text

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=False)
