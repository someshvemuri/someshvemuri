'use client';

import { useEffect, useState } from 'react';

interface ExcalidrawViewerProps {
  sceneData: string; // JSON string of the Excalidraw scene
}

interface ExcalidrawElement {
  type: 'text' | 'arrow';
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: number[][];
  text?: string;
  fontSize?: number;
  strokeColor?: string;
  endArrowhead?: string | null;
}

interface ExcalidrawScene {
  elements: ExcalidrawElement[];
  appState?: Record<string, unknown>;
}

function getSceneBounds(elements: ExcalidrawElement[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const element of elements) {
    if (element.type === 'text') {
      minX = Math.min(minX, element.x);
      minY = Math.min(minY, element.y);
      maxX = Math.max(maxX, element.x + (element.width ?? 0));
      maxY = Math.max(maxY, element.y + (element.height ?? 0));
      continue;
    }

    if (element.type === 'arrow' && element.points) {
      for (const [pointX, pointY] of element.points) {
        const absX = element.x + pointX;
        const absY = element.y + pointY;
        minX = Math.min(minX, absX);
        minY = Math.min(minY, absY);
        maxX = Math.max(maxX, absX);
        maxY = Math.max(maxY, absY);
      }
    }
  }

  if (!Number.isFinite(minX)) {
    return { minX: 0, minY: 0, width: 800, height: 600 };
  }

  const padding = 60;
  return {
    minX: minX - padding,
    minY: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}

function buildArrowPath(element: ExcalidrawElement) {
  if (!element.points || element.points.length < 2) return '';
  const absolutePoints = element.points.map(([pointX, pointY]) => [element.x + pointX, element.y + pointY]);
  const [firstX, firstY] = absolutePoints[0];
  if (absolutePoints.length === 2) {
    const [lastX, lastY] = absolutePoints[1];
    const midX = (firstX + lastX) / 2;
    const midY = (firstY + lastY) / 2;
    const curveOffset = Math.abs(lastY - firstY) > 20 ? 0 : 24;
    return `M ${firstX} ${firstY} Q ${midX} ${midY + curveOffset} ${lastX} ${lastY}`;
  }

  return absolutePoints.reduce(
    (path, [pointX, pointY], index) =>
      index === 0 ? `M ${pointX} ${pointY}` : `${path} L ${pointX} ${pointY}`,
    '',
  );
}

export default function ExcalidrawViewer({ sceneData }: ExcalidrawViewerProps) {
  const [scene, setScene] = useState<ExcalidrawScene | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(sceneData);
      setScene(parsed);
    } catch {
      setError('Failed to parse diagram data');
    }
  }, [sceneData]);

  if (error) {
    return <div className="text-[#666] text-sm font-mono p-4">{error}</div>;
  }

  if (!scene) return null;

  const elements = scene.elements.filter((element) => !('isDeleted' in element) || !(element).isDeleted) as ExcalidrawElement[];
  const bounds = getSceneBounds(elements);

  return (
    <div className="w-full overflow-hidden border border-[#2a2a2a] bg-[#111] rounded">
      <svg
        viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
        className="w-full h-auto block"
        role="img"
        aria-label="Excalidraw diagram"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="8"
            refX="9"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 4 L 0 8 z" fill="#e8e8e8" />
          </marker>
        </defs>

        <rect x={bounds.minX} y={bounds.minY} width={bounds.width} height={bounds.height} fill="#111111" />

        {elements.map((element, index) => {
          if (element.type === 'arrow') {
            const path = buildArrowPath(element);
            if (!path) return null;
            return (
              <path
                key={`arrow-${index}`}
                d={path}
                fill="none"
                stroke="#e8e8e8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd={element.endArrowhead ? 'url(#arrowhead)' : undefined}
              />
            );
          }

          if (element.type === 'text' && element.text) {
            const lines = element.text.split('\n');
            const fontSize = element.fontSize ?? 20;
            return (
              <text
                key={`text-${index}`}
                x={element.x}
                y={element.y + fontSize}
                fill="#f0f0f0"
                fontSize={fontSize}
                fontFamily="Virgil, 'Comic Sans MS', 'Segoe Print', cursive"
              >
                {lines.map((line, lineIndex) => (
                  <tspan key={`${index}-${lineIndex}`} x={element.x} dy={lineIndex === 0 ? 0 : fontSize * 1.35}>
                    {line}
                  </tspan>
                ))}
              </text>
            );
          }

          return null;
        })}
      </svg>
    </div>
  );
}
