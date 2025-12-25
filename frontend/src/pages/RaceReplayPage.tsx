/**
 * Race Replay Page - Main race visualization
 */
import { useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Spinner,
  VStack,
  Text,
  Button,
  Grid,
  GridItem,
  HStack,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRaceTelemetry, useTrackGeometry } from '../hooks/useRaceTelemetry';
import { usePlaybackStore } from '../stores/playbackStore';
import TrackCanvas from '../components/TrackCanvas';
import PlaybackControls from '../components/PlaybackControls';
import Leaderboard from '../components/Leaderboard';
import DriverTelemetryPanel from '../components/DriverTelemetryPanel';
import type { SessionType } from '../types/telemetry';

const RaceReplayPage = () => {
  const { year, round, sessionType } = useParams<{
    year: string;
    round: string;
    sessionType: SessionType;
  }>();
  const navigate = useNavigate();

  const {
    data: telemetryData,
    isLoading: isLoadingTelemetry,
    error: telemetryError,
    allFramesLoaded,
    loadingProgress,
    isLoadingMore
  } = useRaceTelemetry(
    Number(year),
    Number(round),
    sessionType
  );

  const { data: trackData, isLoading: isLoadingTrack, error: trackError } = useTrackGeometry(
    Number(year),
    Number(round),
    sessionType
  );

  // Playback state
  const {
    frameIndex,
    paused,
    speed,
    selectedDriver,
    setFrameIndex,
    togglePause,
    setSpeed,
    selectDriver,
    reset,
  } = usePlaybackStore();

  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());

  // Playback loop
  useEffect(() => {
    if (!telemetryData?.frames || paused) {
      return;
    }

    const animate = () => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;

      // Update frame based on speed (assuming 60 FPS base rate)
      if (delta >= 16.67 / speed) {
        setFrameIndex(Math.min(frameIndex + 1, telemetryData.frames.length - 1));
        lastTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [frameIndex, paused, speed, telemetryData, setFrameIndex]);

  // Reset playback when data changes
  useEffect(() => {
    reset();
  }, [year, round, sessionType, reset]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFrameIndex(Math.max(0, frameIndex - 100));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFrameIndex(Math.min((telemetryData?.frames.length || 0) - 1, frameIndex + 100));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSpeed(Math.min(16, speed * 2));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSpeed(Math.max(0.25, speed / 2));
          break;
        case '0':
          e.preventDefault();
          setFrameIndex(0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [frameIndex, speed, telemetryData, setFrameIndex, setSpeed, togglePause]);

  // Current frame data
  const currentFrame = telemetryData?.frames?.[frameIndex] || null;

  if (isLoadingTelemetry || isLoadingTrack) {
    return (
      <Container maxW="container.xl" py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="red.500" thickness="4px" speed="0.65s" />
          <Heading size="md">Loading Race Data...</Heading>
          <Text color="gray.400" textAlign="center">
            First-time load may take 1-3 minutes while FastF1 fetches data
          </Text>
          <Text color="gray.500" fontSize="sm" textAlign="center">
            Subsequent loads will be much faster (cached)
          </Text>
        </VStack>
      </Container>
    );
  }

  if (telemetryError || trackError) {
    return (
      <Container maxW="container.xl" py={20}>
        <VStack spacing={4}>
          <Heading size="md" color="red.500">Error Loading Data</Heading>
          <Text>{(telemetryError || trackError)?.toString()}</Text>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </VStack>
      </Container>
    );
  }

  // Format time from seconds
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  return (
    <Box w="100vw" h="100vh" bg="black" overflow="hidden">
      <VStack spacing={0} h="full">
        {/* Header */}
        <HStack
          w="full"
          bg="gray.900"
          px={4}
          py={2}
          justify="space-between"
          borderBottom="1px"
          borderColor="gray.700"
        >
          <HStack spacing={4}>
            <Button size="sm" variant="ghost" onClick={() => navigate('/')}>
              ← Back
            </Button>
            <Heading size="md">
              F1 {year} - Round {round} - {sessionType === 'R' ? 'Race' : 'Sprint'}
            </Heading>
          </HStack>

          <HStack spacing={4}>
            {isLoadingMore && (
              <HStack spacing={2}>
                <Spinner size="sm" color="blue.400" />
                <Text fontSize="sm" color="blue.300">
                  Loading frames... {loadingProgress.toFixed(0)}%
                </Text>
              </HStack>
            )}

            {/* Keyboard shortcuts hint */}
            <Box
              px={3}
              py={1}
              bg="gray.800"
              borderRadius="md"
              fontSize="xs"
              color="gray.400"
            >
              <Text>
                <Text as="span" fontWeight="bold" color="white">Space</Text> Play/Pause •
                <Text as="span" fontWeight="bold" color="white"> ←→</Text> Skip •
                <Text as="span" fontWeight="bold" color="white"> ↑↓</Text> Speed •
                <Text as="span" fontWeight="bold" color="white"> 0</Text> Restart
              </Text>
            </Box>
          </HStack>
        </HStack>

        {/* Main Content */}
        <Box flex={1} w="full" display="flex" flexDirection="column" overflow="hidden" position="relative">
          <Grid
            templateColumns="1fr 300px"
            gap={4}
            flex={1}
            w="full"
            px={4}
            pt={4}
            overflow="hidden"
            minH={0}
          >
            {/* Track Canvas */}
            <GridItem overflow="hidden">
              {trackData && (
                <TrackCanvas
                  trackGeometry={trackData}
                  currentFrame={currentFrame}
                  driverColors={telemetryData?.driver_colors || {}}
                  selectedDriver={selectedDriver}
                />
              )}
            </GridItem>

            {/* Leaderboard */}
            <GridItem overflow="hidden">
              <Leaderboard
                currentFrame={currentFrame}
                driverColors={telemetryData?.driver_colors || {}}
                selectedDriver={selectedDriver}
                onDriverSelect={selectDriver}
              />
            </GridItem>
          </Grid>

          {/* Driver Telemetry Panel - Overlays on track */}
          {selectedDriver && (
            <DriverTelemetryPanel
              currentFrame={currentFrame}
              selectedDriver={selectedDriver}
              driverColor={telemetryData?.driver_colors[selectedDriver] || [255, 255, 255]}
            />
          )}

          {/* Playback Controls */}
          <Box px={4} pb={4} pt={2} flexShrink={0} h="120px">
            <PlaybackControls
              isPlaying={!paused}
              currentFrame={frameIndex}
              totalFrames={telemetryData?.frames?.length || 0}
              playbackSpeed={speed}
              onPlayPause={togglePause}
              onFrameChange={setFrameIndex}
              onSpeedChange={setSpeed}
              currentTime={currentFrame ? formatTime(currentFrame.t) : undefined}
              currentLap={currentFrame?.lap}
              totalLaps={telemetryData?.total_laps}
            />
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default RaceReplayPage;
