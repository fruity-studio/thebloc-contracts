import '../styles/global.css'
import 'trix/dist/trix.css'
import { useEffect, useState, useRef, useMemo } from 'react'
// import etherHelper from '../lib/etherHelper'
import web3 from '../lib/web3Helper'

function MyApp({ Component, pageProps }) {
  // manage all initialization here
  const [isReady, updateIsReady] = useState(false)
  const [user, updateUser] = useState({})

  const changeHandler = (u) => updateUser(u)

  const getUser = () => {
    const updatedUser = web3.refreshUser()
    updateUser(updatedUser)
  }

  const connectWallet = async () => {
    await web3.connectWallet(changeHandler)
    getUser()
  }

  const initializeApp = async () => {
    await web3.init()
    getUser()
    updateIsReady(true)
  }

  useEffect(() => {
    initializeApp()
  }, [])

  return <Component {...pageProps} isReady={isReady} web3={web3} connectWallet={connectWallet} user={user} />
}

export default MyApp
