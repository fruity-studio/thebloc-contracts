import React from 'react'
import Link from 'next/link'

function Logo() {
  return (
    <Link href="/">
      <img src="/assets/logo.svg" className="w-full h-auto" />
    </Link>
  )
}

export default Logo
