import { useState, useCallback } from 'react';
import { analyzeText, analyzeFile } from '../services/apiService';

// Yeh custom hook API calls se judi saari state ko manage karega
export const useAnalysis = () => {
  const [data, setData] = useState(null); // Analysis ka result store karne ke liye
  const [isLoading, setIsLoading] = useState(false); // Loading state ke liye
  const [error, setError] = useState(null); // Error store karne ke liye

  // Yeh function analysis process ko shuru karega
  const performAnalysis = useCallback(async ({ file, text }) => {
    setIsLoading(true);
    setError(null);
    setData(null); // Purana data saaf karein

    try {
      let response;
      if (file) {
        // Agar file hai, toh file waale function ko call karein
        response = await analyzeFile(file);
      } else if (text) {
        // Agar text hai, toh text waale function ko call karein
        response = await analyzeText(text);
      } else {
        // Agar kuch bhi nahi hai, toh error set karein
        throw new Error("No input provided for analysis.");
      }
      
      // Response aane par data ko set karein
      setData(response.report);

    } catch (err) {
      // Agar API se error aaye, toh use set karein
      const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
      setError(errorMessage);
      console.error("Analysis failed:", err);
    } finally {
      // Chahe success ho ya error, loading ko false karein
      setIsLoading(false);
    }
  }, []); // useCallback isey re-create hone se rokta hai

  return { data, isLoading, error, performAnalysis };
};