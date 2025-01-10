import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#0E0E0E',
        color: 'white',
      },
    },
  },
  colors: {
    brand: {
      primary: '#F7931A',
      secondary: '#5B3BE8',
      background: '#0E0E0E',
      card: 'rgba(255, 255, 255, 0.1)',
      text: {
        primary: '#FFFFFF',
        secondary: 'rgba(255, 255, 255, 0.7)',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
      },
      variants: {
        gradient: {
          bgGradient: 'linear(to-r, brand.primary, brand.secondary)',
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, #E68219, #4A30D7)',
            transform: 'scale(1.05)',
          },
          _active: {
            bgGradient: 'linear(to-r, #D67218, #3925C6)',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'white',
        fontWeight: 'bold',
      },
    },
    Text: {
      baseStyle: {
        color: 'whiteAlpha.900',
      },
    },
  },
  fonts: {
    heading: 'var(--font-inter)',
    body: 'var(--font-inter)',
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
})

export default theme 