/**
 * Qualifying Page - Qualifying session visualization
 *
 * TODO: Implement qualifying mode with:
 * - QualifyingLeaderboard
 * - SegmentSelector (Q1/Q2/Q3 modal)
 * - TelemetryCharts (speed, gear, throttle/brake)
 * - TrackMiniMap
 * - DRS zone visualization
 */
import {
  Box,
  Container,
  Heading,
  Spinner,
  VStack,
  Text,
  Button,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQualifyingResults } from '../hooks/useQualifyingData';
import type { SessionType } from '../types/telemetry';

const QualifyingPage = () => {
  const { year, round, sessionType } = useParams<{
    year: string;
    round: string;
    sessionType: SessionType;
  }>();
  const navigate = useNavigate();

  const { data: qualifyingData, isLoading, error } = useQualifyingResults(
    Number(year),
    Number(round),
    sessionType
  );

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="red.500" />
          <Text>Loading qualifying data...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={20}>
        <VStack spacing={4}>
          <Heading size="md" color="red.500">Error Loading Data</Heading>
          <Text>{error?.toString()}</Text>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Box>
      <Container maxW="100vw" h="100vh" p={0}>
        <VStack spacing={0} h="full">
          {/* Header */}
          <Box w="full" bg="gray.900" p={4}>
            <Heading size="md">
              F1 {year} - Round {round} - {sessionType === 'Q' ? 'Qualifying' : 'Sprint Qualifying'}
            </Heading>
            <Button size="sm" mt={2} onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </Box>

          {/* Main Content Area */}
          <Box flex={1} w="full" p={4} bg="black">
            <Text color="gray.400" textAlign="center" mt={20}>
              Qualifying Components Coming Soon
            </Text>
            <Text color="gray.500" textAlign="center" mt={2} fontSize="sm">
              Loaded {qualifyingData?.results.length} drivers
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default QualifyingPage;
