/**
 * Leaderboard - Displays current race positions
 */
import { Box, VStack, HStack, Text, Badge } from '@chakra-ui/react';
import { useMemo } from 'react';
import type { RaceFrame } from '../types/telemetry';

interface LeaderboardProps {
  currentFrame: RaceFrame | null;
  driverColors: Record<string, number[]>;
  selectedDriver?: string | null;
  onDriverSelect?: (driverCode: string) => void;
}

// Tire compound colors
const TIRE_COLORS: Record<number, { name: string; color: string }> = {
  0: { name: 'SOFT', color: '#ff0000' },
  1: { name: 'MEDIUM', color: '#ffff00' },
  2: { name: 'HARD', color: '#ffffff' },
  3: { name: 'INTERMEDIATE', color: '#00ff00' },
  4: { name: 'WET', color: '#0000ff' },
};

const Leaderboard = ({
  currentFrame,
  driverColors,
  selectedDriver,
  onDriverSelect,
}: LeaderboardProps) => {
  if (!currentFrame) return null;

  // Memoize sorted drivers to prevent re-sorting on every render
  // Only re-sort when positions actually change
  const sortedDrivers = useMemo(() => {
    return Object.entries(currentFrame.drivers)
      .sort(([, a], [, b]) => a.position - b.position);
  }, [currentFrame.drivers]);

  const rgbToHex = (rgb: number[]): string => {
    const [r, g, b] = rgb;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  return (
    <Box w="full" h="full" bg="gray.800" borderRadius="lg" overflowY="auto">
      <VStack spacing={0} align="stretch">
        {/* Header */}
        <Box
          bg="gray.900"
          px={3}
          py={2}
          borderBottom="1px"
          borderColor="gray.700"
          position="sticky"
          top={0}
          zIndex={1}
        >
          <HStack justify="space-between" fontSize="xs" fontWeight="bold" color="gray.400">
            <Text w="40px">POS</Text>
            <Text flex={1}>DRIVER</Text>
            <Text w="50px" textAlign="center">TIRE</Text>
          </HStack>
        </Box>

        {/* Driver Rows */}
        {sortedDrivers.map(([driverCode, driverData]) => {
          const color = driverColors[driverCode] || [255, 255, 255];
          const hexColor = rgbToHex(color);
          const isSelected = selectedDriver === driverCode;
          const tireInfo = TIRE_COLORS[driverData.tyre] || { name: 'UNKNOWN', color: '#808080' };

          return (
            <HStack
              key={driverCode}
              px={3}
              py={2}
              spacing={2}
              bg={isSelected ? 'gray.700' : 'transparent'}
              _hover={{ bg: 'gray.700', cursor: 'pointer' }}
              onClick={() => onDriverSelect?.(driverCode)}
              borderBottom="1px"
              borderColor="gray.700"
            >
              {/* Position */}
              <Text w="40px" fontSize="lg" fontWeight="bold" color="white">
                {driverData.position}
              </Text>

              {/* Driver Code with Team Color */}
              <HStack flex={1} spacing={2}>
                <Box w="3px" h="24px" bg={hexColor} borderRadius="full" />
                <Text fontSize="md" fontWeight="bold" color="white">
                  {driverCode}
                </Text>
              </HStack>

              {/* Tire Compound */}
              <Box w="50px" display="flex" justifyContent="center">
                <Badge
                  bg={tireInfo.color}
                  color={tireInfo.color === '#ffff00' ? 'black' : 'white'}
                  fontSize="9px"
                  px={1}
                  borderRadius="sm"
                >
                  {tireInfo.name[0]}
                </Badge>
              </Box>
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Leaderboard;
