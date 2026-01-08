"""
Flask Backend API for Plagiarism Detection System
Serves both API and Frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from plagiarism_engine import analyze_plagiarism
import time

app = Flask(__name__)

# Enable CORS for all origins (you'll update this with your Vercel URL later)
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],  # Allow all origins for now
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})


@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "Plagiarism Detection API by Algo Avengers",
        "endpoints": {
            "health": "/api/health",
            "check_plagiarism": "/api/check-plagiarism"
        }
    })


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Plagiarism Detection API"
    })


@app.route('/api/check-plagiarism', methods=['POST'])
def check_plagiarism():
    """
    Endpoint to check plagiarism between two code snippets
    """
    try:
        data = request.get_json()
        
        program1 = data.get('program1', '')
        program2 = data.get('program2', '')
        
        if not program1 or not program2:
            return jsonify({
                "success": False,
                "error": "Both programs are required"
            }), 400
        
        # Add small delay to simulate processing (optional)
        time.sleep(1)
        
        # Run plagiarism analysis
        result = analyze_plagiarism(program1, program2)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500


@app.route('/api/check-text-plagiarism', methods=['POST'])
def check_text_plagiarism():
    """
    Placeholder endpoint for text plagiarism (not implemented yet)
    """
    return jsonify({
        "success": False,
        "error": "Text plagiarism detection is not yet implemented"
    }), 501


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    
    print("=" * 60)
    print("🚀 Plagiarism Detection API Starting...")
    print("=" * 60)
    print(f"📍 Running on port: {port}")
    print("🔧 Made by RV and Algo Avengers Team")
    print("⚠️  Memory-optimized mode: Models lazy-loaded")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=port, debug=False)