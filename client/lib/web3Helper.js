import Web3 from 'web3'
import BlogArtifact from './contracts/Blog.json'

const customProviderUrl = 'http://127.0.0.1:7545'

const utils = {
  notEmptyBytes32: (value) => value !== '0x0000000000000000000000000000000000000000000000000000000000000000',
}

class web3Helpers {
  web3 = null
  contract = null
  account = null
  userConnected = false

  // utils
  utils = utils

  refreshUser = () => {
    return { connected: this.userConnected, account: this.account }
  }

  connectWallet = async (handler) => {
    // use MetaMask's provider
    this.web3 = new Web3(ethereum)
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    this.account = accounts[0]
    this.userConnected = true

    await this.setupContract()

    ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length < 1) {
        this.userConnected = false
        this.account = null
      } else {
        this.account = accounts[0]
        this.userConnected = true
      }
      handler && handler(this.refreshUser())
    })
  }

  setupContract = async () => {
    const networkId = await this.web3.eth.net.getId()
    const deployedNetwork = BlogArtifact.networks[networkId]
    this.contract = new this.web3.eth.Contract(BlogArtifact.abi, deployedNetwork.address)
  }

  init = async () => {
    // console.warn('No web3 detected. Falling back to Ganache: http://127.0.0.1:7545')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    this.web3 = new Web3(new Web3.providers.HttpProvider(customProviderUrl))
    this.userConnected = false
    await this.setupContract()
  }

  getReturnValue = async (v) => {
    const [eventName] = Object.keys(v.events)
    return eventName ? v.events[eventName].returnValues : {}
  }

  contractActionsFactory = async (name, params = [], send = true) => {
    const { methods } = this.contract
    const [from] = await this.web3.eth.getAccounts()
    const handler = params ? methods[name](...params) : methods[name]()

    return await handler[send ? 'send' : 'call']({ from })
  }

  callContract = async (name, params = []) => this.contractActionsFactory(name, params, false)
  sendContract = async (name, params = []) => this.contractActionsFactory(name, params, true)

  // posts
  loadPosts = async (start) => {
    try {
      const res = await this.callContract('fetchPaginatedPosts', [start])
      const postsId = res.filter(this.utils.notEmptyBytes32)
      return await Promise.all(postsId.map((id) => this.callContract('getPost', [id])))
    } catch (error) {
      console.log(error)
      return []
    }
  }

  createPost = async (params) => {
    const res = await this.sendContract('createNewPost', params)
    return await this.getReturnValue(res)
  }

  getPostWithSlug = async (params) => {
    return await this.callContract('getPostBySlug', params)
  }
}

export default new web3Helpers()
