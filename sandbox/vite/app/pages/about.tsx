import { Link } from 'react-router'
import { TextLink } from 'smarthr-ui'

export const About = () => (
  <main>
    <h1>About Page</h1>
    <TextLink elementAs={Link} to="/">
      Back to Home
    </TextLink>
  </main>
)

export default About
