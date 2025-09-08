import React, { useState } from 'react';
import D3WordCloud from './D3WordCloud.jsx';
import { FiTag } from 'react-icons/fi';

const WordCloudReport = ({ report }) => {
  const [activeCloud, setActiveCloud] = useState('overall'); // 'overall', 'positive', 'negative'

  if (!report) return null;

  const { overall_word_cloud, sentiment_specific_clouds, thematic_word_clouds } = report;

  const clouds = {
    overall: overall_word_cloud,
    positive: sentiment_specific_clouds.positive,
    negative: sentiment_specific_clouds.negative,
  };

  const currentCloudData = clouds[activeCloud] || [];

  return (
    <div className="space-y-6 animate-fade-in-down">
      
      {/* 1. Main Interactive Word Cloud */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md rounded-lg p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Keyword & Phrase Cloud</h3>
            
            {/* Cloud Switcher Buttons */}
            <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveCloud('overall')} 
                  className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 
                    ${activeCloud === 'overall' 
                      ? 'bg-brand-accent dark:bg-cyan-500 text-white' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`
                  }>
                    Overall
                </button>
                <button 
                  onClick={() => setActiveCloud('positive')} 
                  className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 
                    ${activeCloud === 'positive' 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`
                  }>
                    Positive
                </button>
                <button 
                  onClick={() => setActiveCloud('negative')} 
                  className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 
                    ${activeCloud === 'negative' 
                      ? 'bg-red-500 text-white' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`
                  }>
                    Negative
                </button>
            </div>
        </div>
        <div className="h-80 w-full">
            <D3WordCloud data={currentCloudData} />
        </div>
      </div>

      {/* 2. Thematic Keywords */}
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-3">
          <FiTag className="text-brand-accent dark:text-cyan-400" />
          Top Keywords by Theme
        </h3>
        <div className="space-y-3">
          {thematic_word_clouds.map((theme, index) => (
            <div key={index}>
              <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{theme.theme}</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {theme.keywords.map(kw => (
                  <span key={kw.text} className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">
                    {kw.text}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordCloudReport;