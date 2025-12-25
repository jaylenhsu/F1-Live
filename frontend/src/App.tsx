import { Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RaceReplayPage from './pages/RaceReplayPage';
import QualifyingPage from './pages/QualifyingPage';

function App() {
  return (
    <Box minH="100vh" bg="black">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/race/:year/:round/:sessionType" element={<RaceReplayPage />} />
        <Route path="/qualifying/:year/:round/:sessionType" element={<QualifyingPage />} />
      </Routes>
    </Box>
  );
}

export default App;
