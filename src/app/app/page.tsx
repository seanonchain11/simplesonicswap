'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { FaExchangeAlt } from 'react-icons/fa'

export default function SwapInterface() {
  const [amount, setAmount] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')
  const toast = useToast()

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        setAccount(accounts[0])
        setIsConnected(true)
      } else {
        toast({
          title: 'Wallet not found',
          description: 'Please install MetaMask',
          status: 'error',
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  const handleSwap = async () => {
    if (!amount || !isConnected) return
    
    try {
      // Implement swap logic here
      toast({
        title: 'Swap initiated',
        description: 'Please confirm the transaction in your wallet',
        status: 'info',
        duration: 5000,
      })
    } catch (error) {
      console.error('Error during swap:', error)
      toast({
        title: 'Swap failed',
        description: 'An error occurred during the swap',
        status: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <Container maxW="container.sm" py={20}>
      <VStack spacing={8}>
        <Box
          w="full"
          bg="whiteAlpha.100"
          borderRadius="xl"
          p={6}
          boxShadow="xl"
        >
          <VStack spacing={4}>
            <Flex w="full" justify="space-between" align="center">
              <Text>From</Text>
              <Text>Balance: 0.00 S</Text>
            </Flex>
            <Input
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              size="lg"
            />
            
            <Button
              w="full"
              variant="ghost"
              onClick={() => {/* Implement token flip */}}
            >
              <FaExchangeAlt />
            </Button>
            
            <Flex w="full" justify="space-between" align="center">
              <Text>To</Text>
              <Text>Balance: 0.00 wS</Text>
            </Flex>
            <Input
              placeholder="0.0"
              value={amount}
              isReadOnly
              size="lg"
            />
          </VStack>
        </Box>

        {!isConnected ? (
          <Button
            w="full"
            colorScheme="blue"
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        ) : (
          <Button
            w="full"
            colorScheme="blue"
            onClick={handleSwap}
            isDisabled={!amount}
          >
            Swap
          </Button>
        )}
      </VStack>
    </Container>
  )
} 