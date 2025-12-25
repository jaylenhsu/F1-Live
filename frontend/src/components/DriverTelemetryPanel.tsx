/**
 * DriverTelemetryPanel - Detailed telemetry display for selected driver
 */
import { Box, VStack, HStack, Text, Progress } from '@chakra-ui/react';
import type { RaceFrame } from '../types/telemetry';

interface DriverTelemetryPanelProps {
  currentFrame: RaceFrame | null;
  selectedDriver: string | null;
  driverColor: number[];
}

const DriverTelemetryPanel = ({
  currentFrame,
  selectedDriver,
  driverColor,
}: DriverTelemetryPanelProps) => {
  if (!selectedDriver || !currentFrame) return null;

  const driverData = currentFrame.drivers[selectedDriver];
  if (!driverData) return null;

  const rgbToHex = (rgb: number[]): string => {
    const [r, g, b] = rgb;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const hexColor = rgbToHex(driverColor);

  // Calculate percentages for visualization
  const speedPercent = Math.min(100, (driverData.speed / 350) * 100); // Max speed ~350 km/h
  const throttlePercent = driverData.throttle;

  // Brake normalization: if > 1.0, it's in 0-100 range; otherwise 0-1 range
  const brakePercent = driverData.brake > 1.0
    ? Math.min(100, Math.max(0, driverData.brake))
    : Math.min(100, Math.max(0, driverData.brake * 100));

  return (
    <Box
      position="absolute"
      left={4}
      bottom="140px"
      w="280px"
      bg="gray.900"
      borderRadius="lg"
      border="3px solid"
      borderColor={hexColor}
      p={4}
      zIndex={10}
    >
      <VStack spacing={3} align="stretch">
        {/* Driver Header */}
        <HStack justify="space-between" pb={2} borderBottom="2px" borderColor="gray.700">
          <Text fontSize="xl" fontWeight="bold" color={hexColor}>
            Driver: {selectedDriver}
          </Text>
          <Text fontSize="sm" color="gray.400">
            P{driverData.position}
          </Text>
        </HStack>

        {/* Speed */}
        <VStack spacing={1} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.400">Speed:</Text>
            <Text fontSize="md" fontWeight="bold" color="white">
              {Math.round(driverData.speed)} km/h
            </Text>
          </HStack>
          <Progress
            value={speedPercent}
            size="sm"
            colorScheme="blue"
            bg="gray.700"
            borderRadius="md"
          />
        </VStack>

        {/* Gear */}
        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.400">Gear:</Text>
          <Text fontSize="lg" fontWeight="bold" color="white">
            {driverData.gear}
          </Text>
        </HStack>

        {/* Throttle and Brake Bars */}
        <HStack spacing={3}>
          {/* Throttle */}
          <VStack flex={1} spacing={1} align="stretch">
            <Text fontSize="xs" color="gray.400" textAlign="center">
              THR
            </Text>
            <Box
              h="120px"
              bg="gray.700"
              borderRadius="md"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                h={`${throttlePercent}%`}
                bg="green.400"
                transition="height 0.1s"
              />
            </Box>
            <Text fontSize="xs" color="white" textAlign="center" fontWeight="bold">
              {throttlePercent.toFixed(0)}%
            </Text>
          </VStack>

          {/* Brake */}
          <VStack flex={1} spacing={1} align="stretch">
            <Text fontSize="xs" color="gray.400" textAlign="center">
              BRK
            </Text>
            <Box
              h="120px"
              bg="gray.700"
              borderRadius="md"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                h={`${brakePercent}%`}
                bg="red.400"
                transition="height 0.1s"
              />
            </Box>
            <Text fontSize="xs" color="white" textAlign="center" fontWeight="bold">
              {brakePercent.toFixed(0)}%
            </Text>
          </VStack>
        </HStack>

        {/* DRS Status */}
        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.400">DRS:</Text>
          <Text
            fontSize="md"
            fontWeight="bold"
            color={
              [10, 12, 14].includes(driverData.drs)
                ? 'green.400'
                : driverData.drs === 8
                ? 'yellow.400'
                : 'gray.500'
            }
          >
            {[10, 12, 14].includes(driverData.drs)
              ? 'OPEN'
              : driverData.drs === 8
              ? 'AVAILABLE'
              : 'OFF'}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default DriverTelemetryPanel;
