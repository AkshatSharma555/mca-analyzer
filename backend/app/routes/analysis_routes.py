# app/routes/analysis_routes.py

from flask import Blueprint, jsonify, request
import datetime
import pandas as pd
import io
from app.services.main_analyzer import analyze_dataframe

analysis_bp = Blueprint('analysis_bp', __name__)

# --- INTELLIGENT COLUMN DETECTION LOGIC ---
POSSIBLE_COMMENT_COLUMNS = ['comment_text', 'comments', 'comment', 'feedback', 'text', 'suggestion', 'review']
POSSIBLE_AUTHOR_COLUMNS = ['author', 'name', 'user', 'stakeholder', 'submitted_by', 'email']

def _find_and_standardize_columns(df: pd.DataFrame):
    """
    Finds relevant columns from a list of possibilities and renames them
    to the standard names our application expects ('comment_text', 'author').
    """
    original_cols = {col.lower().replace(" ", "_"): col for col in df.columns}
    
    found_comment_col = None
    for name in POSSIBLE_COMMENT_COLUMNS:
        if name in original_cols:
            found_comment_col = original_cols[name]
            break
            
    if not found_comment_col:
        return None, "Error: Could not find a valid comment column. Please name it 'comment_text', 'feedback', etc."

    df.rename(columns={found_comment_col: 'comment_text'}, inplace=True)

    found_author_col = None
    for name in POSSIBLE_AUTHOR_COLUMNS:
        if name in original_cols:
            found_author_col = original_cols[name]
            break

    if found_author_col:
        df.rename(columns={found_author_col: 'author'}, inplace=True)
    else:
        # Agar author column na mile, toh ek dummy column bana dein
        df['author'] = "Anonymous"
        
    return df, None


@analysis_bp.route('/analyze', methods=['POST'])
def analyze_text_route():
    # ... (Is function mein koi change nahi hai, yeh aache se kaam kar raha hai)
    data = request.get_json()
    if not data or 'text' not in data or not data['text'].strip():
        return jsonify({ "status": "error", "message": "Input validation failed.", "details": {"text": "The text field is required and cannot be empty."} }), 400
    
    input_text = data['text']
    try:
        # Single text se ek DataFrame banayein
        df = pd.DataFrame([[input_text, "Manual Input"]], columns=['comment_text', 'author'])
        final_analysis_report = analyze_dataframe(df)
        response = { "status": "success", "processedAt": datetime.datetime.utcnow().isoformat() + "Z", "report": final_analysis_report }
        return jsonify(response), 200
    except Exception as e:
        print(f"An error occurred during single text analysis: {e}")
        return jsonify({ "status": "error", "message": "An unexpected error occurred." }), 500


@analysis_bp.route('/analyze-file', methods=['POST'])
def analyze_file_route():
    if 'file' not in request.files or request.files['file'].filename == '':
        return jsonify({"status": "error", "message": "No file selected"}), 400

    file = request.files['file']
    filename = file.filename

    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(file.read().decode('utf-8', errors='ignore')))
        elif filename.endswith('.xlsx'):
            df = pd.read_excel(io.BytesIO(file.read()))
        else:
            return jsonify({"status": "error", "message": "Unsupported file type. Please upload a CSV or XLSX file."}), 400
        
        # --- NAYA INTELLIGENT LOGIC ---
        df, error_message = _find_and_standardize_columns(df)
        if error_message:
            return jsonify({"status": "error", "message": error_message}), 400
        
        final_analysis_report = analyze_dataframe(df)
        response = { "status": "success", "processedAt": datetime.datetime.utcnow().isoformat() + "Z", "report": final_analysis_report }
        return jsonify(response), 200

    except Exception as e:
        print(f"Error processing file: {e}")
        return jsonify({"status": "error", "message": f"Failed to process file. Error: {str(e)}"}), 500