import IPFS from 'ipfs-http-client'
import axios from 'axios'

const instance = () => IPFS.create(process.env.NEXT_IPFS)

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
