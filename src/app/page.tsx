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
  Grid,
  GridItem,
} from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <Box
      minH="100vh"
      position="relative"
      bg="radial-gradient(circle at center, #0E0E0E 20%, #0E0E0E 100%)"
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
            src="/logo.svg"
            alt="SimpleSonicSwap Logo"
            width={201.7}
            height={40}
            style={{ objectFit: 'contain' }}
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
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8} mt={32}>
          <GridItem>
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
          </GridItem>
          <GridItem display="flex" justifyContent="center" alignItems="center">
            <Box
              bg="rgba(13, 15, 23, 0.5)"
              borderRadius="24px"
              p={6}
              boxShadow="0px 4px 24px rgba(0, 0, 0, 0.2)"
            >
              <Image
                src="/swap-interface-preview.png"
                alt="SimpleSonicSwap Interface"
                width="400px"
                height="auto"
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
} 