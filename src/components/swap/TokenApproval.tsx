import {
  Box,
  Button,
  Progress,
  Text,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck, FaLock, FaUnlock } from 'react-icons/fa'

const MotionBox = motion(Box)

interface TokenApprovalProps {
  token: 'S' | 'wS'
  isApproved: boolean
  isApproving: boolean
  onApprove: () => void
  allowance: string
  requiredAmount: string
}

export default function TokenApproval({
  token,
  isApproved,
  isApproving,
  onApprove,
  allowance,
  requiredAmount,
}: TokenApprovalProps) {
  const getAllowancePercentage = () => {
    const allowanceNum = parseFloat(allowance)
    const requiredNum = parseFloat(requiredAmount)
    if (isNaN(allowanceNum) || isNaN(requiredNum) || requiredNum === 0) return 0
    return Math.min((allowanceNum / requiredNum) * 100, 100)
  }

  return (
    <AnimatePresence mode="wait">
      {!isApproved && (
        <MotionBox
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          overflow="hidden"
          w="full"
        >
          <VStack
            spacing={3}
            p={4}
            bg="whiteAlpha.100"
            borderRadius="xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <HStack spacing={2} w="full">
              <Icon
                as={isApproved ? FaUnlock : FaLock}
                color={isApproved ? 'green.400' : 'yellow.400'}
              />
              <Text flex={1}>
                {isApproved
                  ? `${token} token approved`
                  : `Approve ${token} token for trading`}
              </Text>
              {isApproved && <Icon as={FaCheck} color="green.400" />}
            </HStack>

            {!isApproved && (
              <>
                <Progress
                  value={getAllowancePercentage()}
                  w="full"
                  borderRadius="full"
                  size="sm"
                  colorScheme={getAllowancePercentage() === 100 ? 'green' : 'yellow'}
                />

                <Button
                  w="full"
                  variant="gradient"
                  onClick={onApprove}
                  isLoading={isApproving}
                  loadingText="Approving"
                  as={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Approve {token}
                </Button>

                <Text fontSize="sm" color="brand.text.secondary">
                  You must approve the smart contract to spend your {token} tokens
                </Text>
              </>
            )}
          </VStack>
        </MotionBox>
      )}
    </AnimatePresence>
  )
} 