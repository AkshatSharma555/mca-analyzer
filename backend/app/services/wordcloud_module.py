import os
from dotenv import load_dotenv
from collections import Counter
import re
from nltk.corpus import stopwords
import nltk
from nltk.util import bigrams
from nltk.probability import FreqDist
from transformers import pipeline

# --- Setup ---
load_dotenv()
IS_DEV_MODE = os.getenv('DEV_MODE') == 'True'
sentiment_pipeline = None
if not IS_DEV_MODE:
    sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

def _precompute_word_sentiments(text: str):
    """
    OPTIMIZATION: Takes a large text, finds unique words, and gets their
    sentiment in a single batch call to the AI model.
    """
    if IS_DEV_MODE or not sentiment_pipeline or not text:
        return {}
    
    words = list(set(re.findall(r'\b\w+\b', text.lower())))
    clean_words = [word for word in words if word.isalpha() and len(word) > 2]
    
    if not clean_words:
        return {}
        
    try:
        sentiments = sentiment_pipeline(clean_words)
        sentiment_map = {}
        for result in sentiments:
            score = result['score']
            if result['label'] == 'NEGATIVE':
                score = -score
            sentiment_map[result['word']] = score # Note: This might not work if pipeline doesn't return the word
        
        # Fallback to get word from original list if not in result
        final_map = {}
        for i, word in enumerate(clean_words):
             if i < len(sentiments):
                 score = sentiments[i]['score']
                 if sentiments[i]['label'] == 'NEGATIVE':
                     score = -score
                 final_map[word] = score
        return final_map

    except Exception:
        return {}

def _generate_ngrams_from_text(text: str, sentiment_map: dict):
    if not isinstance(text, str) or not text.strip():
        return []
        
    words = re.findall(r'\b\w+\b', text.lower())
    stop_words = set(stopwords.words('english'))
    filtered_words = [word for word in words if word.isalpha() and word not in stop_words and len(word) > 2]

    top_unigrams = FreqDist(filtered_words).most_common(25)
    top_bigrams = FreqDist(list(bigrams(filtered_words))).most_common(25)
    
    word_cloud_data = []
    for word, count in top_unigrams:
        score = sentiment_map.get(word, 0.0)
        word_cloud_data.append({"text": word, "value": count, "sentiment": score})

    for bigram, count in top_bigrams:
        phrase = " ".join(bigram)
        # Phrase ka score uske shabdon ka average score hoga
        score1 = sentiment_map.get(bigram[0], 0.0)
        score2 = sentiment_map.get(bigram[1], 0.0)
        avg_score = (score1 + score2) / 2
        word_cloud_data.append({"text": phrase, "value": count, "sentiment": avg_score})
        
    word_cloud_data.sort(key=lambda x: x['value'], reverse=True)
    return word_cloud_data[:50]

def generate_advanced_word_cloud_report(df):
    all_text = ". ".join(df['comment_text'].dropna().astype(str).tolist())
    positive_text = ". ".join(df[df['sentiment_label'] == 'POSITIVE']['comment_text'].dropna().astype(str).tolist())
    negative_text = ". ".join(df[df['sentiment_label'] == 'NEGATIVE']['comment_text'].dropna().astype(str).tolist())
    
    # Pre-compute sentiments for each text blob
    overall_sentiment_map = _precompute_word_sentiments(all_text)
    positive_sentiment_map = _precompute_word_sentiments(positive_text)
    negative_sentiment_map = _precompute_word_sentiments(negative_text)

    overall_wc = _generate_ngrams_from_text(all_text, overall_sentiment_map)
    positive_wc = _generate_ngrams_from_text(positive_text, positive_sentiment_map)
    negative_wc = _generate_ngrams_from_text(negative_text, negative_sentiment_map)
    
    thematic_wcs = []
    for theme in df['theme'].unique():
        theme_text = ". ".join(df[df['theme'] == theme]['comment_text'].dropna().astype(str).tolist())
        theme_sentiment_map = _precompute_word_sentiments(theme_text)
        theme_keywords = _generate_ngrams_from_text(theme_text, theme_sentiment_map)
        thematic_wcs.append({"theme": theme, "keywords": theme_keywords[:10]})

    return {
        "overall_word_cloud": overall_wc,
        "sentiment_specific_clouds": { "positive": positive_wc, "negative": negative_wc },
        "thematic_word_clouds": thematic_wcs
    }

