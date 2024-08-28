'use client'
import Link from 'next/link'
import { Button, FaAddressCardIcon, FaArrowRightIcon, TextLink } from 'smarthr-ui'

export default function Home() {
  return (
    <main>
      <Button variant="primary">Hello, Next.</Button>
      <ol>
        <li>
          <Link href="/about">next/link</Link>
        </li>
        <li>
          <TextLink elementAs={Link} href="/about" suffix={<FaArrowRightIcon />}>
            smarthr-ui with next/link
          </TextLink>
        </li>
        <li>
          <TextLink elementAs={Link} href="/about" prefix={<FaAddressCardIcon />}>
            smarthr-ui with next/link
          </TextLink>
        </li>
      </ol>
    </main>
  )
}
