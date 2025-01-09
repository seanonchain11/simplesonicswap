import { ethers } from 'ethers'
import contractService from './contractService'

export interface PriceUpdate {
  price: string
  priceImpact: number
  estimatedGas: string
}

class PriceService {
  private listeners: ((update: PriceUpdate) => void)[] = []
  private currentFee: number = 30 // Default 0.3%

  constructor() {
    this.initializeFee()
  }

  private async initializeFee() {
    try {
      this.currentFee = await contractService.getFee()
    } catch (error) {
      console.error('Error initializing fee:', error)
    }
  }

  public subscribe(callback: (update: PriceUpdate) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  private notifyListeners(update: PriceUpdate) {
    this.listeners.forEach(listener => listener(update))
  }

  public async getPrice(amount: string, isWrap: boolean): Promise<PriceUpdate> {
    if (!amount) {
      return {
        price: '0',
        priceImpact: 0,
        estimatedGas: '0',
      }
    }

    try {
      // Get gas estimate
      const estimatedGas = await contractService.estimateGas(
        isWrap ? 'wrap' : 'unwrap',
        amount
      )

      // Calculate price with fee
      const amountNum = parseFloat(amount)
      const feeAmount = (amountNum * this.currentFee) / 10000
      const netAmount = amountNum - feeAmount

      // Calculate price impact (this would be replaced with actual pool calculations)
      const priceImpact = Math.min(amountNum * 0.001, 5) // Simplified for demo

      return {
        price: netAmount.toString(),
        priceImpact,
        estimatedGas,
      }
    } catch (error) {
      console.error('Error calculating price:', error)
      return {
        price: '0',
        priceImpact: 0,
        estimatedGas: '0',
      }
    }
  }

  public async checkAllowance(token: string, owner: string): Promise<string> {
    try {
      return await contractService.checkAllowance(owner)
    } catch (error) {
      console.error('Error checking allowance:', error)
      return '0'
    }
  }

  public async approve(token: string, amount: string): Promise<boolean> {
    try {
      const tx = await contractService.approve(amount)
      await tx.wait()
      return true
    } catch (error) {
      console.error('Error approving token:', error)
      return false
    }
  }
}

export const priceService = new PriceService()
export default priceService 