import 'trix/dist/trix'
import { TrixEditor } from 'react-trix'

function Component(props) {
  return <TrixEditor {...props} className="w-full h-56 overflow-y-auto" />
}

export default Component
