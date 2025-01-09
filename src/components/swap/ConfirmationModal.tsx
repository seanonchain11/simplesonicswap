import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  HStack,
  Image,
  Divider,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionModalContent = motion(ModalContent)

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  fromAmount: string
  toAmount: string
  fromToken: 'S' | 'wS'
  toToken: 'S' | 'wS'
  isLoading?: boolean
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  fromAmount,
  toAmount,
  fromToken,
  toToken,
  isLoading,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <MotionModalContent
        bg="brand.background"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <ModalHeader borderBottom="1px solid" borderColor="whiteAlpha.200">
          Confirm Swap
        </ModalHeader>
        
        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* From Token */}
            <HStack justify="space-between">
              <HStack spacing={3}>
                <Image
                  src={`/tokens/${fromToken.toLowerCase()}.svg`}
                  alt={fromToken}
                  boxSize="32px"
                />
                <Text fontSize="lg" fontWeight="bold">
                  {fromAmount} {fromToken}
                </Text>
              </HStack>
              <Text color="brand.text.secondary">From</Text>
            </HStack>

            {/* Arrow */}
            <HStack justify="center">
              <motion.div
                animate={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <Text fontSize="xl" color="brand.text.secondary">↓</Text>
              </motion.div>
            </HStack>

            {/* To Token */}
            <HStack justify="space-between">
              <HStack spacing={3}>
                <Image
                  src={`/tokens/${toToken.toLowerCase()}.svg`}
                  alt={toToken}
                  boxSize="32px"
                />
                <Text fontSize="lg" fontWeight="bold">
                  {toAmount} {toToken}
                </Text>
              </HStack>
              <Text color="brand.text.secondary">To</Text>
            </HStack>

            <Divider borderColor="whiteAlpha.200" />

            {/* Fee Information */}
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text color="brand.text.secondary">Swap Fee</Text>
                <Text>0.3%</Text>
              </HStack>
              <HStack justify="space-between">
                <Text color="brand.text.secondary">Network Fee</Text>
                <Text>~0.001 S</Text>
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="whiteAlpha.200">
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Confirming"
            as={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Confirm Swap
          </Button>
        </ModalFooter>
      </MotionModalContent>
    </Modal>
  )
} 