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
  private rayidumRouter: Contract | null = null
  private sonicContract: Contract | null = null
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

  public getSigner(): JsonRpcSigner {
    if (!this.signer) {
      throw new Error('Signer not initialized. Please connect first.')
    }
    return this.signer
  }

  private async initializeContracts(): Promise<void> {
    if (!this.signer) throw new Error('No signer available')

    const rayidumRouterAddress = process.env.NEXT_PUBLIC_RAYIDUM_ROUTER
    const sonicAddress = process.env.NEXT_PUBLIC_SONIC_ADDRESS
    const wSonicAddress = process.env.NEXT_PUBLIC_WSONIC_ADDRESS

    if (!rayidumRouterAddress || rayidumRouterAddress.trim() === '') {
      throw new Error('Rayidum router address not configured')
    }

    if (!sonicAddress || sonicAddress.trim() === '') {
      throw new Error('Sonic token address not configured')
    }

    if (!wSonicAddress || wSonicAddress.trim() === '') {
      throw new Error('wSonic token address not configured')
    }

    // Initialize Rayidum router contract
    this.rayidumRouter = new Contract(
      rayidumRouterAddress,
      [
        'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) returns (uint256[] memory amounts)',
        'function getAmountsOut(uint256 amountIn, address[] calldata path) view returns (uint256[] memory amounts)',
        'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) returns (uint256[] memory amounts)',
      ],
      this.signer
    )

    // Initialize Sonic token contract
    this.sonicContract = new Contract(
      sonicAddress,
      [
        'function approve(address spender, uint256 amount) returns (bool)',
        'function allowance(address owner, address spender) view returns (uint256)',
        'function balanceOf(address account) view returns (uint256)',
        'function transfer(address to, uint256 amount) returns (bool)',
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
    if (!this.rayidumRouter || !this.sonicContract || !this.wSonicContract) {
      throw new Error('Failed to initialize contracts')
    }
  }

  public async getBalances(address: string): Promise<BalanceResponse> {
    if (!this.sonicContract || !this.wSonicContract) {
      throw new Error('Contracts not initialized')
    }

    const [sonicBalance, wSonicBalance] = await Promise.all([
      this.sonicContract.balanceOf(address),
      this.wSonicContract.balanceOf(address),
    ])

    return {
      sonic: formatEther(sonicBalance),
      wSonic: formatEther(wSonicBalance),
    }
  }

  public async getAllowance(owner: string, spender: string, tokenType: 'S' | 'wS'): Promise<string> {
    const contract = tokenType === 'S' ? this.sonicContract : this.wSonicContract
    if (!contract) throw new Error('Contract not initialized')

    const allowance = await contract.allowance(owner, spender)
    return formatEther(allowance)
  }

  public async approve(
    spender: string,
    amount: string,
    tokenType: 'S' | 'wS'
  ): Promise<ContractTransactionResponse> {
    const contract = tokenType === 'S' ? this.sonicContract : this.wSonicContract
    if (!contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const amountWei = parseEther(amount)
      const tx = await contract.approve(spender, amountWei, {
        gasLimit: 100000 // Add explicit gas limit
      })
      return tx
    } catch (error) {
      console.error('Error in approve:', error)
      throw error
    }
  }

  public async swap(
    amountIn: string,
    amountOutMin: string,
    fromToken: 'S' | 'wS',
    toToken: 'S' | 'wS',
    to: string,
    options: ContractCallOptions = {}
  ): Promise<ContractTransactionResponse> {
    if (!this.rayidumRouter || !this.sonicContract || !this.wSonicContract) {
      throw new Error('Contracts not initialized')
    }

    const path = [
      fromToken === 'S' ? process.env.NEXT_PUBLIC_SONIC_ADDRESS! : process.env.NEXT_PUBLIC_WSONIC_ADDRESS!,
      toToken === 'S' ? process.env.NEXT_PUBLIC_SONIC_ADDRESS! : process.env.NEXT_PUBLIC_WSONIC_ADDRESS!,
    ]

    const amountInWei = parseEther(amountIn)
    const amountOutMinWei = parseEther(amountOutMin)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from now

    // Use swapExactTokensForTokensSupportingFeeOnTransferTokens for better compatibility
    return await this.rayidumRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
      amountInWei,
      amountOutMinWei,
      path,
      to,
      deadline,
      {
        gasLimit: options.gasLimit || 300000,
        ...options,
      }
    )
  }

  public async getAmountOut(
    amountIn: string,
    fromToken: 'S' | 'wS',
    toToken: 'S' | 'wS'
  ): Promise<string> {
    if (!this.rayidumRouter) throw new Error('Router not initialized')

    const path = [
      fromToken === 'S' ? process.env.NEXT_PUBLIC_SONIC_ADDRESS! : process.env.NEXT_PUBLIC_WSONIC_ADDRESS!,
      toToken === 'S' ? process.env.NEXT_PUBLIC_SONIC_ADDRESS! : process.env.NEXT_PUBLIC_WSONIC_ADDRESS!,
    ]

    const amountInWei = parseEther(amountIn)
    const amounts = await this.rayidumRouter.getAmountsOut(amountInWei, path)
    return formatEther(amounts[1])
  }

  public async estimateGas(
    amountIn: string,
    fromToken: 'S' | 'wS',
    toToken: 'S' | 'wS',
    to: string
  ): Promise<{ gasEstimate: bigint; totalCost: string }> {
    if (!this.rayidumRouter || !this.provider)
      throw new Error('Contract not initialized')

    const path = [
      fromToken === 'S' ? process.env.NEXT_PUBLIC_SONIC_ADDRESS! : process.env.NEXT_PUBLIC_WSONIC_ADDRESS!,
      toToken === 'S' ? process.env.NEXT_PUBLIC_SONIC_ADDRESS! : process.env.NEXT_PUBLIC_WSONIC_ADDRESS!,
    ]

    const amountInWei = parseEther(amountIn)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20

    const gasEstimate = await this.rayidumRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens.estimateGas(
      amountInWei,
      0, // amountOutMin = 0 for estimation
      path,
      to,
      deadline
    )

    const gasPrice = await this.provider.getFeeData()
    const gasCost = gasEstimate * (gasPrice.gasPrice || BigInt(0))

    return {
      gasEstimate,
      totalCost: formatEther(gasCost),
    }
  }
}

export default new ContractService() 