/**
 * TrackCanvas - Main canvas component for rendering F1 track and cars
 * Uses Konva for high-performance 2D rendering
 */
import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Circle, Text } from 'react-konva';
import { Box } from '@chakra-ui/react';
import type { TrackGeometry, RaceFrame } from '../types/telemetry';

interface TrackCanvasProps {
  trackGeometry: TrackGeometry;
  currentFrame: RaceFrame | null;
  driverColors: Record<string, number[]>;
  selectedDriver?: string | null;
  width?: number;
  height?: number;
}

const TrackCanvas = ({
  trackGeometry,
  currentFrame,
  driverColors,
  selectedDriver,
  width = 1200,
  height = 800,
}: TrackCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });

  // Calculate scale and offset to fit track in canvas
  const { bounds, inner, outer, rotation } = trackGeometry;
  const trackWidth = bounds.x_max - bounds.x_min;
  const trackHeight = bounds.y_max - bounds.y_min;

  // Add padding
  const padding = 50;
  const scaleX = (dimensions.width - padding * 2) / trackWidth;
  const scaleY = (dimensions.height - padding * 2) / trackHeight;
  const scale = Math.min(scaleX, scaleY);

  // Center the track
  const offsetX = (dimensions.width - trackWidth * scale) / 2 - bounds.x_min * scale;
  const offsetY = (dimensions.height - trackHeight * scale) / 2 - bounds.y_min * scale;

  // Transform coordinates from track space to canvas space
  const transformX = (x: number) => x * scale + offsetX;
  const transformY = (y: number) => y * scale + offsetY;

  // Convert RGB array to hex color
  const rgbToHex = (rgb: number[]): string => {
    const [r, g, b] = rgb;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prepare track boundary points for Konva Line
  const innerPoints = inner.flatMap(([x, y]) => [transformX(x), transformY(y)]);
  const outerPoints = outer.flatMap(([x, y]) => [transformX(x), transformY(y)]);

  return (
    <Box ref={containerRef} w="full" h="full" bg="gray.900" borderRadius="lg" overflow="hidden">
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Track outer boundary */}
          <Line
            points={outerPoints}
            stroke="#4a5568"
            strokeWidth={3}
            closed
            fill="#2d3748"
          />

          {/* Track inner boundary */}
          <Line
            points={innerPoints}
            stroke="#4a5568"
            strokeWidth={3}
            closed
            fill="#1a202c"
          />

          {/* Render cars */}
          {currentFrame && Object.entries(currentFrame.drivers).map(([driverCode, driverData]) => {
            const color = driverColors[driverCode] || [255, 255, 255];
            const hexColor = rgbToHex(color);
            const isSelected = selectedDriver === driverCode;
            const carX = transformX(driverData.x);
            const carY = transformY(driverData.y);

            return (
              <Circle
                key={driverCode}
                x={carX}
                y={carY}
                radius={isSelected ? 8 : 6}
                fill={hexColor}
                stroke={isSelected ? '#ffffff' : undefined}
                strokeWidth={isSelected ? 2 : 0}
                shadowBlur={isSelected ? 10 : 5}
                shadowColor={hexColor}
                opacity={selectedDriver && !isSelected ? 0.5 : 1}
              />
            );
          })}

          {/* Driver labels (only for selected or when no selection) */}
          {currentFrame && Object.entries(currentFrame.drivers).map(([driverCode, driverData]) => {
            const shouldShowLabel = !selectedDriver || selectedDriver === driverCode;
            if (!shouldShowLabel) return null;

            const carX = transformX(driverData.x);
            const carY = transformY(driverData.y);

            return (
              <Text
                key={`label-${driverCode}`}
                x={carX + 10}
                y={carY - 5}
                text={driverCode}
                fontSize={12}
                fill="#ffffff"
                fontStyle="bold"
              />
            );
          })}
        </Layer>
      </Stage>
    </Box>
  );
};

export default TrackCanvas;
