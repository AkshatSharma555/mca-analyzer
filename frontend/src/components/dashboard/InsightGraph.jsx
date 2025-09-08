import React, { useMemo } from 'react';
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { useThemeContext } from '../../context/ThemeContext'; // Theme context ko import karein

// Yeh helper function ab theme ko bhi as an argument lega
const transformDataForGraph = (sentimentReport, theme) => {
  const nodes = [];
  const edges = [];

  if (!sentimentReport || !sentimentReport.stakeholder_analysis || !sentimentReport.aspect_summary) {
    return { initialNodes: [], initialEdges: [] };
  }
  
  // --- NAYA LOGIC: Theme ke hisab se style define karein ---
  const isDark = theme === 'dark';
  const baseNodeStyle = {
    background: isDark ? '#1e293b' : '#ffffff', // dark-card vs light-card
    color: isDark ? '#cbd5e1' : '#1e293b',       // light-text vs dark-text
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    boxShadow: isDark ? 'none' : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  };

  // 1. Central Node
  nodes.push({
    id: 'policy-center',
    data: { label: 'Draft Policy' },
    position: { x: 400, y: 200 },
    style: { 
      background: '#0d244a', color: 'white', 
      width: 120, height: 120, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '16px', fontWeight: 'bold', border: '2px solid #3b82f6'
    }
  });

  const { stakeholder_analysis, aspect_summary } = sentimentReport;

  // 2. Stakeholder Nodes
  stakeholder_analysis.forEach((stakeholder, index) => {
    nodes.push({
      id: `stakeholder-${index}`,
      data: { label: `${stakeholder.stakeholder_group} (${stakeholder.comment_count})` },
      position: { x: 100, y: index * 120 + 50 },
      style: { ...baseNodeStyle } // Naye dynamic style ka istemal
    });
  });

  // 3. Topic Nodes
  aspect_summary.forEach((aspect, index) => {
    let bgColor = isDark ? '#1e293b' : '#ffffff';
    if(aspect.polarity_label.includes("Positive")) bgColor = isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5';
    if(aspect.polarity_label.includes("Negative")) bgColor = isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2';
    
    nodes.push({
      id: `topic-${index}`,
      data: { label: aspect.aspect },
      position: { x: 700, y: index * 100 + 50 },
      style: { ...baseNodeStyle, background: bgColor } // Naye dynamic style ka istemal
    });
  });

  // 4. Edges (No change here)
  stakeholder_analysis.forEach((stakeholder, s_index) => {
    const topicIndex = aspect_summary.findIndex(a => a.aspect === stakeholder.top_concern);
    if(topicIndex !== -1){
      let strokeColor = '#64748b';
      if (stakeholder.overall_sentiment.includes("Positive")) strokeColor = '#10b981';
      if (stakeholder.overall_sentiment.includes("Negative")) strokeColor = '#ef4444';
      edges.push({
        id: `e-${s_index}-${topicIndex}`,
        source: `stakeholder-${s_index}`,
        target: `topic-${topicIndex}`,
        animated: stakeholder.overall_sentiment.includes("Negative"),
        style: { stroke: strokeColor, strokeWidth: 2 }
      });
    }
  });

  return { initialNodes: nodes, initialEdges: edges };
};


const InsightGraph = ({ report }) => {
  const { theme } = useThemeContext(); // Current theme ko nikalein

  const { initialNodes, initialEdges } = useMemo(
    // NAYA: theme ko helper function mein pass karein
    () => transformDataForGraph(report.sentiment_report, theme),
    [report.sentiment_report, theme] // theme ko dependency banayein
  );
  
  if (initialNodes.length === 0) {
    return (
      <div className="text-center text-slate-500 dark:text-slate-400 py-10">
        Not enough data to generate Insight Graph.
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full bg-light-card dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border shadow-md">
      <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
        <Controls />
        <Background variant="dots" gap={12} size={1} className="bg-light-bg dark:bg-dark-bg" />
      </ReactFlow>
    </div>
  );
};

export default InsightGraph;
