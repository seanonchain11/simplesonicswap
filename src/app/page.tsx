'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <Box
      minH="100vh"
      position="relative"
      bgColor="#0E0E0E"
      color="white"
      overflow="hidden"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        right="-10%"
        bottom="-10%"
        width="70%"
        height="70%"
        opacity={0.5}
      >
        <Image
          src="/sonic-pattern.png"
          alt="Pattern"
          width="100%"
          height="100%"
          objectFit="contain"
        />
      </Box>

      <Container maxW="container.xl">
        {/* Header */}
        <Flex justify="space-between" align="center" py={6}>
          <Image
            src="/simplesonicswaplogo.png"
            alt="SimpleSonicSwap Logo"
            h="40px"
          />
          <Link href="/app" passHref>
            <Button
              bg="linear-gradient(90deg, #F7931A 0%, #5B3BE8 100%)"
              color="white"
              px={8}
              py={6}
              borderRadius="full"
              _hover={{
                transform: 'scale(1.05)',
                bg: 'linear-gradient(90deg, #E68219 0%, #4A30D7 100%)',
              }}
              transition="all 0.2s"
            >
              Launch APP
            </Button>
          </Link>
        </Flex>

        {/* Main Content */}
        <Box mt={32} maxW="600px">
          <VStack align="flex-start" spacing={8}>
            <Heading
              as="h1"
              fontSize="6xl"
              fontWeight="bold"
              lineHeight="1.2"
            >
              The Easiest Way to Wrap Your $S Tokens
            </Heading>
            <Text fontSize="xl" color="whiteAlpha.800">
              Effortlessly convert your $S tokens to $wS tokens in seconds. 
              No frills, no fuss—just fast, reliable swaps on the Sonic blockchain.
            </Text>
            <Link href="/app" passHref>
              <Button
                bg="linear-gradient(90deg, #F7931A 0%, #5B3BE8 100%)"
                color="white"
                size="lg"
                px={8}
                py={6}
                borderRadius="full"
                _hover={{
                  transform: 'scale(1.05)',
                  bg: 'linear-gradient(90deg, #E68219 0%, #4A30D7 100%)',
                }}
                transition="all 0.2s"
              >
                Swap Now
              </Button>
            </Link>
            <Text fontSize="sm" color="whiteAlpha.600" mt={4}>
              Bridge to Sonic with any asset, from any chain, using the{' '}
              <Link 
                href="https://gateway.soniclabs.com/ethereum/sonic/usdc" 
                target="_blank"
                style={{
                  color: '#F7931A',
                  textDecoration: 'none',
                }}
              >
                Sonic Gateway
              </Link>
              .
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
} 