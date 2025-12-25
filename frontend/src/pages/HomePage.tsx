/**
 * Home page with session selector
 */
import {
  Box,
  Container,
  Heading,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(2024);
  const [round, setRound] = useState(1);
  const [sessionType, setSessionType] = useState<'R' | 'Q' | 'S' | 'SQ'>('R');

  const handleStart = () => {
    if (sessionType === 'Q' || sessionType === 'SQ') {
      navigate(`/qualifying/${year}/${round}/${sessionType}`);
    } else {
      navigate(`/race/${year}/${round}/${sessionType}`);
    }
  };

  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={2}>
            🏎️ F1 Live
          </Heading>
          <Text color="gray.400">
            Watch F1 races and qualifying sessions with interactive telemetry
          </Text>
        </Box>

        <Box bg="gray.900" p={8} borderRadius="lg">
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>Year</FormLabel>
              <NumberInput
                value={year}
                min={2018}
                max={2025}
                onChange={(_, val) => setYear(val)}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Round</FormLabel>
              <NumberInput
                value={round}
                min={1}
                max={24}
                onChange={(_, val) => setRound(val)}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Session Type</FormLabel>
              <Select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value as any)}
              >
                <option value="R">Race</option>
                <option value="Q">Qualifying</option>
                <option value="S">Sprint Race</option>
                <option value="SQ">Sprint Qualifying</option>
              </Select>
            </FormControl>

            <Button
              colorScheme="red"
              size="lg"
              width="full"
              onClick={handleStart}
            >
              Load Session
            </Button>
          </VStack>
        </Box>

        <Box textAlign="center" color="gray.500" fontSize="sm">
          <Text>
            Data powered by FastF1 • First load may take 10-30 seconds
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default HomePage;
