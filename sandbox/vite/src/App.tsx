import { Link } from 'react-router-dom'
import { Button, TextLink, FaArrowRightIcon, FaAddressCardIcon } from 'smarthr-ui'
import 'smarthr-ui/smarthr-ui.css'

function App() {
  return (
    <main>
      <Button variant="primary">Hello, Next.</Button>
      <ol>
        <li>
          <Link to="/about">React Router Link</Link>
        </li>
        <li>
          <TextLink elementAs={Link} to="/about" suffix={<FaArrowRightIcon />}>
            smarthr-ui with next/link
          </TextLink>
        </li>
        <li>
          <TextLink elementAs={Link} to="/about" prefix={<FaAddressCardIcon />}>
            smarthr-ui with next/link
          </TextLink>
        </li>
      </ol>
    </main>
  )
}

export default App
