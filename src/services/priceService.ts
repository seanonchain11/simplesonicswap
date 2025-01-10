import contractService from './contractService'
import { formatEther, parseEther } from 'ethers'

export interface PriceUpdate {
  price: string
  priceImpact: number
  estimatedGas: string
}

class PriceService {
  private subscribers: ((update: PriceUpdate) => void)[] = []

  public subscribe(callback: (update: PriceUpdate) => void): () => void {
    this.subscribers.push(callback)
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback)
    }
  }

  private notify(update: PriceUpdate): void {
    this.subscribers.forEach((callback) => callback(update))
  }

  public async getPrice(
    amountIn: string,
    isFromSonic: boolean
  ): Promise<PriceUpdate> {
    if (!amountIn || parseFloat(amountIn) === 0) {
      return {
        price: '0',
        priceImpact: 0,
        estimatedGas: '0',
      }
    }

    try {
      const fromToken = isFromSonic ? 'S' : 'wS'
      const toToken = isFromSonic ? 'wS' : 'S'

      const amountOut = await contractService.getAmountOut(amountIn, fromToken, toToken)
      const { totalCost: estimatedGas } = await contractService.estimateGas(
        amountIn,
        fromToken,
        toToken,
        await contractService.getSigner().getAddress()
      )

      // Calculate price impact (simplified for 1:1 swap)
      const priceImpact = Math.abs(
        ((parseFloat(amountOut) - parseFloat(amountIn)) / parseFloat(amountIn)) * 100
      )

      const update = {
        price: amountOut,
        priceImpact,
        estimatedGas,
      }

      this.notify(update)
      return update
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
    tokenType: 'S' | 'wS',
    owner: string,
    spender: string
  ): Promise<string> {
    return await contractService.getAllowance(owner, spender, tokenType)
  }

  public async approve(
    tokenType: 'S' | 'wS',
    spender: string
  ): Promise<boolean> {
    try {
      const tx = await contractService.approve(spender, '115792089237316195423570985008687907853269984665640564039457584007913129639935', tokenType)
      await tx.wait()
      return true
    } catch (error) {
      console.error('Error approving token:', error)
      return false
    }
  }

  public async getBalance(tokenType: 'S' | 'wS', address: string): Promise<string> {
    const balances = await contractService.getBalances(address)
    return tokenType === 'S' ? balances.sonic : balances.wSonic
  }
}

export default new PriceService() 