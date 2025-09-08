import React from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext'; // Theme context ko import karein

// NAYA: Helper function ab theme ko bhi dhyan mein rakhega
const getColor = (sentiment, theme) => {
  if (theme === 'dark') {
    if (sentiment > 0.3) return '#34d399'; // Green
    if (sentiment < -0.3) return '#f87171'; // Red
    return '#94a3b8'; // Grey
  }
  // Light mode ke liye alag colors
  if (sentiment > 0.3) return '#059669'; // Darker Green
  if (sentiment < -0.3) return '#dc2626'; // Darker Red
  return '#475569'; // Darker Grey
};

const AnimatedWord = ({ word }) => {
  const { theme } = useThemeContext(); // Current theme ko nikalein
  
  return (
    <motion.text
      textAnchor="middle"
      transform={`translate(${word.x}, ${word.y})`}
      style={{
        fontSize: word.size,
        fill: getColor(word.sentiment, theme), // Naye helper ka istemal
        fontFamily: 'Arial, sans-serif',
        fontWeight: '600',
      }}
    >
      <title>Frequency: {word.value}</title>
      {word.text}
    </motion.text>
  );
};

export default AnimatedWord;