/**
 * Chakra UI theme customization
 */
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: 'black',
        color: 'white',
      },
    },
  },
  colors: {
    f1: {
      red: '#E10600',
      darkGray: '#15151E',
      mediumGray: '#38383F',
      lightGray: '#949498',
      green: '#00D859',
      yellow: '#FFD700',
      orange: '#FF8700',
    },
    track: {
      green: 'rgb(150, 150, 150)',
      yellow: 'rgb(220, 180, 0)',
      red: 'rgb(200, 30, 30)',
      sc: 'rgb(180, 100, 30)',
      vsc: 'rgb(200, 130, 50)',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'gray',
      },
    },
  },
  fonts: {
    heading: '"Formula1", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
});

export default theme;
