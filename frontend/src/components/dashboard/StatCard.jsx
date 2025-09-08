import React from 'react';

const StatCard = ({ icon, title, value, colorClass = 'text-brand-accent dark:text-cyan-400' }) => {
  const IconComponent = icon;
  return (
    // YAHAN BADLAAV KIYA GAYA HAI: Card styling
    <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg border border-light-border dark:border-dark-border flex items-center gap-4">
      <div className={`text-3xl ${colorClass}`}>
        <IconComponent />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
