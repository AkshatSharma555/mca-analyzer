import React from 'react';
import { FiThumbsUp, FiThumbsDown, FiAlertCircle, FiTag } from 'react-icons/fi';

// Helper function to get style based on polarity label
const getPolarityStyle = (label) => {
  switch (label) {
    case "Strongly Positive": return { color: "text-green-300", Icon: FiThumbsUp };
    case "Positive": return { color: "text-emerald-300", Icon: FiThumbsUp };
    case "Strongly Negative": return { color: "text-red-300", Icon: FiThumbsDown };
    case "Negative": return { color: "text-red-300", Icon: FiThumbsDown };
    default: return { color: "text-slate-300", Icon: FiAlertCircle };
  }
};

const SingleCommentReport = ({ data }) => {
  // Single comment ke liye, report mein ek hi theme aur ek hi aspect hoga
  const summary_insight = data.summary_report.thematic_insights[0]; 
  const sentiment_insight = data.sentiment_report.aspect_summary[0] || {};
  
  const polarityLabel = sentiment_insight.polarity_label || 'N/A';
  const { color, Icon } = getPolarityStyle(polarityLabel);

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 animate-fade-in-down">
      <h2 className="text-xl font-semibold text-cyan-400 mb-4">Single Comment Analysis</h2>
      
      <div className="space-y-4">
        {/* Sentiment */}
        <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Sentiment:</h3>
            <span className={`px-3 py-1 text-base font-bold rounded-full flex items-center gap-1.5 bg-slate-700 ${color}`}>
                <Icon />
                {polarityLabel}
            </span>
        </div>

        {/* AI Summary */}
        <div>
            <h3 className="text-lg font-semibold text-white">AI-Generated Summary:</h3>
            <p className="text-slate-300 italic mt-1">"{summary_insight.summary}"</p>
        </div>

        {/* Key Phrases */}
        <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2"><FiTag/> Key Phrases:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
                {(sentiment_insight.key_positive_phrases || []).map(p => <span key={p} className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full">{p}</span>)}
                {(sentiment_insight.key_negative_phrases || []).map(p => <span key={p} className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full">{p}</span>)}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCommentReport;