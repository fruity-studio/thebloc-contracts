import IPFS from 'ipfs-http-client'
import axios from 'axios'

const instance = () => {
  const projectId = '1vKerJ4TyC6fHDMTYQSY2AWKltt'
  const projectSecret = '75aa84fcc71f5c905ba52d30ff008069'
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

  return IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
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
