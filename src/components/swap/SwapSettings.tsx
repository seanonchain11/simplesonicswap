import {
  Button,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Text,
  VStack,
  ButtonGroup,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaCog } from 'react-icons/fa'

const MotionIconButton = motion(IconButton)

interface SwapSettingsProps {
  slippage: string
  setSlippage: (value: string) => void
  deadline: string
  setDeadline: (value: string) => void
}

const SLIPPAGE_PRESETS = ['0.1', '0.5', '1.0']

export default function SwapSettings({
  slippage,
  setSlippage,
  deadline,
  setDeadline,
}: SwapSettingsProps) {
  const handleSlippageChange = (value: string) => {
    // Validate input to ensure it's a valid number between 0 and 100
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return
    setSlippage(value)
  }

  const handleDeadlineChange = (value: string) => {
    // Validate input to ensure it's a valid number
    const numValue = parseInt(value)
    if (isNaN(numValue) || numValue < 1) return
    setDeadline(value)
  }

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <MotionIconButton
          icon={<FaCog />}
          aria-label="Settings"
          variant="ghost"
          size="md"
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.2 }}
        />
      </PopoverTrigger>
      <PopoverContent
        bg="brand.background"
        borderColor="whiteAlpha.200"
        _focus={{ boxShadow: 'none' }}
      >
        <PopoverHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
          Transaction Settings
        </PopoverHeader>
        <PopoverBody>
          <VStack spacing={4} align="stretch">
            <VStack align="start" spacing={2}>
              <Text color="brand.text.secondary" fontSize="sm">
                Slippage Tolerance
              </Text>
              <HStack spacing={2} w="full">
                <ButtonGroup size="sm" isAttached variant="outline">
                  {SLIPPAGE_PRESETS.map((preset) => (
                    <Button
                      key={preset}
                      onClick={() => setSlippage(preset)}
                      variant={slippage === preset ? 'solid' : 'outline'}
                      borderColor="whiteAlpha.400"
                      _hover={{ bg: 'whiteAlpha.100' }}
                    >
                      {preset}%
                    </Button>
                  ))}
                </ButtonGroup>
                <Input
                  size="sm"
                  value={slippage}
                  onChange={(e) => handleSlippageChange(e.target.value)}
                  placeholder="Custom"
                  w="80px"
                  textAlign="right"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                />
                <Text>%</Text>
              </HStack>
              {parseFloat(slippage) > 5 && (
                <Text color="red.400" fontSize="sm">
                  High slippage tolerance may result in unfavorable rates
                </Text>
              )}
            </VStack>

            <VStack align="start" spacing={2}>
              <Text color="brand.text.secondary" fontSize="sm">
                Transaction Deadline
              </Text>
              <HStack spacing={2}>
                <Input
                  size="sm"
                  value={deadline}
                  onChange={(e) => handleDeadlineChange(e.target.value)}
                  placeholder="30"
                  w="80px"
                  textAlign="right"
                  type="number"
                  min="1"
                />
                <Text>minutes</Text>
              </HStack>
            </VStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
} 