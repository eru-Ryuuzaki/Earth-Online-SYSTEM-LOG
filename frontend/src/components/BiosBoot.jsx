import React, { useState, useEffect } from 'react';

const BiosBoot = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const bootLines = [
      "Earth Online BIOS v2.0.24-beta",
      "Copyright (C) 2026 System Corp.",
      "",
      "CPU: Neural Processor Unit @ 120Hz",
      "Memory Test: 32GB OK",
      "Detecting Primary Master ... CONNECTED",
      "Detecting Primary Slave  ... CONNECTED",
      "",
      "Loading Kernel Modules...",
      " > emotions.sys ... LOADED",
      " > logic.dll ... LOADED",
      " > memory_core.lib ... OK",
      "",
      "System Integrity Check ... 100%",
      "Establishing Uplink to Zeabur Cloud ... CONNECTED",
      "Initializing AI Hub Interface ... READY",
      "",
      "Booting OS...",
    ];

    let currentLine = 0;
    
    const interval = setInterval(() => {
      if (currentLine < bootLines.length) {
        setLines(prev => [...prev, bootLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(onComplete, 500); // Wait for fade out
        }, 800);
      }
    }, 150); // Speed of typing

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!onComplete && isFinished) return null; // Safety check

  return (
    <div className={`fixed inset-0 z-50 bg-black font-mono text-white p-8 overflow-hidden transition-opacity duration-500 ${isFinished ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="max-w-4xl mx-auto space-y-1">
        {lines.map((line, index) => (
          <div key={index} className="text-sm md:text-base text-gray-300">
            {line}
          </div>
        ))}
        {!isFinished && (
          <div className="animate-pulse">_</div>
        )}
      </div>
      
      {/* Footer info */}
      <div className="absolute bottom-4 left-8 text-xs text-gray-500">
        Press DEL to enter Setup
        <br />
        15/01/2026
      </div>
    </div>
  );
};

export default BiosBoot;
