
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
import sys
import os
import io

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from LLM.majorsGraph import MajorGraph
from LLM.main_copy import aggregate_and_generate_response
from LLM.main_copy import setup_environment
app = Flask(__name__)
CORS(app)


@app.route('/llm/generate-response', methods=['POST'])
def generate_graduation_plan():
    try:
        data = request.get_json()
        user_question = data.get('user_question', '')

        if not user_question:
            return jsonify({"error": "User question is required"}), 400

        result = aggregate_and_generate_response(user_question)

        return jsonify({"graduation_plan": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/llm/setup-environment', methods=['POST'])
def handle_setup_environment():
    if 'transcript' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    transcript = request
    try:
        setup_environment(transcript)
        return jsonify({"message": "Environment setup successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/llm/generate-major-graph', methods=['POST'])
def generate_major_graph():
    try:
        data = request.get_json()
        major_name = data.get('major_name', '')

        if not major_name:
            return jsonify({"error": "Major name is required"}), 400

        # Initialize MajorGraph with the CSV file path
        csv_path = os.path.join(os.path.dirname(
            __file__), '..', 'LLM', '/Users/mostafa/newFianlLLMRepo/IAAS/LLMAcadamic-Advisor/LLM/all_abington_majors_combined(5).csv')
        mg = MajorGraph(csv_path)

        # Generate the graph and get the image buffer
        image_buffer = mg.draw_major_graph(major_name)

        # Return the image as a response
        return send_file(
            image_buffer,
            mimetype='image/png',
            as_attachment=False
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
