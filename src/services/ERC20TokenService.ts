import { ethers } from 'ethers'
import IERC20 from '../abi/IERC20.json'

class ERC20TokenService {
  static instances: Record<string, ERC20TokenService> = {}

  address: string

  contract: any

  initiated: Promise<ERC20TokenService>

  constructor(provider: any, address: string) {
    if (!address) {
      throw new Error('Address of ERC20 token not provided for constructor')
    }

    this.address = address

    this.initiated = new Promise((resolve, reject) => {
      this.contract = new ethers.Contract(address, IERC20, provider)
      const signer: any = provider.getSigner()

      if (signer) {
        this.contract.connect(signer)
      }

      resolve(this)
    })
  }

  async ready(): Promise<ERC20TokenService> {
    return this.initiated
  }

  static async getInstance(
    provider: any,
    address: string,
  ): Promise<ERC20TokenService> {
    const lowerCase = address.toLocaleLowerCase()
    if (!ERC20TokenService.instances[lowerCase]) {
      ERC20TokenService.instances[lowerCase] = new ERC20TokenService(
        provider,
        lowerCase,
      )
    }
    return ERC20TokenService.instances[lowerCase].ready()
  }

  async balanceOf(address: string) {
    await this.ready()
    return this.contract.balanceOf(address)
  }
}

export default ERC20TokenService
