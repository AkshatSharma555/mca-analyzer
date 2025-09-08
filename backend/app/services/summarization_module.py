import os
import re
import nltk
import pandas as pd
from dotenv import load_dotenv
from transformers import pipeline

# --- Setup & Model Loading (No changes) ---
load_dotenv()
IS_DEV_MODE = os.getenv("DEV_MODE") == "True"

summarizer_long, summarizer_short = None, None

try:
    nltk.data.find("tokenizers/punkt")
    nltk.data.find("taggers/averaged_perceptron_tagger")
except LookupError:
    print("Downloading NLTK data (punkt, averaged_perceptron_tagger)...")
    nltk.download("punkt")
    nltk.download("averaged_perceptron_tagger")
    print("NLTK data downloaded.")

if not IS_DEV_MODE:
    print("PROD MODE: Loading Summarization models...")
    summarizer_long = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
    summarizer_short = pipeline("summarization", model="sshleifer/distilbart-cnn-6-6")
    print("Summarization models loaded.")
else:
    print("DEV MODE: Skipping Summarization model loading.")

THEMES = {
    "Timeline & Implementation": ["timeline", "deadline", "extension", "implement", "schedule", "phase", "rollout"],
    "Cost & Financial Burden": ["cost", "burden", "financial", "expense", "economic", "price", "charge", "subsidy"],
    "Environmental Concerns": ["environment", "pollution", "sustainability", "green", "nature", "eco-friendly"],
    "Compliance & Regulation": ["compliance", "regulation", "rule", "policy", "clause", "section", "guideline"],
}

# --- Helper Functions (No changes in existing helpers) ---

def _extract_key_phrases(text: str) -> str:
    # This function remains unchanged
    try:
        words = nltk.word_tokenize(text)
        tagged_words = nltk.pos_tag(words)
        key_phrases = []
        for i in range(len(tagged_words) - 1):
            if tagged_words[i][1].startswith("JJ") and tagged_words[i + 1][1].startswith("NN"):
                key_phrases.append(f"{tagged_words[i][0]} {tagged_words[i+1][0]}")
        if not key_phrases:
            nouns = [word for word, tag in tagged_words if tag.startswith("NN")]
            key_phrases = list(dict.fromkeys(nouns))[:5]
        if not key_phrases: return "General feedback provided."
        return "Key Issues: " + ", ".join(key_phrases)
    except Exception as e:
        print(f"Error in key phrase extraction: {e}")
        return "Could not determine key issues from the short text."

def _classify_comment(comment_text: str) -> str:
    # This function remains unchanged
    comment_lower = comment_text.lower()
    for theme, keywords in THEMES.items():
        if any(keyword in comment_lower for keyword in keywords):
            return theme
    return "General Feedback"

# --- NAYA HELPER FUNCTION: Actionable Suggestion Hunter ---
def _find_actionable_suggestions(df: pd.DataFrame) -> list:
    """Finds comments that likely contain actionable suggestions."""
    SUGGESTION_TRIGGERS = [
        "recommend", "suggest", "propose", "should consider", 
        "a solution would be", "a better approach", "request that",
        "urge the ministry", "a subsidy should be"
    ]
    
    suggestions = []
    # DataFrame mein 'author' column ho bhi sakta hai aur nahi bhi, isliye check karein
    has_author = 'author' in df.columns

    for index, row in df.iterrows():
        comment_lower = row["comment_text"].lower()
        if any(trigger in comment_lower for trigger in SUGGESTION_TRIGGERS):
            suggestion_data = {
                "author": row["author"] if has_author else "Anonymous",
                "comment": row["comment_text"]
            }
            suggestions.append(suggestion_data)
            
    return suggestions

