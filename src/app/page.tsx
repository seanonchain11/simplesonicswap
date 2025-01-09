'use client'

import {
  Box,
  Container,
  Flex,
  Image,
  Link as ChakraLink,
  Stack,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <Box
      minH="100vh"
      position="relative"
      bgImage="url('/landingbackground.png')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <Flex justify="center" mb={16}>
          <Image
            src="/simplesonicswaplogo.png"
            alt="SimpleSonicSwap Logo"
            h="60px"
          />
        </Flex>

        {/* Main Content */}
        <VStack spacing={12} align="center">
          <Link href="/app" passHref>
            <Image
              src="/launchappbutton.png"
              alt="Launch App"
              h="60px"
              _hover={{ transform: 'scale(1.05)' }}
              transition="transform 0.2s"
              cursor="pointer"
            />
          </Link>
        </VStack>

        {/* Footer */}
        <Flex justify="center" position="fixed" bottom="8" left="0" right="0">
          <Stack direction="row" spacing={6}>
            <ChakraLink href="https://twitter.com" isExternal>
              <Image src="/X.png" alt="Twitter" h="40px" />
            </ChakraLink>
            <ChakraLink href="https://discord.com" isExternal>
              <Image src="/Discord Bubble.png" alt="Discord" h="40px" />
            </ChakraLink>
            <ChakraLink href="https://t.me" isExternal>
              <Image src="/Telegram.png" alt="Telegram" h="40px" />
            </ChakraLink>
            <ChakraLink href="https://github.com" isExternal>
              <Image src="/GitHub.png" alt="GitHub" h="40px" />
            </ChakraLink>
          </Stack>
        </Flex>
      </Container>
    </Box>
  )
} 