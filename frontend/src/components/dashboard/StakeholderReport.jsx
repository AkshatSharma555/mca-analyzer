import React from 'react';
import { FiUsers, FiBarChart2, FiThumbsUp, FiThumbsDown, FiHash, FiHelpCircle } from 'react-icons/fi';

// Helper function to get color and icon for sentiment text
const getSentimentStyle = (sentimentText) => {
  // Light mode colors
  let color = "text-slate-500";
  if (sentimentText.includes("Positive")) color = "text-emerald-600";
  if (sentimentText.includes("Negative")) color = "text-red-600";
  
  // Dark mode colors
  if (sentimentText.includes("Positive")) color += " dark:text-emerald-400";
  if (sentimentText.includes("Negative")) color += " dark:text-red-400";
  if (sentimentText.includes("Mixed")) color += " dark:text-slate-400";

  let Icon = FiHelpCircle;
  if (sentimentText.includes("Positive")) Icon = FiThumbsUp;
  if (sentimentText.includes("Negative")) Icon = FiThumbsDown;

  return { color, Icon };
};

const StakeholderReport = ({ report }) => {
  const stakeholders = report?.stakeholder_analysis;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white flex items-center gap-2">
        <FiUsers className="text-brand-accent dark:text-cyan-400" />
        Analysis by Stakeholder Group
      </h3>
      
      {(!stakeholders || stakeholders.length === 0) ? (
        <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg border border-light-border dark:border-dark-border">
          <p className="text-slate-500 dark:text-slate-400 text-center py-4">Stakeholder analysis not available. Ensure the uploaded file has an 'author' column with identifiable roles (e.g., 'Founder', 'Lawyer').</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stakeholders.map((group, index) => {
             const { color, Icon } = getSentimentStyle(group.overall_sentiment);
             return (
              <div key={index} className="bg-light-card dark:bg-dark-card p-4 rounded-lg border border-light-border dark:border-dark-border space-y-3 transition-all hover:border-brand-accent dark:hover:border-cyan-500/50 hover:shadow-lg">
                <h4 className="font-bold text-brand-accent dark:text-cyan-400">{group.stakeholder_group}</h4>
                <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <FiBarChart2 className="text-slate-400"/> 
                  <span>{group.comment_count} Comments</span>
                </div>
                <div className={`text-sm flex items-center gap-2 ${color}`}>
                  <Icon />
                  <span className="font-semibold">{group.overall_sentiment}</span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <FiHash className="text-slate-400"/> 
                  <span>Top Concern: <span className="font-semibold text-slate-800 dark:text-slate-100">{group.top_concern}</span></span>
                </div>
              </div>
             );
          })}
        </div>
      )}
    </div>
  );
};

export default StakeholderReport;