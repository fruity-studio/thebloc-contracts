import { ethers } from 'ethers'
import BlogArtifact from './contracts/Blog.json'

// const bscProvider = 'https://data-seed-prebsc-1-s1.binance.org:8545'
const bscProvider = null
const localProvider = 'http://localhost:7545'

class etherHelper {
  provider = null
  signer = null
  contract = null
  account = null
  userConnected = false

  connectWallet = async () => {
    if (window.ethereum) {
      // use MetaMask's provider
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      if (accounts.length > 0) {
        this.provider = new ethers.providers.Web3Provider(window.ethereum)
        this.account = accounts[0]
        this.userConnected = true
        this.signer = this.provider.getSigner()
        // setup contract with new provider and all
        await this.setupContract()
      } else {
        console.log(`Not connected`)
      }
    } else {
      console.log(`No browser wallet installed`)
    }
  }

  setupContract = async () => {
    const network = await this.provider.getNetwork()
    const { chainId } = network
    const deployedNetwork = BlogArtifact.networks[chainId]

    console.log({ network })

    if (deployedNetwork) {
      this.contract = new ethers.Contract(deployedNetwork.address, BlogArtifact.abi, this.signer || this.provider)
    } else {
      console.log(`Network not properly deployed`)
    }
  }

  init = async () => {
    this.provider = bscProvider
      ? new ethers.providers.JsonRpcProvider(bscProvider)
      : ethers.providers.getDefaultProvider(localProvider)

    this.userConnected = false
    await this.setupContract()

    return true
  }
}

export default new etherHelper()
