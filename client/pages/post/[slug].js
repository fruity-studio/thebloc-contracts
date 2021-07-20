import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import ipfs from '../../lib/ipfs'
import Randomstring from 'randomstring'
import { VariableView, Logo } from '../../components'

function Post({ web3, isReady }) {
  const router = useRouter()
  const [loading, updateLoading] = useState(true)
  const [post, updatePost] = useState({})
  const { slug } = router.query

  const loadPost = async () => {
    const postObj = await web3.getPostWithSlug([slug])
    const content = await ipfs.fetchContent(postObj.contentId)

    updatePost({
      ...postObj,
      content: content.split(/\r\n|\n\r|\n|\r/).map((paragraph) => ({ paragraph, key: Randomstring.generate(7) })),
    })
    updateLoading(false)
  }

  // const formatPostDate = (timestamp) => moment(timestamp * 1000).format('dddd, MMMM Do YYYY, h:mm a')
  const formatPostDate = (timestamp) => moment(timestamp * 1000).format('dddd, MMMM Do YYYY')

  useEffect(() => {
    if (isReady) {
      loadPost()
    }
  }, [isReady])

  if (loading) {
    return <VariableView>Loading...</VariableView>
  }

  return (
    <>
      <Head>
        <title>theBloc.blog - {post.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="container flex flex-row justify-between items-center py-3">
        <div>
          <Logo />
        </div>
        {/* <div className="flex">Title can be here</div> */}
      </nav>
      <div className="max-w-3xl w-full mt-12">
        <div className="mb-9 text-center">
          <h1 className="font-semibold text-3xl">{post.title}</h1>
          <div className="mt-4">
            <span className="text-gray-600 text-lg">Published on {formatPostDate(post.createdAt)}</span>
          </div>
        </div>

        {post.image.length > 0 && (
          <div className="w-full my-4">
            <img src={ipfs.contentLink(post.image)} className="w-full rounded object-cover max-h-80" />
          </div>
        )}

        <div className="mt-9 mb-14">
          {post.content.map(({ paragraph, key }) => (
            <p className="mt-4 text-2xl" key={key}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </>
  )
}

export default Post
