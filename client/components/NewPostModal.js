import React, { useState } from 'react'
import Link from 'next/link'
// import dynamic from 'next/dynamic'
import { Formik } from 'formik'
import { X } from 'react-feather'
import slugify from 'slugify'
import Dropzone from 'react-dropzone'
import ipfsClient from '../lib/ipfs'
import randomstring from 'randomstring'
import Modal from './Modal'
const Buffer = require('buffer/').Buffer

// const TrixEditor = dynamic(() => import('./TrixEditor'), {
//   ssr: false,
// })

function NewPostModal({ closeModal, createNewPost }) {
  const [headerImage, updateHeaderImage] = useState('')
  const [postSlug, updatePostSlug] = useState('')
  const submitPost = async (values, actions) => {
    const { title, content } = values
    const slug = `${slugify(title, { replacement: '_', lower: true })}_${randomstring.generate(7)}`
    const synopsis = content.length > 120 ? content.substring(0, 120) : content

    // add content to IPFS
    const ipfs = ipfsClient.instance()
    const { cid } = await ipfs.add(content)
    const params = [title, slug, headerImage, synopsis, false, cid.string]
    const res = await createNewPost(params)

    updatePostSlug(res.slug)
  }

  const processFile = async ([file]) => {
    const reader = new FileReader()
    reader.onload = async () => {
      const imageBuffer = Buffer.from(reader.result)
      const ipfs = ipfsClient.instance()
      const { cid } = await ipfs.add(imageBuffer)

      updateHeaderImage(cid.string)
    }
    reader.readAsArrayBuffer(file)
  }

  // const onEditorReady = () => {
  //   console.log('editor ready')
  // }

  // const handlePostBody = async (html, text) => {
  //   console.log(text)
  // }

  return (
    <div className="rounded p-4 flex flex-col">
      <div className="flex flex-1 flex-row justify-between items-center">
        <h3 className="text-lg font-semibold">Create Post</h3>
        <button onClick={closeModal}>
          <X size={20} />
        </button>
      </div>
      <div>
        {headerImage ? (
          <img src={ipfsClient.contentLink(headerImage)} className="w-full object-cover h-40 my-4 rounded" />
        ) : (
          <Dropzone onDrop={processFile}>
            {({ getRootProps, getInputProps }) => (
              <section className="w-full flex flex-1 h-40 my-4 border border-dashed rounded">
                <label
                  htmlFor="drop-input"
                  className="w-full h-40 flex flex-1 items-center justify-center"
                  {...getRootProps()}
                >
                  <input id="drop-input" {...getInputProps()} />
                  <span>Drag n' Drop post header image here</span>
                </label>
              </section>
            )}
          </Dropzone>
        )}

        <div className="flex flex-1 flex-col">
          <Formik initialValues={{ title: '', content: '' }} onSubmit={submitPost}>
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <div className="flex flex-1 my-4">
                  <input
                    type="text"
                    className="w-full p-2 rounded border"
                    placeholder="Post Title"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.title}
                    name="title"
                  />
                </div>
                <div className="flex flex-1 my-4 editor-wrapper">
                  <textarea
                    className="w-full p-2 rounded border resize-none"
                    placeholder="The pen is mightier than the sword... or it's the keyboard? 🤔"
                    onChange={props.handleChange}
                    rows={7}
                    onBlur={props.handleBlur}
                    value={props.values.content}
                    name="content"
                  />
                  {/* <TrixEditor
                    placeholder="The pen is mightier than the sword... or it's the keyboard? 🤔"
                    onChange={handlePostBody}
                    onEditorReady={onEditorReady}
                  /> */}
                </div>
                <div className="flex flex-1 justify-end items-center">
                  {postSlug.length > 0 && (
                    <div className="flex mr-4">
                      <span>Post submitted,</span>
                      <span className="text-blue-500 ml-1">
                        <Link href={`post/${postSlug}`}>view post</Link>
                      </span>
                    </div>
                  )}
                  <button className="py-2 px-4 rounded font-semibold bg-blue-500 text-white" type="submit">
                    Create Post
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Modal(NewPostModal)
