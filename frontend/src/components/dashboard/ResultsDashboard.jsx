import React, { useState, useRef } from 'react'; // useRef ko import karein
import { FiDownload } from 'react-icons/fi'; // Download icon
import { generatePdfFromElement } from '../../services/pdfService'; // Hamare naye service ko import karein

import SentimentReport from './SentimentReport';
import SummaryReport from './SummaryReport';
import WordCloudReport from './WordCloudReport';
import InsightGraph from './InsightGraph';

const ResultsDashboard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('sentiment');
  
  // NAYA: reportContentRef ek reference banayega uss div ka jiska humein PDF banana hai
  const reportContentRef = useRef(null);

  if (!data) return null;

  const tabs = [
    { id: 'sentiment', label: 'Sentiment Report' },
    { id: 'summary', label: 'Summary Report' },
    { id: 'wordcloud', label: 'Word Cloud' },
    { id: 'graph', label: 'Insight Graph' },
  ];

  // NAYA: PDF download ko handle karne wala function
  const handleDownloadPdf = () => {
    // reportContentRef.current woh actual HTML element hai
    // Hum file ka naam active tab ke hisab se rakhenge
    const fileName = `MCA_Analysis_Report_${activeTab}`;
    generatePdfFromElement(reportContentRef.current, fileName);
  };

  return (
    <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md rounded-lg p-6 animate-fade-in-down">
      
      {/* --- YAHAN BADLAAV KIYA GAYA HAI: Header ab flexbox hai --- */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
        <h2 className="text-xl font-semibold text-brand-accent dark:text-cyan-400">
          Analysis Report
        </h2>
        {/* --- NAYA BUTTON --- */}
        <button
          onClick={handleDownloadPdf}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-brand-accent text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
        >
          <FiDownload />
          Download Report
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-light-border dark:border-dark-border mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-brand-accent dark:border-cyan-400 text-brand-accent dark:text-cyan-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-500'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {/* --- YAHAN BADLAAV KIYA GAYA HAI: ref ko is div se joda gaya hai --- */}
      <div ref={reportContentRef}>
        {activeTab === 'sentiment' && <SentimentReport report={data.sentiment_report} />}
        {activeTab === 'summary' && <SummaryReport report={data.summary_report} sentimentReport={data.sentiment_report} />}
        {activeTab === 'wordcloud' && <WordCloudReport report={data.word_cloud_report} />}
        {activeTab === 'graph' && <InsightGraph report={data} />}
      </div>
    </div>
  );
};

export default ResultsDashboard;