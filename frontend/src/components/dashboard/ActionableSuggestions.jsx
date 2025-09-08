import React from 'react';
import { FiMessageSquare, FiUser } from 'react-icons/fi';

const ActionableSuggestions = ({ report }) => {
  // Hum summary_report ke andar se actionable_suggestions nikalenge
  const suggestions = report?.actionable_suggestions;

  return (
    <div className="space-y-6 animate-fade-in-down">
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <FiMessageSquare className="text-cyan-400" />
          Key Actionable Suggestions Identified
        </h3>
        
        {(!suggestions || suggestions.length === 0) ? (
          <p className="text-slate-400 text-center py-8">No specific actionable suggestions were found in the comments.</p>
        ) : (
          <div className="space-y-4">
            {suggestions.map((item, index) => (
              <div key={index} className="border-b border-slate-700 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <FiUser />
                  <span className="font-semibold">{item.author}</span>
                </div>
                <blockquote className="border-l-4 border-emerald-500/50 pl-4 text-slate-300 italic">
                  "{item.comment}"
                </blockquote>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionableSuggestions;