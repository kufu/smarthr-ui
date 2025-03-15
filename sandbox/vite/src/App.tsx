import { Link } from 'react-router'
import { Button, TextLink, FaArrowRightIcon, FaAddressCardIcon } from 'smarthr-ui'

export const About = () => (
  <main>
    <h1>About Page</h1>
    <TextLink elementAs={Link} to="/">
      Back to Home
    </TextLink>
  </main>
)

export const App = () =>  (
  <main>
    <Button variant="primary">こんにちは</Button>
    <ol>
      <li>
        <TextLink elementAs={Link} to="/about" suffix={<FaArrowRightIcon />}>
          smarthr-ui with Router Link
        </TextLink>
      </li>
      <li>
        <TextLink elementAs={Link} to="/about" prefix={<FaAddressCardIcon />}>
          smarthr-ui with Router Link
        </TextLink>
      </li>
    </ol>
  </main>
)
