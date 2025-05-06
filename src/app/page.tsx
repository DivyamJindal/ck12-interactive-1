'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Switch } from '@headlessui/react';

// Use dynamic import with no SSR for Three.js component
const ThreeVisualization = dynamic(
  () => import('../components/ThreeVisualization'),
  { ssr: false }
);

const materials = [
  { name: 'Copper', resistivity: 1.68e-8, color: '#b87333' },
  { name: 'Iron', resistivity: 9.71e-8, color: '#a19d94' },
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

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Resistance and Resistivity Lab</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Controls</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Material</label>
                <select
                  className="w-full bg-gray-700 rounded p-2"
                  value={material.name}
                  onChange={(e) => setMaterial(materials.find(m => m.name === e.target.value) || materials[0])}
                >
                  {materials.map(m => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Radius (mm)</label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-sm">{radius.toFixed(1)} mm</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Length (m)</label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-sm">{length.toFixed(1)} m</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Power</label>
                <Switch
                  checked={isEnabled}
                  onChange={setIsEnabled}
                  className={`${
                    isEnabled ? 'bg-blue-600' : 'bg-gray-700'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${
                      isEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="mt-4 p-4 bg-gray-700 rounded">
                <div className="text-sm font-medium">Calculated Resistance:</div>
                <div className="text-2xl font-bold">{resistance.toExponential(2)} Ω</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg h-[500px]">
            <ThreeVisualization
              isEnabled={isEnabled}
              material={material}
              radius={radius}
              length={length}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
