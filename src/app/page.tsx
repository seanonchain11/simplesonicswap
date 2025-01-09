'use client'

import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} align="center" justify="center" minH="80vh">
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-r, #F7931A20, #5B3BE820)"
          zIndex={-1}
          pointerEvents="none"
        />
        
        <Heading
          as="h1"
          size="4xl"
          bgGradient="linear(to-r, #F7931A, #5B3BE8)"
          bgClip="text"
          fontWeight="extrabold"
        >
          SimpleSonicSwap
        </Heading>
        
        <Text fontSize="xl" textAlign="center" maxW="600px">
          Seamlessly swap between native Sonic ($S) and wrapped Sonic ($wS) tokens
          with our intuitive interface powered by Rayidum AMM protocol.
        </Text>
        
        <Link href="/app" passHref>
          <Button
            size="lg"
            bgGradient="linear(to-r, #F7931A, #5B3BE8)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, #E68219, #4A30D7)",
            }}
            px={8}
          >
            Launch App
          </Button>
        </Link>
      </VStack>
    </Container>
  )
} 