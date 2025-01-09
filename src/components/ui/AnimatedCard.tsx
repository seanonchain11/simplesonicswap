import { Box, BoxProps } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

interface AnimatedCardProps extends BoxProps {
  delay?: number
}

export default function AnimatedCard({ children, delay = 0, ...props }: AnimatedCardProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      bg="brand.card"
      borderRadius="2xl"
      p={6}
      boxShadow="xl"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '2xl',
        transition: 'all 0.2s',
      }}
      {...props}
    >
      {children}
    </MotionBox>
  )
} 