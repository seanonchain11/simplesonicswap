import { MaxUint256 } from 'ethers'
import contractService from './contractService'

export interface PriceUpdate {
  price: string
  priceImpact: number
  estimatedGas: string
}

type PriceUpdateCallback = (update: PriceUpdate) => void

class PriceService {
  private subscribers: PriceUpdateCallback[] = []
  private currentFee: number = 0.3 // 0.3% fee

  constructor() {
    this.initialize()
  }

  private async initialize() {
    // Fee is fixed at 0.3%
    this.currentFee = 0.3
  }

  public subscribe(callback: PriceUpdateCallback): () => void {
    this.subscribers.push(callback)
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback)
    }
  }

  public async getPrice(amount: string, isWrap: boolean): Promise<PriceUpdate> {
    if (!amount || parseFloat(amount) === 0) {
      return {
        price: '0',
        priceImpact: 0,
        estimatedGas: '0',
      }
    }

    try {
      const { totalCost } = await contractService.estimateGas(amount, isWrap)

      // Calculate price impact (fixed 0.3% fee)
      const priceImpact = 0.3

      return {
        price: amount,
        priceImpact,
        estimatedGas: totalCost,
      }
    } catch (error) {
      console.error('Error getting price:', error)
      return {
        price: '0',
        priceImpact: 0,
        estimatedGas: '0',
      }
    }
  }

  public async checkAllowance(
    token: 'S' | 'wS',
    owner: string,
    spender: string
  ): Promise<string> {
    return await contractService.getAllowance(owner, spender)
  }

  public async approve(
    token: 'S' | 'wS',
    spender: string
  ): Promise<boolean> {
    try {
      const tx = await contractService.approve(spender, MaxUint256.toString())
      const receipt = await tx.wait()
      return receipt !== null
    } catch (error) {
      console.error('Error approving token:', error)
      return false
    }
  }
}

export default new PriceService() 