import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}

const Modal =
  (Component) =>
  ({ showModal, ...props }) => {
    return (
      <AnimatePresence exitBeforeEnter>
        {showModal && (
          <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            className="flex flex-1 w-full h-full fixed top-0 left-0 items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className="relative sm:w-3/4 md:w-3/4 lg:w-3/5 mx-2 sm:mx-auto my-10 opacity-100">
              <div className="relative bg-white shadow-lg rounded-lg text-gray-900 z-20">
                <Component {...props} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

export default Modal
