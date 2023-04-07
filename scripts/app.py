from flask import Flask, jsonify
import main

app = Flask(__name__)

@app.route('/execute-script', methods=['GET'])
def execute_script():
    result = main.run_single_iteration()
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)
