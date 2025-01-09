import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaClock, FaExternalLinkAlt, FaTimesCircle } from 'react-icons/fa'

const MotionBox = motion(Box)

interface Transaction {
  id: string
  type: 'wrap' | 'unwrap'
  amount: string
  status: 'pending' | 'completed' | 'failed'
  timestamp: number
  hash: string
}

interface TransactionHistoryProps {
  isOpen: boolean
  onClose: () => void
  transactions: Transaction[]
}

export default function TransactionHistory({
  isOpen,
  onClose,
  transactions,
}: TransactionHistoryProps) {
  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Icon as={FaCheckCircle} color="green.400" />
      case 'failed':
        return <Icon as={FaTimesCircle} color="red.400" />
      default:
        return <Icon as={FaClock} color="yellow.400" />
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent bg="brand.background">
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
          Recent Transactions
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={4} align="stretch">
            {transactions.length === 0 ? (
              <Text color="brand.text.secondary" textAlign="center" py={8}>
                No transactions yet
              </Text>
            ) : (
              transactions.map((tx) => (
                <MotionBox
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  p={4}
                  bg="whiteAlpha.100"
                  borderRadius="xl"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <HStack>
                        {getStatusIcon(tx.status)}
                        <Text fontWeight="bold" textTransform="capitalize">
                          {tx.type}
                        </Text>
                      </HStack>
                      <Text color="brand.text.secondary" fontSize="sm">
                        {formatTimestamp(tx.timestamp)}
                      </Text>
                    </HStack>
                    
                    <HStack justify="space-between">
                      <Text>{tx.amount} {tx.type === 'wrap' ? 'S → wS' : 'wS → S'}</Text>
                      <Link
                        href={`https://explorer.sonic.com/tx/${tx.hash}`}
                        isExternal
                        color="brand.primary"
                        fontSize="sm"
                      >
                        View <Icon as={FaExternalLinkAlt} ml={1} />
                      </Link>
                    </HStack>
                  </VStack>
                </MotionBox>
              ))
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
} 