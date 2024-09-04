'use client'
import Link from 'next/link'
import { Heading, Section, UpwardLink } from 'smarthr-ui'

export default function About() {
  return (
    <main>
      <Section>
        <Heading>Welcome to the About Page</Heading>
      </Section>

      <UpwardLink elementAs={Link} href="/" indent={false}>
        前へ戻る
      </UpwardLink>
    </main>
  )
}
