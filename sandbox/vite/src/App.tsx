import { Link, Routes, Route } from 'react-router-dom'
import { Button, TextLink, FaArrowRightIcon, FaAddressCardIcon } from 'smarthr-ui'
import 'smarthr-ui/smarthr-ui.css'

const About = () => (
  <div>
    <h1>About Page</h1>
    <TextLink elementAs={Link} to="/">
      Back to Home
    </TextLink>
  </div>
)

const App = () =>  (
  <Routes>
    <Route
      path="/"
      element={
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
      }
    />
    <Route path="/about" element={<About />} />
  </Routes>
)

export default App
