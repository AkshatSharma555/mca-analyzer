import React from 'react';
import InputSection from '../components/input/InputSection';
import ResultsDashboard from '../components/dashboard/ResultsDashboard';
import SingleCommentReport from '../components/dashboard/SingleCommentReport';
import { useAnalysis } from '../hooks/useAnalysis';
import { FiLoader } from 'react-icons/fi';

const HomePage = () => {
  const { data, isLoading, error, performAnalysis } = useAnalysis();

  const renderReport = () => {
    if (!data) return null;
    if (data.sentiment_report.overall.total_comments > 1) {
      return <ResultsDashboard data={data} />;
    }
    return <SingleCommentReport data={data} />;
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* --- YAHAN BADLAAV KIYA GAYA HAI: Text Colors --- */}
      <div className="mb-8">
        <p className="text-sm text-slate-500 dark:text-slate-400">Dashboard / Analysis Tool</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">e-Consultation Feedback Analysis</h1>
      </div>

      <div className="space-y-8">
        <InputSection 
          onAnalysis={performAnalysis}
          isLoading={isLoading}
        />

        <div>
          {isLoading && (
            // --- YAHAN BADLAAV KIYA GAYA HAI: Card Styling ---
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md rounded-lg flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400">
              <FiLoader className="animate-spin text-4xl mb-4" />
              <p className="font-semibold">Generating your report, please wait...</p>
            </div>
          )}

          {error && (
            // --- YAHAN BADLAAV KIYA GAYA HAI: Card Styling ---
            <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 dark:border-red-500/30 text-red-600 dark:text-red-300 p-4 rounded-lg">
              <h3 className="font-bold">An Error Occurred</h3>
              <p>{error}</p>
            </div>
          )}
          
          {data && !isLoading && renderReport()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;