import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useThemeContext } from '../../context/ThemeContext'; // Theme context ko import karein

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border p-2 rounded-md shadow-lg">
        <p className="font-bold text-slate-800 dark:text-slate-200">{label}</p>
        <p className="text-sm text-brand-accent dark:text-cyan-400">Comment Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const ThemeDistributionChart = ({ thematicData, sentimentData }) => {
  const { theme } = useThemeContext(); // Current theme (light/dark) ko nikalein
  
  const chartData = thematicData.map(themeItem => {
    const aspect = sentimentData.aspect_summary.find(s => s.aspect === themeItem.theme);
    const score = aspect ? aspect.avg_polarity_score : 0;
    return {
      name: themeItem.theme,
      count: themeItem.comment_count,
      sentimentScore: score,
    };
  });

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={150}
            // Y-axis ka text color theme ke hisab se badlega
            tick={{ fill: theme === 'dark' ? '#94a3b8' : '#475569', fontSize: 14 }} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
            // Custom tooltip component ka istemal karein
            content={<CustomTooltip />}
          />
          <Bar dataKey="count" barSize={25}>
            {chartData.map((entry, index) => (
              // Bar ka color sentiment ke hisab se
              <Cell key={`cell-${index}`} fill={entry.sentimentScore > 0.15 ? '#10b981' : entry.sentimentScore < -0.15 ? '#ef4444' : '#64748b'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThemeDistributionChart;