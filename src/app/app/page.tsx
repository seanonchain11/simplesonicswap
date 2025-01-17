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
  Button,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import TokenInput from '@/components/swap/TokenInput'
import ConfirmationModal from '@/components/swap/ConfirmationModal'
import TransactionHistory from '@/components/swap/TransactionHistory'
import TokenApproval from '@/components/swap/TokenApproval'
import priceService, { PriceUpdate } from '@/services/priceService'
import contractService from '@/services/contractService'

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
  const [sonicBalance, setSonicBalance] = useState('0')
  const [wrappedSonicBalance, setWrappedSonicBalance] = useState('0')
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
    if (account) {
      checkAllowance()
      fetchBalances()
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
      account,
      process.env.NEXT_PUBLIC_RAYIDUM_ROUTER || ''
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
      // Connect to contract first
      await contractService.connect()
      
      const success = await priceService.approve(
        isFlipped ? 'wS' : 'S',
        process.env.NEXT_PUBLIC_RAYIDUM_ROUTER || ''
      )
      if (success) {
        toast({
          title: 'Approval Successful',
          description: 'You can now proceed with the swap.',
          status: 'success',
          duration: 5000,
        })
        await checkAllowance()
        await fetchBalances() // Refresh balances after approval
      }
    } catch (error) {
      console.error('Error approving token:', error)
      toast({
        title: 'Approval Failed',
        description: error instanceof Error 
          ? error.message
          : typeof error === 'object' && error && 'message' in error
          ? String(error.message)
          : 'Failed to approve token spending. Please make sure you are connected to Sonic Network.',
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
        
        // Connect to contracts
        await contractService.connect()
        
        setAccount(accounts[0])
        setIsConnected(true)
        
        // Fetch initial balances
        await fetchBalances()
        
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
        description: error instanceof Error 
          ? error.message
          : typeof error === 'object' && error && 'message' in error
          ? String(error.message)
          : 'Failed to connect. Please make sure you are using MetaMask and connected to Sonic Network.',
        status: 'error',
        duration: 5000,
      })
      setIsConnected(false)
      setAccount('')
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
  }

  const handleSwapConfirm = async () => {
    setIsSwapping(true)
    try {
      const tx = await contractService.swap(
        amount,
        priceInfo.price, // Use the estimated output amount as minimum
        isFlipped ? 'wS' : 'S',
        isFlipped ? 'S' : 'wS',
        account,
        { gasLimit: 300000 }
      )
      
      const newTx: Transaction = {
        id: tx.hash,
        type: isFlipped ? 'unwrap' : 'wrap',
        amount,
        status: 'pending',
        timestamp: Date.now(),
        hash: tx.hash,
      }
      
      setTransactions([newTx, ...transactions])
      
      const receipt = await tx.wait()
      if (!receipt) {
        throw new Error('Transaction failed')
      }
      
      setTransactions(prev =>
        prev.map(tx =>
          tx.id === receipt.hash ? { ...tx, status: 'completed' } : tx
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
      await fetchBalances() // Refresh balances after swap
    } catch (error) {
      console.error('Error during swap:', error)
      toast({
        title: 'Swap Failed',
        description: error instanceof Error 
          ? error.message
          : typeof error === 'object' && error && 'message' in error
          ? String(error.message)
          : 'An error occurred during the swap.',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsSwapping(false)
    }
  }

  const fetchBalances = async () => {
    if (!account) return
    try {
      const sBalance = await priceService.getBalance('S', account)
      const wsBalance = await priceService.getBalance('wS', account)
      setSonicBalance(sBalance)
      setWrappedSonicBalance(wsBalance)
    } catch (error) {
      console.error('Error fetching balances:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch token balances.',
        status: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <Box
      minH="100vh"
      position="relative"
      bg="radial-gradient(circle at center, #0E0E0E 20%, #0E0E0E 100%)"
      color="white"
      overflow="hidden"
    >
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={12}>
          <Image
            src="/logo.svg"
            alt="SimpleSonicSwap Logo"
            width={201.7}
            height={40}
            style={{ objectFit: 'contain' }}
          />
          {isConnected ? (
            <Button
              bg="rgba(255, 255, 255, 0.1)"
              color="white"
              px={6}
              py={6}
              borderRadius="full"
              display="flex"
              alignItems="center"
              gap={3}
              _hover={{
                bg: "rgba(255, 255, 255, 0.15)",
              }}
            >
              <Image
                src="/metamask-logo.svg"
                alt="MetaMask"
                width="24px"
                height="24px"
              />
              {account.slice(0, 6)}...{account.slice(-4)}
            </Button>
          ) : (
            <Button
              bg="linear-gradient(90deg, #F7931A 0%, #5B3BE8 100%)"
              color="white"
              px={8}
              py={6}
              borderRadius="full"
              onClick={connectWallet}
              _hover={{
                transform: 'scale(1.05)',
                bg: 'linear-gradient(90deg, #E68219 0%, #4A30D7 100%)',
              }}
              transition="all 0.2s"
            >
              Connect Wallet
            </Button>
          )}
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
                balance={isConnected ? (isFlipped ? wrappedSonicBalance : sonicBalance) : '-'}
                onMaxClick={isConnected ? () => handleAmountChange(isFlipped ? wrappedSonicBalance : sonicBalance) : undefined}
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
                balance={isConnected ? (isFlipped ? sonicBalance : wrappedSonicBalance) : '-'}
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