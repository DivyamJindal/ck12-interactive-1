'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@headlessui/react';
import dynamic from 'next/dynamic';

const ThreeVisualization = dynamic(() => import('../components/ThreeVisualization'), { ssr: false });

const materials = [
  { name: 'Copper', resistivity: 1.68e-8, color: '#b87333' },
  { name: 'Iron', resistivity: 9.71e-8, color: '#8c8c8c' },
  { name: 'Silver', resistivity: 1.59e-8, color: '#c0c0c0' },
  { name: 'Aluminum', resistivity: 2.65e-8, color: '#848789' }
];

export default function Home() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [material, setMaterial] = useState(materials[0]);
  const [radius, setRadius] = useState(1);
  const [length, setLength] = useState(1);

  // Calculate resistance
  const area = Math.PI * Math.pow(radius / 1000, 2); // Convert mm to m
  const resistance = (material.resistivity * length) / area;
  const current = isEnabled ? 12 / resistance : 0; // Using 12V battery
  const power = current * current * resistance;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Resistance & Resistivity Virtual Lab
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          {/* Controls and Calculations Panel */}
          <div className="space-y-6">
            {/* Formula Explanation */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Understanding Resistance</h2>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold mb-2">R = ρL/A</div>
                  <div className="space-y-2 text-blue-100">
                    <p>Where:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>R = Resistance (Ω, ohms)</li>
                      <li>ρ = Resistivity of material (Ω⋅m)</li>
                      <li>L = Length of wire (m)</li>
                      <li>A = Cross-sectional area (m²)</li>
                    </ul>
                  </div>
                </div>
                <div className="text-sm space-y-2">
                  <p>• Longer wires have more resistance</p>
                  <p>• Thicker wires (larger radius) have less resistance</p>
                  <p>• Different materials have different resistivities</p>
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-blue-100">
              <div className="space-y-6">
                {/* Power Switch */}
                <div className="flex items-center justify-between">
                  <label className="text-lg font-medium text-gray-700">Power</label>
                  <Switch
                    checked={isEnabled}
                    onChange={setIsEnabled}
                    className={`${
                      isEnabled ? 'bg-blue-600' : 'bg-gray-400'
                    } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        isEnabled ? 'translate-x-9' : 'translate-x-1'
                      } inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform`}
                    />
                  </Switch>
                </div>

                {/* Material Selection */}
                <div className="space-y-2">
                  <label className="text-lg font-medium text-gray-700">Material</label>
                  <select
                    value={material.name}
                    onChange={(e) => setMaterial(materials.find(m => m.name === e.target.value) || materials[0])}
                    className="w-full bg-white rounded-lg p-3 text-gray-700 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {materials.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name} (ρ = {m.resistivity.toExponential(2)} Ω⋅m)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Radius Control */}
                <div className="space-y-2">
                  <label className="text-lg font-medium text-gray-700">
                    Wire Radius: {radius.toFixed(1)} mm
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={radius}
                    onChange={(e) => setRadius(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                {/* Length Control */}
                <div className="space-y-2">
                  <label className="text-lg font-medium text-gray-700">
                    Wire Length: {length.toFixed(1)} m
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Calculations Display */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Circuit Analysis</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-blue-400">
                  <span className="text-blue-100">Wire Length (L):</span>
                  <span className="font-mono text-lg">{length.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-400">
                  <span className="text-blue-100">Wire Radius:</span>
                  <span className="font-mono text-lg">{radius.toFixed(2)} mm</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-400">
                  <span className="text-blue-100">Cross-sectional Area (A):</span>
                  <span className="font-mono text-lg">{area.toExponential(2)} m²</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-400">
                  <span className="text-blue-100">Resistivity (ρ):</span>
                  <span className="font-mono text-lg">{material.resistivity.toExponential(2)} Ω⋅m</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-400">
                  <span className="text-blue-100">Resistance (R):</span>
                  <span className="font-mono text-lg">{resistance.toFixed(3)} Ω</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-400">
                  <span className="text-blue-100">Current (I):</span>
                  <span className="font-mono text-lg">{current.toFixed(3)} A</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-blue-100">Power (P):</span>
                  <span className="font-mono text-lg">{power.toFixed(3)} W</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <motion.div
            layout
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg aspect-[4/3] relative overflow-hidden"
          >
            <ThreeVisualization
              isEnabled={isEnabled}
              material={material}
              radius={radius}
              length={length}
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
