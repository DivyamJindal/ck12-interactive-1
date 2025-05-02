interface ThreeVisualizationProps {
  isEnabled: boolean;
  material: {
    name: string;
    resistivity: number;
    color: string;
  };
  radius: number;
  length: number;
}

declare const ThreeVisualization: React.FC<ThreeVisualizationProps>;
export default ThreeVisualization;
