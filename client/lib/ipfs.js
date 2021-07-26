import IPFS from 'ipfs-http-client'
import axios from 'axios'

const instance = () => {
  return IPFS.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  })
}

const contentLink = (id) => `https://ipfs.io/ipfs/${id}`

const fetchContent = async (id) => {
  const res = await axios.get(contentLink(id))
  return res.data
}

export default {
  instance,
  contentLink,
  fetchContent,
}
