import React, { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react';
import cloud from 'd3-cloud';
import * as d3 from 'd3';
import AnimatedWord from './AnimatedWord.jsx'; // Hum ab naye theme-aware component ka istemal kar rahe hain

const D3WordCloud = ({ data }) => {
  const [layoutWords, setLayoutWords] = useState([]);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  const wordsForLayout = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const maxVal = d3.max(data, d => d.value) || 10;
    const fontSizeScale = d3.scaleSqrt().domain([1, maxVal]).range([14, 70]);

    return data.map(d => ({ 
      text: d.text, 
      size: fontSizeScale(d.value), 
      value: d.value,
      sentiment: d.sentiment
    }));
  }, [data]);

  useEffect(() => {
    if (wordsForLayout.length > 0 && dimensions.width > 0) {
      const { width, height } = dimensions;
      
      const layout = cloud()
        .size([width, height])
        .words(wordsForLayout)
        .padding(5)
        .rotate(() => 0)
        .font("Arial, sans-serif")
        .fontSize(d => d.size)
        .on("end", words => {
          setLayoutWords(words);
        });
      
      layout.start();
    } else {
        setLayoutWords([]);
    }
  }, [wordsForLayout, dimensions]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg width="100%" height="100%">
        <g
          transform={`translate(${dimensions.width / 2}, ${dimensions.height / 2})`}
        >
          {layoutWords.map((word, i) => (
            <AnimatedWord key={`${word.text}-${i}`} word={word} />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default D3WordCloud;