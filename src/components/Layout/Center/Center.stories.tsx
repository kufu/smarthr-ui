import { Story } from '@storybook/react'
import React from 'react'
import styled, { css } from 'styled-components'

import { Button, Center, Heading, Stack } from '../../..'

export default {
  title: 'Layouts（レイアウト）/Center',
  component: Center,
  parameters: {
    withTheming: true,
  },
}

export const All: Story = () => {
  return (
    <Stack as="article">
      <header>
        <Heading>Center</Heading>
      </header>

      <Stack as="section">
        <Heading tag="h2" type="sectionTitle">
          default
        </Heading>
        <DemoWrapper>
          <Center>
            <Button>水平中央揃え</Button>
          </Center>
        </DemoWrapper>
      </Stack>

      <Stack as="section">
        <Heading tag="h2" type="sectionTitle">
          padding
        </Heading>
        <DemoWrapper>
          <Center padding={1.5}>
            <Button>水平中央揃え</Button>
          </Center>
        </DemoWrapper>
      </Stack>

      <Stack as="section">
        <Heading tag="h2" type="sectionTitle">
          max width
        </Heading>
        <DemoWrapper>
          <Center maxWidth="50%">
            <p>{'これは中央揃えのテキストです。'.repeat(5)}</p>
          </Center>
        </DemoWrapper>
      </Stack>

      <Stack as="section">
        <Heading tag="h2" type="sectionTitle">
          vAlign (with minHeight: 200px)
        </Heading>
        <DemoWrapper>
          <Center vAlign minHeight="200px">
            <Button>水平垂直中央揃え</Button>
          </Center>
        </DemoWrapper>
      </Stack>
    </Stack>
  )
}

const DemoWrapper = styled.div`
  ${({ theme: { color } }) => css`
    border: 3px dotted ${color.BORDER};
  `}
`
