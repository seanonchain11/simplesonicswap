'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Flex,
  HStack,
  Image,
  VStack,
  useToast,
  useDisclosure,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import TokenInput from '@/components/swap/TokenInput'
import ConfirmationModal from '@/components/swap/ConfirmationModal'
import TransactionHistory from '@/components/swap/TransactionHistory'
import TokenApproval from '@/components/swap/TokenApproval'
import priceService, { PriceUpdate } from '@/services/priceService'

interface Transaction {
  id: string
  type: 'wrap' | 'unwrap'
  amount: string
  status: 'pending' | 'completed' | 'failed'
  timestamp: number
  hash: string
}

const WSONIC_CONTRACT = '0x3fb23c53eb22762087b4557db13c4d105eecb2b8'

export default function SwapInterface() {
  // State
  const [amount, setAmount] = useState('')
  const [isFlipped, setIsFlipped] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [allowance, setAllowance] = useState('0')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [priceInfo, setPriceInfo] = useState<PriceUpdate>({
    price: '0',
    priceImpact: 0,
    estimatedGas: '0',
  })

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure()

  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure()

  const toast = useToast()

  useEffect(() => {
    if (account && !isFlipped) {
      checkAllowance()
    }
  }, [account, isFlipped])

  useEffect(() => {
    if (amount) {
      updatePrice()
    }
    const unsubscribe = priceService.subscribe((update) => {
      setPriceInfo(update)
    })
    return () => unsubscribe()
  }, [amount, isFlipped])

  const checkAllowance = async () => {
    if (!account) return
    const newAllowance = await priceService.checkAllowance(
      isFlipped ? 'wS' : 'S',
      account
    )
    setAllowance(newAllowance)
  }

  const updatePrice = async () => {
    const update = await priceService.getPrice(amount, !isFlipped)
    setPriceInfo(update)
  }

  const handleApprove = async () => {
    if (!account) return
    setIsApproving(true)
    try {
      const success = await priceService.approve(
        isFlipped ? 'wS' : 'S',
        WSONIC_CONTRACT
      )
      if (success) {
        toast({
          title: 'Approval Successful',
          description: 'You can now proceed with the swap.',
          status: 'success',
          duration: 5000,
        })
        await checkAllowance()
      }
    } catch (error) {
      console.error('Error approving token:', error)
      toast({
        title: 'Approval Failed',
        description: 'Failed to approve token spending.',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    checkAllowance()
  }

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        setAccount(accounts[0])
        setIsConnected(true)
        
        toast({
          title: 'Wallet Connected',
          description: 'Your wallet has been connected successfully.',
          status: 'success',
          duration: 3000,
        })
      } else {
        toast({
          title: 'Wallet Not Found',
          description: 'Please install MetaMask to use this app.',
          status: 'error',
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to your wallet.',
        status: 'error',
        duration: 5000,
      })
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
  }

  const handleSwapConfirm = async () => {
    setIsSwapping(true)
    try {
      const txHash = '0x' + Math.random().toString(16).slice(2)
      const newTx: Transaction = {
        id: txHash,
        type: isFlipped ? 'unwrap' : 'wrap',
        amount,
        status: 'pending',
        timestamp: Date.now(),
        hash: txHash,
      }
      
      setTransactions([newTx, ...transactions])
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === txHash ? { ...tx, status: 'completed' } : tx
        )
      )
      
      toast({
        title: 'Swap Successful',
        description: 'Your tokens have been swapped successfully.',
        status: 'success',
        duration: 5000,
      })
      
      setAmount('')
      onConfirmClose()
    } catch (error) {
      console.error('Error during swap:', error)
      toast({
        title: 'Swap Failed',
        description: 'An error occurred during the swap.',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsSwapping(false)
    }
  }

  return (
    <Box
      minH="100vh"
      position="relative"
      bgImage="url('/appbackground.png')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={12}>
          <Image
            src="/simplesonicswaplogo.png"
            alt="SimpleSonicSwap Logo"
            h="50px"
          />
          <Image
            src={isConnected ? "/connectedbutton.png" : "/connectwalletbutton.png"}
            alt={isConnected ? "Connected" : "Connect Wallet"}
            h="50px"
            cursor="pointer"
            onClick={!isConnected ? connectWallet : undefined}
            _hover={{ transform: 'scale(1.05)' }}
            transition="transform 0.2s"
          />
        </Flex>

        {/* Swap Card */}
        <Flex justify="center">
          <Box
            w="full"
            maxW="500px"
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            borderRadius="3xl"
            p={6}
          >
            <VStack spacing={6}>
              <TokenInput
                label={isFlipped ? 'From (wS)' : 'From (S)'}
                token={isFlipped ? 'wS' : 'S'}
                value={amount}
                onChange={handleAmountChange}
                balance="1000.00"
                onMaxClick={() => handleAmountChange('1000.00')}
              />
              
              <Box cursor="pointer" onClick={handleFlip}>
                <Image
                  src="/swap-arrows.png"
                  alt="Swap"
                  h="40px"
                  _hover={{ transform: 'rotate(180deg)' }}
                  transition="transform 0.3s"
                />
              </Box>

              <TokenInput
                label={isFlipped ? 'To (S)' : 'To (wS)'}
                token={isFlipped ? 'S' : 'wS'}
                value={amount}
                onChange={() => {}}
                balance="1000.00"
                isReadOnly
              />

              {isConnected ? (
                parseFloat(allowance) >= parseFloat(amount || '0') ? (
                  <Image
                    src="/swapnowbutton.png"
                    alt="Swap Now"
                    h="50px"
                    cursor="pointer"
                    onClick={onConfirmOpen}
                    _hover={{ transform: 'scale(1.05)' }}
                    transition="transform 0.2s"
                  />
                ) : (
                  <TokenApproval
                    token={isFlipped ? 'wS' : 'S'}
                    isApproved={parseFloat(allowance) >= parseFloat(amount || '0')}
                    isApproving={isApproving}
                    onApprove={handleApprove}
                    allowance={allowance}
                    requiredAmount={amount || '0'}
                  />
                )
              ) : null}
            </VStack>
          </Box>
        </Flex>

        {/* Footer */}
        <Flex justify="center" position="fixed" bottom="8" left="0" right="0">
          <HStack spacing={6}>
            <Image src="/X.png" alt="Twitter" h="40px" cursor="pointer" />
            <Image src="/Discord Bubble.png" alt="Discord" h="40px" cursor="pointer" />
            <Image src="/Telegram.png" alt="Telegram" h="40px" cursor="pointer" />
            <Image src="/GitHub.png" alt="GitHub" h="40px" cursor="pointer" />
          </HStack>
        </Flex>
      </Container>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        fromAmount={amount}
        toAmount={amount}
        fromToken={isFlipped ? 'wS' : 'S'}
        toToken={isFlipped ? 'S' : 'wS'}
        isLoading={isSwapping}
        onConfirm={handleSwapConfirm}
      />

      <TransactionHistory
        isOpen={isHistoryOpen}
        onClose={onHistoryClose}
        transactions={transactions}
      />
    </Box>
  )
} 