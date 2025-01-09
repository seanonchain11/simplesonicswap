import { ethers } from 'ethers'
import SonicTokenWrapperABI from '@/contracts/abis/SonicTokenWrapper.json'
import { monitoringService } from './monitoringService'

declare global {
  interface Window {
    ethereum?: any
  }
}

export const WSONIC_ADDRESS = '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38'
export const WRAPPER_ADDRESS = '0x' // TODO: Add deployed contract address

interface ContractCallOptions {
  gasLimit?: number
  value?: string
}

class ContractService {
  private provider: ethers.providers.Web3Provider | null = null
  private signer: ethers.Signer | null = null
  private wrapperContract: ethers.Contract | null = null
  private wSonicContract: ethers.Contract | null = null

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
      this.initializeContracts()
    }
  }

  private async initializeContracts() {
    if (!this.provider) return

    try {
      this.signer = this.provider.getSigner()
      
      // Initialize wrapper contract
      this.wrapperContract = new ethers.Contract(
        WRAPPER_ADDRESS,
        SonicTokenWrapperABI.abi,
        this.signer
      )

      // Initialize wSonic contract (ERC20)
      this.wSonicContract = new ethers.Contract(
        WSONIC_ADDRESS,
        [
          'function approve(address spender, uint256 amount) public returns (bool)',
          'function allowance(address owner, address spender) public view returns (uint256)',
          'function balanceOf(address account) public view returns (uint256)',
        ],
        this.signer
      )

      monitoringService.trackEvent('Contracts initialized', {
        wrapperAddress: WRAPPER_ADDRESS,
        wSonicAddress: WSONIC_ADDRESS,
      })
    } catch (error) {
      monitoringService.trackError(error, 'initializeContracts')
      throw error
    }
  }

  public async connect(): Promise<string> {
    if (!this.provider) throw new Error('Provider not available')

    try {
      const accounts = await this.provider.send('eth_requestAccounts', [])
      this.signer = this.provider.getSigner()
      await this.initializeContracts()
      
      monitoringService.trackEvent('Wallet connected', {
        address: accounts[0],
      })

      return accounts[0]
    } catch (error) {
      monitoringService.trackError(error, 'connect')
      throw error
    }
  }

  public async getBalances(address: string) {
    if (!this.provider || !this.wSonicContract) {
      throw new Error('Provider or contract not initialized')
    }

    try {
      const sonicBalance = await this.provider.getBalance(address)
      const wSonicBalance = await this.wSonicContract.balanceOf(address)

      monitoringService.trackEvent('Balances fetched', {
        address,
        sonic: ethers.utils.formatEther(sonicBalance),
        wSonic: ethers.utils.formatEther(wSonicBalance),
      })

      return {
        sonic: ethers.utils.formatEther(sonicBalance),
        wSonic: ethers.utils.formatEther(wSonicBalance),
      }
    } catch (error) {
      monitoringService.trackError(error, 'getBalances')
      throw error
    }
  }

  public async checkAllowance(owner: string): Promise<string> {
    if (!this.wSonicContract) throw new Error('Contract not initialized')

    try {
      const allowance = await this.wSonicContract.allowance(owner, WRAPPER_ADDRESS)
      return ethers.utils.formatEther(allowance)
    } catch (error) {
      monitoringService.trackError(error, 'checkAllowance')
      throw error
    }
  }

  public async approve(amount: string): Promise<ethers.ContractTransaction> {
    if (!this.wSonicContract) throw new Error('Contract not initialized')

    try {
      const amountWei = ethers.utils.parseEther(amount)
      const tx = await this.wSonicContract.approve(WRAPPER_ADDRESS, amountWei)
      
      monitoringService.trackTransaction(tx.hash)
      
      return tx
    } catch (error) {
      monitoringService.trackError(error, 'approve')
      throw error
    }
  }

  public async wrap(amount: string, options: ContractCallOptions = {}): Promise<ethers.ContractTransaction> {
    if (!this.wrapperContract) throw new Error('Contract not initialized')

    try {
      const amountWei = ethers.utils.parseEther(amount)
      const tx = await this.wrapperContract.wrap({
        ...options,
        value: amountWei,
      })

      monitoringService.trackTransaction(tx.hash)
      
      return tx
    } catch (error) {
      monitoringService.trackError(error, 'wrap')
      throw error
    }
  }

  public async unwrap(amount: string, options: ContractCallOptions = {}): Promise<ethers.ContractTransaction> {
    if (!this.wrapperContract) throw new Error('Contract not initialized')

    try {
      const amountWei = ethers.utils.parseEther(amount)
      const tx = await this.wrapperContract.unwrap(amountWei, options)

      monitoringService.trackTransaction(tx.hash)
      
      return tx
    } catch (error) {
      monitoringService.trackError(error, 'unwrap')
      throw error
    }
  }

  public async estimateGas(operation: 'wrap' | 'unwrap', amount: string): Promise<string> {
    if (!this.wrapperContract || !this.provider) {
      throw new Error('Contract or provider not initialized')
    }

    try {
      const amountWei = ethers.utils.parseEther(amount)
      let gasEstimate: ethers.BigNumber

      if (operation === 'wrap') {
        gasEstimate = await this.wrapperContract.estimateGas.wrap({
          value: amountWei,
        })
      } else {
        gasEstimate = await this.wrapperContract.estimateGas.unwrap(amountWei)
      }

      // Add 20% buffer for safety
      const gasWithBuffer = gasEstimate.mul(120).div(100)
      const gasPrice = await this.provider.getGasPrice()
      const gasCost = gasWithBuffer.mul(gasPrice)

      monitoringService.trackEvent('Gas estimated', {
        operation,
        amount,
        gasEstimate: gasEstimate.toString(),
        gasPrice: gasPrice.toString(),
        totalCost: ethers.utils.formatEther(gasCost),
      })

      return ethers.utils.formatEther(gasCost)
    } catch (error) {
      monitoringService.trackError(error, 'estimateGas')
      throw error
    }
  }

  public async getFee(): Promise<number> {
    if (!this.wrapperContract) throw new Error('Contract not initialized')

    try {
      const fee = await this.wrapperContract.fee()
      return fee.toNumber()
    } catch (error) {
      monitoringService.trackError(error, 'getFee')
      throw error
    }
  }

  public onAccountChange(callback: (accounts: string[]) => void) {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', callback)
      return () => window.ethereum.removeListener('accountsChanged', callback)
    }
    return () => {}
  }

  public onChainChange(callback: (chainId: string) => void) {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', callback)
      return () => window.ethereum.removeListener('chainChanged', callback)
    }
    return () => {}
  }
}

export const contractService = new ContractService()
export default contractService 