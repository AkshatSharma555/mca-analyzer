import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { FiPlayCircle, FiLoader } from 'react-icons/fi';

const InputSection = ({ onAnalysis, isLoading }) => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');

  const handleAnalysis = () => {
    if (!file && !text.trim()) {
      alert("Please upload a file or enter text to analyze.");
      return;
    }
    onAnalysis({ file, text });
  };

  const isButtonDisabled = isLoading || (!file && !text.trim());

  return (
    // YAHAN BADLAAV KIYA GAYA HAI: Card styling
    <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-brand-accent dark:text-cyan-400">Step 1: Provide Data</h2>
      <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
        Upload a file with comments or paste the text directly.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-x-6 gap-y-8 items-center">
        
        <div className="w-full">
          {/* FileUpload ko aage update karenge, abhi yeh theek hai */}
          <FileUpload file={file} setFile={setFile} />
        </div>

        <div className="flex items-center justify-center">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">OR</span>
        </div>

        <div className="w-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your comments here..."
            className="w-full h-full min-h-[210px] bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg p-4 focus:ring-2 focus:ring-brand-accent dark:focus:ring-cyan-500 focus:border-brand-accent dark:focus:border-cyan-500 transition-colors duration-300 placeholder-slate-400 dark:placeholder-slate-500"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleAnalysis}
          disabled={isButtonDisabled}
          className={`px-6 py-3 font-semibold text-white rounded-lg flex items-center gap-2 transition-all duration-300
            ${isButtonDisabled 
              ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed' 
              : 'bg-brand-accent hover:opacity-90 transform hover:scale-105'}
          `}
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <FiPlayCircle />
              Start Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;