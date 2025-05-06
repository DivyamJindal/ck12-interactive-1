'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CircuitVisualizationProps {
  isEnabled: boolean;
  material: {
    name: string;
    resistivity: number;
    color: string;
  };
  radius: number;
  length: number;
  resistance: number;
}

const CircuitVisualization: React.FC<CircuitVisualizationProps> = ({
  isEnabled,
  material,
  radius,
  length,
  resistance
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;                        

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw circuit
    const batteryX = 80;
    const batteryY = rect.height / 2;
    const wireStartX = batteryX + 30;
    const wireEndX = rect.width - 100;
    const wireY = rect.height / 2;

    // Draw battery
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.roundRect(batteryX - 30, batteryY - 30, 20, 60, 5);
    ctx.fill();
    ctx.stroke();

    // Battery terminals
    ctx.beginPath();
    ctx.moveTo(batteryX - 20, batteryY - 20);
    ctx.lineTo(batteryX - 20, batteryY + 20);
    ctx.moveTo(batteryX - 10, batteryY - 10);
    ctx.lineTo(batteryX - 10, batteryY + 10);
    ctx.stroke();

    // Draw wire
    ctx.strokeStyle = material.color;
    ctx.lineWidth = Math.max(2, radius * 2);
    ctx.beginPath();
    ctx.moveTo(wireStartX, wireY);

    // Create wavy wire to show length
    const segments = 3;
    const amplitude = Math.min(50, length * 10);
    for (let x = wireStartX; x <= wireEndX; x += 5) {
      const progress = (x - wireStartX) / (wireEndX - wireStartX);
      const y = wireY + Math.sin(progress * Math.PI * segments) * amplitude;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw bulb
    const bulbX = rect.width - 80;
    const bulbY = rect.height / 2;
    const bulbRadius = 20;

    // Bulb glass
    ctx.beginPath();
    ctx.fillStyle = isEnabled 
      ? `rgba(255, 255, ${Math.max(100, 255 - resistance * 20)}, ${isEnabled ? 0.8 : 0.3})`
      : '#444';
    ctx.arc(bulbX, bulbY, bulbRadius, 0, Math.PI * 2);
    ctx.fill();

    // Bulb base
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.roundRect(bulbX - 10, bulbY + bulbRadius, 20, 15, 2);
    ctx.fill();

    // Filament
    ctx.strokeStyle = isEnabled ? '#fff' : '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bulbX - 5, bulbY);
    for (let x = -5; x <= 5; x++) {
      ctx.lineTo(bulbX + x, bulbY + Math.sin(x) * 5);
    }
    ctx.stroke();

    // Glow effect when powered
    if (isEnabled) {
      const gradient = ctx.createRadialGradient(
        bulbX, bulbY, bulbRadius,
        bulbX, bulbY, bulbRadius * 2
      );
      gradient.addColorStop(0, `rgba(255, 255, ${Math.max(100, 255 - resistance * 20)}, 0.3)`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, bulbRadius * 2, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [isEnabled, material, radius, length, resistance]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
};

export default CircuitVisualization;
