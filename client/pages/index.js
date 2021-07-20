import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, VariableView, NewPostModal, Logo } from '../components'
import ipfs from '../lib/ipfs'

export default function Home({ web3, isReady, user, connectWallet }) {
  const [loading, updateLoading] = useState(true)
  const [newPost, updateNewPost] = useState(false)
  const [posts, updatePosts] = useState([])

  const loadPosts = async () => {
    try {
      const allPosts = await web3.loadPosts(0)
      updateLoading(false)
      updatePosts(allPosts)
    } catch (error) {
      console.log(error)
      updateLoading(false)
    }
  }

  const renderPosts = () => {
    if (posts.length < 1) {
      return (
        <VariableView className="flex items-center justify-center">
          <span className="text-gray-500">No Posts Here Yet.</span>
        </VariableView>
      )
    } else {
      return (
        <div className="grid grid-cols-3 gap-6">
          {posts.map((p) => (
            <div key={p.postId} className="flex flex-col justify-between bg-white border border-gray-100 rounded p-2">
              {p.image.length > 0 && (
                <img src={ipfs.contentLink(p.image)} className="w-full mb-2 rounded object-cover max-h-36" />
              )}
              <Link href={`post/${p.slug}`}>
                <h2 className="mb-2 text-lg font-semibold cursor-default">{p.title}</h2>
              </Link>
              <p className="overflow-ellipsis overflow-hidden">
                {p.synopsis}...
                <span className="ml-2 text-red-400 hover:text-red-300">
                  <Link href={`post/${p.slug}`}>Read more</Link>
                </span>
              </p>
            </div>
          ))}
        </div>
      )
    }
  }

  useEffect(() => {
    if (isReady) {
      loadPosts()
    }
  }, [isReady])

  if (!isReady) {
    return <div>loading...</div>
  }

  return (
    <>
      <Head>
        <title>theBloc.blog - Decentralized blogging powered by smart contracts & IPFS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NewPostModal showModal={newPost} createNewPost={web3.createPost} closeModal={() => updateNewPost(false)} />

      <nav className="container flex flex-row justify-between items-center py-3">
        <div>
          <Logo />
        </div>
        <div className="flex">
          {user.connected ? (
            <Button onClick={() => updateNewPost(true)}>Create Post</Button>
          ) : (
            <Button onClick={connectWallet}>Connect Wallet</Button>
          )}
        </div>
      </nav>
      <header className="container items-center justify-center my-20">
        <div className="text-center">
          <h1 className="text-6xl">Welcome To theBloc</h1>
          <h3 className="italic text-xl mt-2">
            Blogging platform on the metaverse, powered by smart contracts & IPFS.
          </h3>
          <span className="text-red-400">Please connect the BSC testnet to try demo out.</span>
        </div>
      </header>
      <section className="container mb-10">{loading ? <VariableView>loading...</VariableView> : renderPosts()}</section>
    </>
  )
}
