import React from 'react';
import { FiFileText, FiList, FiEdit, FiLink2, FiMessageSquare } from 'react-icons/fi';
import ThemeDistributionChart from './ThemeDistributionChart';

const SummaryReport = ({ report, sentimentReport }) => {
  if (!report || !sentimentReport) return null;

  const { 
    executive_summary, 
    thematic_insights, 
    notable_individual_summaries, 
    actionable_suggestions 
  } = report;

  // Humein abhi bhi theme_relationships ki zaroorat pad sakti hai agar backend use bhej raha hai
  const theme_relationships = report.theme_relationships || [];

  return (
    <div className="space-y-6 animate-fade-in-down">
      
      {/* 1. Visual Insights */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
          Top Discussed Topics
        </h3>
        <ThemeDistributionChart thematicData={thematic_insights} sentimentData={sentimentReport} />
      </div>

      {/* 2. Topic Relationships */}
      {theme_relationships.length > 0 && (
         <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
            <FiLink2 className="text-brand-accent dark:text-cyan-400" />
            Topic Relationships
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {theme_relationships.map((rel, index) => (
              <div key={index} className="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/30 p-2 rounded-md">
                <span className="font-bold text-brand-accent dark:text-cyan-400">{rel.themes[0]}</span> is frequently discussed with <span className="font-bold text-brand-accent dark:text-cyan-400">{rel.themes[1]}</span> 
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">({rel.count} times)</span>.
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Executive Summary */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
          <FiFileText className="text-brand-accent dark:text-cyan-400" />
          Executive Summary
        </h3>
        <p className="text-slate-600 dark:text-slate-300 italic">"{executive_summary}"</p>
      </div>
      
      {/* 4. Actionable Suggestions */}
      {actionable_suggestions && actionable_suggestions.length > 0 && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <FiMessageSquare className="text-brand-accent dark:text-cyan-400" />
            Key Actionable Suggestions Identified
          </h3>
          <div className="space-y-4">
            {actionable_suggestions.map((item, index) => (
              <div key={index} className="border-t border-light-border dark:border-dark-border pt-3 first:pt-0 first:border-t-0">
                <blockquote className="border-l-4 border-emerald-500/50 pl-4 text-slate-600 dark:text-slate-300 italic">
                  "{item.comment}"
                </blockquote>
                 <p className="text-right text-xs text-slate-500 dark:text-slate-400 mt-1">- {item.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Thematic Insights (Detailed List) */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
          <FiList className="text-brand-accent dark:text-cyan-400" />
          Detailed Thematic Summaries
        </h3>
        <div className="space-y-4">
          {thematic_insights.map((theme, index) => (
            <div key={index} className="border-b border-light-border dark:border-dark-border pb-3 last:border-b-0 last:pb-0">
              <h4 className="font-bold text-slate-700 dark:text-slate-200">{theme.theme} 
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">({theme.comment_count} comments)</span>
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{theme.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Notable Individual Summaries */}
      {notable_individual_summaries && notable_individual_summaries.length > 0 && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-3"><FiEdit className="text-brand-accent dark:text-cyan-400" />Notable Individual Summaries</h3>
          <div className="space-y-4">
            {notable_individual_summaries.map((item, index) => (
              <div key={index} className="border-b border-light-border dark:border-dark-border pb-3 last:border-b-0 last:pb-0">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1"><span className="font-semibold text-slate-700 dark:text-slate-300">Original (Preview):</span> {item.original_comment_preview}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-300"><span className="font-semibold text-slate-700 dark:text-slate-300">AI Summary:</span> "{item.summary}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryReport;