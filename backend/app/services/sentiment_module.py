import os
from dotenv import load_dotenv
from transformers import pipeline
import pandas as pd
from collections import defaultdict, Counter
import re
import nltk


# --- Setup & Model Loading ---
load_dotenv()
IS_DEV_MODE = os.getenv('DEV_MODE') == 'True'
sentiment_pipeline, emotion_pipeline = None, None
if not IS_DEV_MODE:
    print("PROD MODE: Loading Sentiment model...")
    sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
    print("Sentiment model loaded.")
    print("PROD MODE: Loading Emotion model...")
    emotion_pipeline = pipeline("text-classification", model="bhadresh-savani/bert-base-uncased-emotion")
    print("Emotion model loaded.")
else:
    print("DEV MODE: Skipping AI model loading.")

try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('punkt')
    nltk.download('averaged_perceptron_tagger')

# --- Helper Functions ---
def _get_polarity_label(score):
    if score > 0.6: return "Strongly Positive"
    if score > 0.2: return "Positive"
    if score >= -0.2: return "Neutral / Mixed"
    if score < -0.6: return "Strongly Negative"
    return "Negative"

def _generate_executive_finding(overall_stats, aspect_summary):
    if not aspect_summary: return "No specific themes were identified."
    overall_sentiment = "Mixed"
    if overall_stats['positive_percentage'] > 65: overall_sentiment = "Largely Positive"
    if overall_stats['negative_percentage'] > 65: overall_sentiment = "Largely Negative"
    top_aspect = aspect_summary[0]
    top_aspect_name = top_aspect['aspect']
    top_aspect_polarity = _get_polarity_label(top_aspect['avg_polarity_score']).lower()
    return f"The overall feedback is {overall_sentiment}. The most discussed topic is '{top_aspect_name}', which is viewed as {top_aspect_polarity} by stakeholders."

def _extract_sentiment_phrases(text: str):
    words = nltk.word_tokenize(text)
    tagged = nltk.pos_tag(words)
    phrases = [word for word, tag in tagged if tag.startswith('JJ') or tag.startswith('NN')]
    return list(dict.fromkeys(phrases))[:5]

def _categorize_stakeholder(author_string):
    if not isinstance(author_string, str): return "Anonymous"
    author_lower = author_string.lower()
    if any(keyword in author_lower for keyword in ["lawyer", "legal", "advocate"]): return "Legal Professional"
    if any(keyword in author_lower for keyword in ["founder", "startup"]): return "Startup Founder"
    if any(keyword in author_lower for keyword in ["smb", "owner", "business"]): return "Business Owner"
    if any(keyword in author_lower for keyword in ["environment", "activist"]): return "Environmental Advocate"
    if any(keyword in author_lower for keyword in ["investor"]): return "Investor"
    if any(keyword in author_lower for keyword in ["economist", "ceo"]): return "Corporate & Economic Expert"
    return "Anonymous / Other"

def _perform_stakeholder_analysis(df: pd.DataFrame) -> list:
    if 'author' not in df.columns or 'theme' not in df.columns: return []
    df['stakeholder_group'] = df['author'].apply(_categorize_stakeholder)
    stakeholder_summary = []
    for group in df['stakeholder_group'].unique():
        if group == "Anonymous / Other": continue
        group_df = df[df['stakeholder_group'] == group]
        if group_df.empty: continue
        positive_count = (group_df['sentiment_label'] == 'POSITIVE').sum()
        negative_count = (group_df['sentiment_label'] == 'NEGATIVE').sum()
        total = len(group_df)
        overall_sentiment = "Mixed"
        if total > 0 and positive_count / total >= 0.7: overall_sentiment = "Overwhelmingly Positive"
        elif total > 0 and negative_count / total >= 0.7: overall_sentiment = "Overwhelmingly Negative"
        elif total > 0 and positive_count / total > 0.6: overall_sentiment = "Mostly Positive"
        elif total > 0 and negative_count / total > 0.6: overall_sentiment = "Mostly Negative"
        top_concern = Counter(group_df['theme']).most_common(1)[0][0]
        stakeholder_summary.append({ "stakeholder_group": group, "comment_count": total, "overall_sentiment": overall_sentiment, "top_concern": top_concern })
    return stakeholder_summary

