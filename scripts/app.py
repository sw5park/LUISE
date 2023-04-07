from flask import Flask, jsonify, make_response
from flask_cors import CORS  # Add this import
import main

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/execute-script', methods=['GET'])
def execute_script():
    result = main.run_single_iteration()
    response = make_response(jsonify({"result": result}))
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

if __name__ == '__main__':
    app.run(debug=True)
