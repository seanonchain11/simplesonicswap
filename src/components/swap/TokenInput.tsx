import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Image,
  HStack,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionFlex = motion(Flex)

interface TokenInputProps {
  label: string
  value: string
  onChange?: (value: string) => void
  balance?: string
  token: 'S' | 'wS'
  isReadOnly?: boolean
  onMaxClick?: () => void
}

export default function TokenInput({
  label,
  value,
  onChange,
  balance,
  token,
  isReadOnly,
  onMaxClick,
}: TokenInputProps) {
  return (
    <MotionFlex
      direction="column"
      gap={2}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Flex justify="space-between" align="center">
        <Text color="brand.text.secondary">{label}</Text>
        {balance && (
          <HStack spacing={2}>
            <Text color="brand.text.secondary">Balance:</Text>
            <Text color="brand.text.primary">{balance}</Text>
            {onMaxClick && (
              <Button
                size="xs"
                variant="ghost"
                color="brand.primary"
                _hover={{ color: 'brand.secondary' }}
                onClick={onMaxClick}
              >
                MAX
              </Button>
            )}
          </HStack>
        )}
      </Flex>

      <Flex
        bg="brand.card"
        p={4}
        borderRadius="xl"
        align="center"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'xl',
          padding: '1px',
          background: 'linear-gradient(to right, brand.primary, brand.secondary)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        }}
      >
        <Input
          flex={1}
          variant="unstyled"
          placeholder="0.0"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          isReadOnly={isReadOnly}
          fontSize="2xl"
          fontWeight="bold"
        />
        <HStack spacing={2} pl={4}>
          <Box
            as={motion.div}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={`/tokens/${token.toLowerCase()}.svg`}
              alt={token}
              boxSize="24px"
            />
          </Box>
          <Text fontWeight="bold">{token}</Text>
        </HStack>
      </Flex>
    </MotionFlex>
  )
} 