import os
import pickle
from flask import Flask, request, jsonify
import sys
print(sys.path)
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Path to the pickle file
PICKLE_FILE = 'users.pkl'

# Load existing users from the pickle file
def load_users():
    if os.path.exists(PICKLE_FILE):
        with open(PICKLE_FILE, 'rb') as f:
            return pickle.load(f)
    return {}

# Save users to the pickle file
def save_users(users):
    with open(PICKLE_FILE, 'wb') as f:
        pickle.dump(users, f)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    users = load_users()

    if username in users:
        return jsonify(success=False, error="User already exists")

    users[username] = password
    save_users(users)
    return jsonify(success=True)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)