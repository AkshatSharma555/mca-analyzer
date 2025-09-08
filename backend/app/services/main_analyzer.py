import pandas as pd
from . import sentiment_module, summarization_module, wordcloud_module

def analyze_dataframe(df: pd.DataFrame) -> dict:
    """
    Orchestrates the analysis process with the simple, stable modules.
    """
    # --- Step 1: Enrich the DataFrame ---
    
    # Har comment ko uske 'theme' (singular) se tag karein
    df['theme'] = df['comment_text'].dropna().astype(str).apply(summarization_module._classify_comment)
    
    if not sentiment_module.IS_DEV_MODE:
        sentiments = sentiment_module.sentiment_pipeline(df['comment_text'].dropna().astype(str).tolist())
        df['sentiment_label'] = [s['label'] for s in sentiments]
    else:
        df['sentiment_label'] = 'POSITIVE'

    # --- Step 2: Call Specialist Modules ---
    sentiment_report = sentiment_module.analyze_sentiment(df)
    summary_report = summarization_module.generate_comprehensive_summary_report(df)
    word_cloud_report = wordcloud_module.generate_advanced_word_cloud_report(df) 
    
    # --- Step 3: Assemble the Final Report ---
    final_report = {
        "sentiment_report": sentiment_report,
        "summary_report": summary_report,
        "word_cloud_report": word_cloud_report,
    }

    return final_report