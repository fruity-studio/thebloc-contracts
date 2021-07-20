import React from 'react'
import classnames from 'classnames'

function VariableView({ children, className }) {
  return (
    <div className={classnames('py-16', className)}>
      <h4 className="text-2xl">{children}</h4>
    </div>
  )
}

export default VariableView
