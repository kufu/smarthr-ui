import React from 'react'
import styled, { css } from 'styled-components'
import { Story } from '@storybook/react'

import { useTheme } from '../../../hooks/useTheme'
import { Stack } from '../Stack'
import { LineUp } from '.'

import { Heading } from '../../Heading'
import { StatusLabel } from '../../StatusLabel'
import { FaExternalLinkAltIcon } from '../../Icon'

import readme from './README.md'

export default {
  title: 'LineUp',
  component: LineUp,
  parameters: {
    docs: {
      description: { component: readme },
    },
  },
}

export const Default: Story = () => (
  <Stack>
    <figure>
      <figcaption>
        初期値は <code>gap: 8px</code> で横に並べます。
      </figcaption>
      <LineUp>
        {[...Array(5)].map((_, i) => (
          <ColorBox key={i} />
        ))}
      </LineUp>
    </figure>
    <figure>
      <figcaption>
        間隔は <code>gap</code> で調整します。<code>gap=&#123;1&#125;</code>
      </figcaption>
      <LineUp gap={1}>
        {[...Array(5)].map((_, i) => (
          <ColorBox key={i} />
        ))}
      </LineUp>
    </figure>
    <figure>
      <figcaption>
        抽象値の指定もできます。<code>gap=&ldquo;M&rdquo;</code>
      </figcaption>
      <LineUp gap="M">
        {[...Array(5)].map((_, i) => (
          <ColorBox key={i} />
        ))}
      </LineUp>
    </figure>
    <figure>
      <figcaption style={{ textAlign: 'right' }}>
        <code>reverse</code> で並びの向きを変えられます。
      </figcaption>
      <LineUp reverse>
        {[...Array(4)].map((_, i) => (
          <ColorBox key={i}>{i + 1}</ColorBox>
        ))}
      </LineUp>
    </figure>
    <figure>
      <figcaption>
        <code>align-items</code> や <code>justify-content</code> など
        <a href="https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox">
          {' '}
          Flexbox{' '}
        </a>{' '}
        に準じたプロパティを渡せます。
      </figcaption>
      <LineUp vAlign="center">
        <StatusLabel type="success">完了</StatusLabel>
        <Heading>レイアウトコンポーネントの調整</Heading>
      </LineUp>
    </figure>
    <figure>
      <figcaption>
        必要に応じて <code>inline</code> を使ってください。
      </figcaption>
      <p>
        これはテキスト内リンクなので
        <Link href="">
          <LineUp vAlign="center" gap={0.25} inline>
            inline-flex
            <FaExternalLinkAltIcon />
          </LineUp>
        </Link>
        にします
      </p>
    </figure>
  </Stack>
)

const ColorBox = styled.div(() => {
  const { color } = useTheme()

  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${color.BRAND};
    color: white;
    width: 80px;
    height: 80px;
  `
})

const Link = styled.a(() => {
  const { color } = useTheme()
  return css`
    color: ${color.TEXT_LINK};
    text-decoration: underline;
    text-underline-position: under;
  `
})
