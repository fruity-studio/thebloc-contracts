import React from 'react'
import classnames from 'classnames'

function Button({ children, className, ...props }) {
  return (
    <a
      {...props}
      className={classnames('bg-blue-500 rounded text-white font-semibold cursor-default py-3 px-7', className)}
    >
      {children}
    </a>
  )
}

export default Button