# --- Main Analysis Function ---
def analyze_sentiment(df: pd.DataFrame) -> dict:
    if IS_DEV_MODE:
        return {"executive_finding": "Dummy finding.", "overall": {}, "aspect_summary": [], "stakeholder_analysis": [], "contradictory_comments": []}
    if not sentiment_pipeline or not emotion_pipeline: 
        raise RuntimeError("AI models are not available.")

    comments = df['comment_text'].dropna().astype(str).tolist()
    individual_results = sentiment_pipeline(comments)
    labels = [res['label'] for res in individual_results]
    total = len(labels)
    positive_count = labels.count('POSITIVE')
    negative_count = labels.count('NEGATIVE')
    overall_sentiment_stats = { "positive_percentage": round((positive_count / total) * 100, 2) if total > 0 else 0, "negative_percentage": round((negative_count / total) * 100, 2) if total > 0 else 0, "total_comments": total }
    
    aspect_data = defaultdict(lambda: { "positive_mentions": 0, "negative_mentions": 0, "polarity_scores": [], "key_phrases": {"POSITIVE": [], "NEGATIVE": []}, "impactful_comments": {"POSITIVE": {"text": "", "score": 0}, "NEGATIVE": {"text": "", "score": 0}}, "emotion_counts": Counter() })
    contradictory_comments = []
    for i, comment in enumerate(comments):
        sentences = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s', comment)
        comment_sentiments = set()
        for sentence in sentences:
            if not sentence.strip(): continue
            found_theme = df.iloc[i]['theme'] # Wapas 'theme' (singular) par aa gaye
            if not found_theme or "General Feedback" in found_theme: continue
            sentiment = sentiment_pipeline(sentence)[0]; label = sentiment['label']; score = sentiment['score']
            comment_sentiments.add(label)
            emotion = emotion_pipeline(sentence)[0]
            phrases = _extract_sentiment_phrases(sentence)
            # Ab yahan multiple themes ka loop nahi hai
            aspect_data[found_theme][f"{label.lower()}_mentions"] += 1
            polarity = score if label == 'POSITIVE' else -score
            aspect_data[found_theme]["polarity_scores"].append(polarity)
            aspect_data[found_theme]["key_phrases"][label].extend(phrases)
            if score > aspect_data[found_theme]["impactful_comments"][label]["score"]:
                aspect_data[found_theme]["impactful_comments"][label] = {"text": sentence, "score": score}
            aspect_data[found_theme]["emotion_counts"][emotion['label']] += 1
        if 'POSITIVE' in comment_sentiments and 'NEGATIVE' in comment_sentiments:
            contradictory_comments.append(comment)
            
    aspect_summary = []
    for theme, data in aspect_data.items():
        avg_polarity = sum(data['polarity_scores']) / len(data['polarity_scores']) if data['polarity_scores'] else 0
        emotion_breakdown = [{"emotion": emo, "count": count} for emo, count in data['emotion_counts'].most_common()]
        aspect_summary.append({ "aspect": theme, "positive_mentions": data['positive_mentions'], "negative_mentions": data['negative_mentions'], "avg_polarity_score": round(avg_polarity, 2), "polarity_label": _get_polarity_label(avg_polarity), "key_positive_phrases": list(dict.fromkeys(data['key_phrases']['POSITIVE']))[:5], "key_negative_phrases": list(dict.fromkeys(data['key_phrases']['NEGATIVE']))[:5], "most_impactful_positive_comment": data['impactful_comments']['POSITIVE']['text'], "most_impactful_negative_comment": data['impactful_comments']['NEGATIVE']['text'], "emotion_breakdown": emotion_breakdown })
    
    sorted_aspect_summary = sorted(aspect_summary, key=lambda x: x['positive_mentions'] + x['negative_mentions'], reverse=True)
    stakeholder_report = _perform_stakeholder_analysis(df)
    executive_finding = _generate_executive_finding(overall_sentiment_stats, sorted_aspect_summary)

    return {
        "executive_finding": executive_finding, "overall": overall_sentiment_stats,
        "aspect_summary": sorted_aspect_summary, "stakeholder_analysis": stakeholder_report,
        "contradictory_comments": contradictory_comments
    }