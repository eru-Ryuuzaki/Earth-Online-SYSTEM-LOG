import React, { useEffect, useRef } from 'react';

const HeartbeatWave = ({ color = '#06b6d4', height = 60 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let x = 0;
    
    // Wave parameters
    const points = [];
    const width = canvas.width;
    const centerY = height / 2;
    let phase = 0;

    const draw = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';

      // Generate ECG-like wave
      // Base frequency + Random spikes
      phase += 0.05;
      
      // Heartbeat pattern simulation
      const beat = (Math.sin(phase) > 0.95) ? (Math.random() * 0.8 + 0.2) : 0;
      const noise = (Math.random() - 0.5) * 0.1;
      
      // Complex wave composition
      const y = centerY + 
        (Math.sin(phase * 2) * 5) + // Base rhythm
        (beat * (height * 0.4) * (Math.random() > 0.5 ? 1 : -1)) + // Spike
        noise * 10;

      points.push({ x: width - 1, y });

      // Shift points left
      for (let i = 0; i < points.length; i++) {
        points[i].x -= 2; // Speed
      }

      // Remove off-screen points
      if (points.length > 0 && points[0].x < 0) {
        points.shift();
      }

      // Draw path
      if (points.length > 1) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
           ctx.lineTo(points[i].x, points[i].y);
        }
      }
      
      ctx.stroke();

      // Draw glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      
      // Reset shadow for next frame background clear
      ctx.shadowBlur = 0;

      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [color, height]);

  return (
    <div className="relative border border-gray-800 bg-black/50 rounded overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={height} 
        className="w-full h-full block"
      />
      <div className="absolute top-1 right-2 text-[10px] font-mono text-cyan-500/50">
        LIVE MONITOR
      </div>
    </div>
  );
};

export default HeartbeatWave;
