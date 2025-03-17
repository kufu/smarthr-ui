import { Link } from 'react-router'
import { Button, TextLink, FaArrowRightIcon, FaAddressCardIcon } from 'smarthr-ui'
import * as SHRUI from 'smarthr-ui'

const Index = () =>  (
  <main>
    <SHRUI.Tooltip message="hello">
      <div style={{width: '400px', height: '400px'}}>Tooltip</div>
    </SHRUI.Tooltip>
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

export default Index
