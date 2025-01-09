import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionAlert = motion(Alert)

interface PriceImpactWarningProps {
  priceImpact: number
}

export default function PriceImpactWarning({ priceImpact }: PriceImpactWarningProps) {
  if (priceImpact < 1) return null

  const getWarningProps = () => {
    if (priceImpact >= 5) {
      return {
        status: 'error' as const,
        title: 'High Price Impact',
        description: 'This trade will significantly affect the market price.',
      }
    }
    if (priceImpact >= 3) {
      return {
        status: 'warning' as const,
        title: 'Medium Price Impact',
        description: 'This trade will moderately affect the market price.',
      }
    }
    return {
      status: 'info' as const,
      title: 'Low Price Impact',
      description: 'This trade will slightly affect the market price.',
    }
  }

  const { status, title, description } = getWarningProps()

  return (
    <Box w="full">
      <MotionAlert
        status={status}
        variant="subtle"
        borderRadius="xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        <AlertIcon />
        <Box>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription fontSize="sm">
            {description}
            <br />
            Price Impact: {priceImpact.toFixed(2)}%
          </AlertDescription>
        </Box>
      </MotionAlert>
    </Box>
  )
} 