/**
 * PlaybackControls - Controls for race replay playback
 */
import {
  Box,
  HStack,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
  Select,
  Tooltip,
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaFastForward, FaFastBackward } from 'react-icons/fa';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentFrame: number;
  totalFrames: number;
  playbackSpeed: number;
  onPlayPause: () => void;
  onFrameChange: (frame: number) => void;
  onSpeedChange: (speed: number) => void;
  currentTime?: string;
  currentLap?: number;
  totalLaps?: number;
}

const PlaybackControls = ({
  isPlaying,
  currentFrame,
  totalFrames,
  playbackSpeed,
  onPlayPause,
  onFrameChange,
  onSpeedChange,
  currentTime,
  currentLap,
  totalLaps,
}: PlaybackControlsProps) => {
  const handleStepBackward = () => {
    onFrameChange(Math.max(0, currentFrame - 100));
  };

  const handleStepForward = () => {
    onFrameChange(Math.min(totalFrames - 1, currentFrame + 100));
  };

  const speedOptions = [
    { value: 0.25, label: '0.25x' },
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 4, label: '4x' },
    { value: 8, label: '8x' },
    { value: 16, label: '16x' },
  ];

  return (
    <Box w="full" bg="gray.800" p={4} borderRadius="lg">
      <VStack spacing={4} w="full">
        {/* Timeline Slider */}
        <Box w="full">
          <Slider
            value={currentFrame}
            min={0}
            max={totalFrames - 1}
            step={1}
            onChange={onFrameChange}
            focusThumbOnChange={false}
          >
            <SliderTrack bg="gray.700">
              <SliderFilledTrack bg="red.500" />
            </SliderTrack>
            <SliderThumb boxSize={4} bg="red.500" />
          </Slider>
        </Box>

        {/* Control Buttons and Info */}
        <HStack w="full" justify="space-between" align="center">
          {/* Playback Buttons */}
          <HStack spacing={2}>
            <Tooltip label="Step backward (←)" placement="top">
              <IconButton
                aria-label="Step backward"
                icon={<FaFastBackward />}
                onClick={handleStepBackward}
                size="sm"
                variant="ghost"
                colorScheme="whiteAlpha"
              />
            </Tooltip>
            <Tooltip label={isPlaying ? 'Pause (Space)' : 'Play (Space)'} placement="top">
              <IconButton
                aria-label={isPlaying ? 'Pause' : 'Play'}
                icon={isPlaying ? <FaPause /> : <FaPlay />}
                onClick={onPlayPause}
                size="lg"
                colorScheme="red"
                boxSize="50px"
              />
            </Tooltip>
            <Tooltip label="Step forward (→)" placement="top">
              <IconButton
                aria-label="Step forward"
                icon={<FaFastForward />}
                onClick={handleStepForward}
                size="sm"
                variant="ghost"
                colorScheme="whiteAlpha"
              />
            </Tooltip>
          </HStack>

          {/* Time and Lap Info */}
          <VStack spacing={0} align="center">
            {currentTime && (
              <Text fontSize="md" fontWeight="bold" color="white">
                {currentTime}
              </Text>
            )}
            {currentLap && totalLaps && (
              <Text fontSize="sm" color="gray.400">
                Lap {currentLap} / {totalLaps}
              </Text>
            )}
          </VStack>

          {/* Speed Control */}
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.400">
              Speed:
            </Text>
            <Select
              value={playbackSpeed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              size="sm"
              w="100px"
              bg="gray.700"
              borderColor="gray.600"
            >
              {speedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </HStack>

          {/* Frame Counter */}
          <Text fontSize="sm" color="gray.400">
            Frame: {currentFrame.toLocaleString()} / {totalFrames.toLocaleString()}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PlaybackControls;
