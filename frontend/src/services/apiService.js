import axios from 'axios';

// Backend ka base URL. Aage chalkar hum isey .env file mein daal sakte hain.
const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

/**
 * Single text input ko analyze karne ke liye backend ko call karta hai.
 * @param {string} text - User dwara enter kiya gaya text.
 * @returns {Promise<object>} - Analysis report.
 */
export const analyzeText = async (text) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, { text });
    return response.data;
  } catch (error) {
    console.error("Error analyzing text:", error);
    throw error;
  }
};

/**
 * File (CSV/XLSX) ko analyze karne ke liye backend ko call karta hai.
 * @param {File} file - User dwara upload ki gayi file.
 * @returns {Promise<object>} - Analysis report.
 */
export const analyzeFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // --- Galti yahan thi, ab theek kar di gayi hai ---
    const response = await axios.post(`${API_BASE_URL}/analyze-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error analyzing file:", error);
    throw error;
  }
};