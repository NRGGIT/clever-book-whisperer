
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  id?: string;
}

export const Mermaid = ({ chart, id }: MermaidProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis',
        },
        themeVariables: {
          primaryColor: '#f59e0b',
          primaryTextColor: '#1f2937',
          primaryBorderColor: '#d97706',
          lineColor: '#6b7280',
          secondaryColor: '#fef3c7',
          tertiaryColor: '#fff7ed',
        },
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (ref.current && isInitialized && chart) {
      const renderChart = async () => {
        try {
          const uniqueId = id || `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          ref.current!.innerHTML = '';
          
          const { svg } = await mermaid.render(uniqueId, chart);
          ref.current!.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          ref.current!.innerHTML = `
            <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-red-700 dark:text-red-300 text-sm">Failed to render diagram</p>
              <pre class="text-xs text-red-600 dark:text-red-400 mt-2 overflow-auto">${chart}</pre>
            </div>
          `;
        }
      };

      renderChart();
    }
  }, [chart, id, isInitialized]);

  if (!chart) return null;

  return (
    <div className="my-6 flex justify-center">
      <div 
        ref={ref} 
        className="mermaid-diagram max-w-full overflow-auto bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
      />
    </div>
  );
};
