import {
  Contract,
  BrowserProvider,
  JsonRpcSigner,
  formatEther,
  parseEther,
  type ContractTransactionResponse,
  type TransactionReceipt,
} from 'ethers'

interface ContractCallOptions {
  gasLimit?: number
  gasPrice?: string
}

interface BalanceResponse {
  sonic: string
  wSonic: string
}

class ContractService {
  private provider: BrowserProvider | null = null
  private signer: JsonRpcSigner | null = null
  private wrapperContract: Contract | null = null
  private wSonicContract: Contract | null = null

  public async connect(): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('No ethereum provider found')
      }

      // Check if we're on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      if (chainId !== '0x92') { // Chain ID 146 in hex
        throw new Error('Please connect to Sonic Network')
      }

      this.provider = new BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()

      // Initialize contracts
      await this.initializeContracts()
    } catch (error) {
      console.error('Connection error:', error)
      throw error
    }
  }

  private async initializeContracts(): Promise<void> {
    if (!this.signer) throw new Error('No signer available')

    const wrapperAddress = process.env.NEXT_PUBLIC_WRAPPER_ADDRESS
    const wSonicAddress = process.env.NEXT_PUBLIC_WSONIC_ADDRESS

    if (!wrapperAddress || wrapperAddress.trim() === '') {
      throw new Error('Wrapper contract address not configured')
    }

    if (!wSonicAddress || wSonicAddress.trim() === '') {
      throw new Error('wSonic contract address not configured')
    }

    // Initialize wrapper contract
    this.wrapperContract = new Contract(
      wrapperAddress,
      [
        'function wrap() payable',
        'function unwrap(uint256 amount)',
        'function balanceOf(address account) view returns (uint256)',
      ],
      this.signer
    )

    // Initialize wSonic contract
    this.wSonicContract = new Contract(
      wSonicAddress,
      [
        'function approve(address spender, uint256 amount) returns (bool)',
        'function allowance(address owner, address spender) view returns (uint256)',
        'function balanceOf(address account) view returns (uint256)',
        'function transfer(address to, uint256 amount) returns (bool)',
      ],
      this.signer
    )

    // Validate contracts are properly initialized
    if (!this.wrapperContract || !this.wSonicContract) {
      throw new Error('Failed to initialize contracts')
    }
  }

  public async getBalances(address: string): Promise<BalanceResponse> {
    if (!this.provider || !this.wSonicContract) {
      throw new Error('Provider or contracts not initialized')
    }

    const [sonicBalance, wSonicBalance] = await Promise.all([
      this.provider.getBalance(address),
      this.wSonicContract.balanceOf(address),
    ])

    return {
      sonic: formatEther(sonicBalance),
      wSonic: formatEther(wSonicBalance),
    }
  }

  public async getAllowance(owner: string, spender: string): Promise<string> {
    if (!this.wSonicContract) throw new Error('Contract not initialized')

    const allowance = await this.wSonicContract.allowance(owner, spender)
    return formatEther(allowance)
  }

  public async approve(
    spender: string,
    amount: string
  ): Promise<ContractTransactionResponse> {
    if (!this.wSonicContract) {
      throw new Error('Contract not initialized')
    }

    try {
      const amountWei = parseEther(amount)
      const tx = await this.wSonicContract.approve(spender, amountWei, {
        gasLimit: 100000 // Add explicit gas limit
      })
      return tx
    } catch (error) {
      console.error('Error in approve:', error)
      throw error
    }
  }

  public async wrap(
    amount: string,
    options: ContractCallOptions = {}
  ): Promise<ContractTransactionResponse> {
    if (!this.wrapperContract) throw new Error('Contract not initialized')

    const amountWei = parseEther(amount)
    return await this.wrapperContract.wrap({
      value: amountWei,
      ...options,
    })
  }

  public async unwrap(
    amount: string,
    options: ContractCallOptions = {}
  ): Promise<ContractTransactionResponse> {
    if (!this.wrapperContract) throw new Error('Contract not initialized')

    const amountWei = parseEther(amount)
    return await this.wrapperContract.unwrap(amountWei, {
      ...options,
    })
  }

  public async estimateGas(
    amount: string,
    isWrap: boolean
  ): Promise<{ gasEstimate: bigint; totalCost: string }> {
    if (!this.wrapperContract || !this.provider)
      throw new Error('Contract not initialized')

    const amountWei = parseEther(amount)
    let gasEstimate: bigint

    if (isWrap) {
      gasEstimate = await this.wrapperContract.wrap.estimateGas({
        value: amountWei,
      })
    } else {
      gasEstimate = await this.wrapperContract.unwrap.estimateGas(amountWei)
    }

    const gasPrice = await this.provider.getFeeData()
    const gasCost = gasEstimate * (gasPrice.gasPrice || BigInt(0))

    return {
      gasEstimate,
      totalCost: formatEther(gasCost),
    }
  }
}

export default new ContractService() 