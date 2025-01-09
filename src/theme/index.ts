import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#0F1117',
        color: 'white',
      },
    },
  },
  colors: {
    brand: {
      primary: '#F7931A',
      secondary: '#5B3BE8',
      background: '#0F1117',
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
        borderRadius: 'xl',
        fontWeight: 'semibold',
      },
      variants: {
        gradient: {
          bgGradient: 'linear(to-r, brand.primary, brand.secondary)',
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, #E68219, #4A30D7)',
            _disabled: {
              bgGradient: 'linear(to-r, brand.primary, brand.secondary)',
            },
          },
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'brand.card',
            borderRadius: 'xl',
            _hover: {
              bg: 'brand.card',
            },
            _focus: {
              bg: 'brand.card',
              borderColor: 'brand.primary',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
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