def _get_thematic_summaries(df: pd.DataFrame) -> list:
    # This function remains unchanged (but we will need to create the 'theme' column before calling it)
    thematic_summaries = []
    for theme in df["theme"].unique():
        theme_df = df[df["theme"] == theme]
        comments_for_theme = ". ".join(theme_df["comment_text"].dropna().astype(str).tolist())
        input_length = len(comments_for_theme.split())
        if input_length < 50:
            summary = _extract_key_phrases(comments_for_theme)
        else:
            dynamic_max_length = min(150, int(input_length * 0.4)); dynamic_min_length = max(30, int(dynamic_max_length * 0.3))
            if dynamic_min_length >= dynamic_max_length: dynamic_min_length = int(dynamic_max_length * 0.5)
            summary = summarizer_long(comments_for_theme, max_length=dynamic_max_length, min_length=dynamic_min_length, do_sample=False)[0]["summary_text"]
        thematic_summaries.append({"theme": theme, "comment_count": len(theme_df), "summary": summary})
    return thematic_summaries

def _get_notable_individual_summaries(df: pd.DataFrame, min_word_count: int = 75) -> list:
    # This function remains unchanged
    long_comments_df = df[df["comment_text"].str.split().str.len() >= min_word_count]
    if long_comments_df.empty: return []
    summaries = []
    for _, row in long_comments_df.iterrows():
        original_comment = row["comment_text"]
        input_length = len(original_comment.split()); dynamic_max_length = min(50, int(input_length * 0.5)); dynamic_min_length = max(15, int(dynamic_max_length * 0.3))
        if dynamic_min_length >= dynamic_max_length: dynamic_min_length = int(dynamic_max_length * 0.5)
        summary = summarizer_short(original_comment, max_length=dynamic_max_length, min_length=dynamic_min_length, do_sample=False)[0]["summary_text"]
        summaries.append({"original_comment_preview": original_comment[:100] + "...", "summary": summary})
    return summaries

# --- Main Orchestrator Function (Updated) ---
def generate_comprehensive_summary_report(df: pd.DataFrame) -> dict:
    # BADLAAV: Ab yeh naye feature ko bhi call karega
    
    if IS_DEV_MODE:
        return {
            "executive_summary": "This is a dummy executive summary for DEV MODE.",
            "thematic_insights": [
                {"theme": "DUMMY_THEME", "comment_count": 10, "summary": "Dummy theme summary."}
            ],
            "notable_individual_summaries": [
                {"original_comment_preview": "This is a long dummy comment...", "summary": "This is its short dummy summary."}
            ],
            "actionable_suggestions": [{"author": "Dummy User", "comment": "I suggest a dummy solution."}] # Dummy data
        }

    if not summarizer_long or not summarizer_short:
        raise RuntimeError("Summarization models are not available in production mode.")

    # IMPORTANT: 'theme' column ko pehle banana zaroori hai
    df["theme"] = df["comment_text"].dropna().astype(str).apply(_classify_comment)

    thematic_summaries = _get_thematic_summaries(df)
    notable_summaries = _get_notable_individual_summaries(df)
    
    # NAYA: Suggestion Hunter ko call karein
    actionable_suggestions = _find_actionable_suggestions(df)

    text_for_executive_summary = ". ".join([s["summary"] for s in thematic_summaries if "Key Issues:" not in s["summary"] and "Not enough content" not in s["summary"]])
    executive_summary = "An overall executive summary could not be generated."
    if len(text_for_executive_summary.split()) > 20:
        input_length = len(text_for_executive_summary.split()); dynamic_max_length = min(80, int(input_length * 0.5)); dynamic_min_length = max(25, int(dynamic_max_length * 0.3))
        if dynamic_min_length >= dynamic_max_length: dynamic_min_length = int(dynamic_max_length * 0.5)
        executive_summary = summarizer_short(text_for_executive_summary, max_length=dynamic_max_length, min_length=dynamic_min_length, do_sample=False)[0]["summary_text"]

    return {
        "executive_summary": executive_summary,
        "thematic_insights": thematic_summaries,
        "notable_individual_summaries": notable_summaries,
        "actionable_suggestions": actionable_suggestions, # Naya data
    }

