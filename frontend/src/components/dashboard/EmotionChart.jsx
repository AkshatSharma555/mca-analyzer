import React from 'react';
import { FiSmile, FiFrown, FiHeart, FiZap, FiHelpCircle } from 'react-icons/fi'; // Fear ke liye alag icon use karenge

// Emotion ko color aur icon se map karein
const emotionStyles = {
  joy: { color: 'bg-emerald-500', Icon: FiSmile },
  love: { color: 'bg-pink-500', Icon: FiHeart },
  anger: { color: 'bg-red-500', Icon: FiFrown },
  sadness: { color: 'bg-blue-500', Icon: FiFrown },
  fear: { color: 'bg-purple-500', Icon: FiHelpCircle },
  surprise: { color: 'bg-yellow-500', Icon: FiZap },
  default: { color: 'bg-slate-500', Icon: FiHelpCircle },
};

const EmotionChart = ({ breakdown }) => {
  if (!breakdown || breakdown.length === 0) {
    return <p className="text-xs text-slate-400">No specific emotions detected.</p>;
  }

  // Sabse zyada count waala emotion dhoondhein taaki hum percentage nikaal sakein
  const totalEmotions = breakdown.reduce((sum, emo) => sum + emo.count, 0);

  return (
    <div>
      <h5 className="text-sm font-semibold mb-2 text-slate-300">Emotion Analysis</h5>
      <div className="space-y-2">
        {breakdown.map(({ emotion, count }) => {
          const style = emotionStyles[emotion] || emotionStyles.default;
          const percentage = totalEmotions > 0 ? (count / totalEmotions) * 100 : 0;

          return (
            <div key={emotion} className="flex items-center gap-3">
              <div className="w-24 flex items-center gap-2 text-sm text-slate-300">
                <style.Icon className={`text-base ${style.color.replace('bg-', 'text-')}`} />
                <span className="capitalize">{emotion}</span>
              </div>
              <div className="flex-1 bg-slate-700 rounded-full h-4">
                <div 
                  className={`${style.color} h-4 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="w-10 text-right text-sm font-bold text-white">
                {Math.round(percentage)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionChart;