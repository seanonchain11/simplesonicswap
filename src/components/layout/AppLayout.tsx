import { Box, Container, Flex, Image, Link as ChakraLink } from '@chakra-ui/react'
import Link from 'next/link'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" bg="brand.background">
      <Container maxW="container.xl">
        <Flex as="nav" py={4} justify="space-between" align="center">
          <Link href="/" passHref>
            <ChakraLink>
              <Image
                src="/logo.svg"
                alt="SimpleSonicSwap"
                h="40px"
                _hover={{ opacity: 0.8 }}
              />
            </ChakraLink>
          </Link>
        </Flex>
      </Container>
      
      <Box as="main" py={8}>
        {children}
      </Box>
      
      <Box as="footer" py={8} textAlign="center" color="brand.text.secondary">
        <Container maxW="container.xl">
          © {new Date().getFullYear()} SimpleSonicSwap. All rights reserved.
        </Container>
      </Box>
    </Box>
  )
} 