import React, { useState } from 'react';
import StatCard from './StatCard';
import EmotionChart from './EmotionChart';
import StakeholderReport from './StakeholderReport';
import { 
  FiSmile, FiFrown, FiUsers, FiClipboard, 
  FiThumbsUp, FiThumbsDown, FiAlertCircle, FiChevronDown, FiInfo
} from 'react-icons/fi';

// Helper function to get style based on polarity label
const getPolarityStyle = (label) => {
  // Light mode colors
  let color = "bg-slate-200 text-slate-600";
  if (label.includes("Positive")) color = "bg-emerald-100 text-emerald-700";
  if (label.includes("Negative")) color = "bg-red-100 text-red-700";
  
  // Dark mode colors
  if (label.includes("Strongly Positive")) color += " dark:bg-green-500/20 dark:text-green-300";
  if (label.includes("Positive")) color += " dark:bg-emerald-500/20 dark:text-emerald-300";
  if (label.includes("Strongly Negative")) color += " dark:bg-red-600/30 dark:text-red-300";
  if (label.includes("Negative")) color += " dark:bg-red-500/20 dark:text-red-300";
  if (label.includes("Mixed")) color += " dark:bg-slate-600/50 dark:text-slate-300";
  
  let Icon = FiAlertCircle;
  if (label.includes("Positive")) Icon = FiThumbsUp;
  if (label.includes("Negative")) Icon = FiThumbsDown;

  return { color, Icon };
};

const SentimentReport = ({ report }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!report) return null;
  
  const { overall, aspect_summary, executive_finding, contradictory_comments } = report;

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {/* Executive Finding Card */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-4 flex gap-4">
        <FiClipboard className="text-3xl text-brand-accent dark:text-cyan-400 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white">Executive Finding</h3>
          <p className="text-slate-600 dark:text-slate-300 mt-1">{executive_finding}</p>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={FiUsers} title="Total Comments" value={overall.total_comments} />
        <StatCard icon={FiSmile} title="Positive Feedback" value={`${overall.positive_percentage}%`} colorClass="text-emerald-500 dark:text-emerald-400" />
        <StatCard icon={FiFrown} title="Negative Feedback" value={`${overall.negative_percentage}%`} colorClass="text-red-500 dark:text-red-400" />
      </div>

      {/* Stakeholder Analysis */}
      <StakeholderReport report={report} />

      {/* Contradictory Comments Section */}
      {contradictory_comments && contradictory_comments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white flex items-center gap-2">
            <FiInfo className="text-amber-500 dark:text-amber-400"/>
            High-Value Mixed Feedback
          </h3>
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-4 space-y-3">
            {contradictory_comments.map((comment, index) => (
              <blockquote key={index} className="border-l-4 border-amber-500/50 pl-3 text-sm text-slate-600 dark:text-slate-400 italic">
                "{comment}"
              </blockquote>
            ))}
          </div>
        </div>
      )}

      {/* Aspect-Based Sentiment Details */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">Sentiment by Topic (Aspects)</h3>
        <div className="space-y-2">
          {aspect_summary.map((aspect, index) => {
            const { color, Icon } = getPolarityStyle(aspect.polarity_label);
            const isActive = activeIndex === index;

            return (
              <div key={index} className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg transition-all duration-300">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  onClick={() => handleToggle(index)}
                >
                  <h4 className="font-bold text-brand-accent dark:text-cyan-400">{aspect.aspect}</h4>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${color}`}>
                      <Icon />
                      {aspect.polarity_label}
                    </span>
                    <FiChevronDown className={`text-slate-500 dark:text-slate-400 transform transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                
                {isActive && (
                  <div className="p-4 border-t border-light-border dark:border-dark-border space-y-4 animate-fade-in-down">
                     <div>
                        <p className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Key Phrases:</p>
                        <div className="flex flex-wrap gap-2">
                          {aspect.key_positive_phrases.map(p => <span key={p} className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-1 rounded-full">{p}</span>)}
                          {aspect.key_negative_phrases.map(p => <span key={p} className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 text-xs px-2 py-1 rounded-full">{p}</span>)}
                        </div>
                     </div>
                     <div className="space-y-3">
                        {aspect.most_impactful_positive_comment && (<div><p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Most Impactful Positive Comment:</p><blockquote className="border-l-4 border-emerald-500/50 pl-3 text-sm text-slate-600 dark:text-slate-400 italic">"{aspect.most_impactful_positive_comment}"</blockquote></div>)}
                        {aspect.most_impactful_negative_comment && (<div><p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Most Impactful Negative Comment:</p><blockquote className="border-l-4 border-red-500/50 pl-3 text-sm text-slate-600 dark:text-slate-400 italic">"{aspect.most_impactful_negative_comment}"</blockquote></div>)}
                     </div>
                     <div className="border-t border-light-border dark:border-dark-border pt-4">
                        <EmotionChart breakdown={aspect.emotion_breakdown} />
                     </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SentimentReport;