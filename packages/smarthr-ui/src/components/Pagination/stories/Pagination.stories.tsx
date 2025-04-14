import { ReactNode } from 'react'
import { action } from '@storybook/addon-actions'

import { Stack } from '../../Layout'
import { Pagination } from '../Pagination'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Navigation（ナビゲーション）/Pagination',
  component: Pagination,
  render: (args) => <Pagination {...args} />,
  args: {
    total: 11,
    current: 6,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Pagination>
export default meta

export const Playground: StoryObj<typeof Pagination> = {}

export const Total: StoryObj<typeof Pagination> = {
  name: 'total',
  args: {
    total: 7,
  },
}

export const Current: StoryObj<typeof Pagination> = {
  name: 'current',
  render: (args) => <Stack>{[1, 6, 11].map((current) => meta.render({ ...args, current }))}</Stack>,
}

export const Padding: StoryObj<typeof Pagination> = {
  name: 'padding',
  args: {
    padding: 1,
  },
}

export const WithoutNumbers: StoryObj<typeof Pagination> = {
  name: 'withoutNumbers',
  args: {
    withoutNumbers: true,
  },
}

export const OnClick: StoryObj<typeof Pagination> = {
  name: 'onClick',
  args: {
    onClick: action('click'),
  },
}

export const HrefTemplate: StoryObj<typeof Pagination> = {
  name: 'hrefTemplate',
  args: {
    hrefTemplate: (page: number) => `https://example.com/?page=${page}`,
    onClick: (href: string, e: MouseEvent<HTMLElement>) => {
      e.preventDefault()
      action('click')(href, e)
    },
  },
}

const CustomLink = ({
  href,
  children,
  ...props
}: { href: string; children: ReactNode } & HTMLAttributes<HTMLElement>) => (
  <a href={href} style={{ textDecoration: 'underline' }} {...props}>
    {children}
  </a>
)

export const LinkAs: StoryObj<typeof Pagination> = {
  name: 'linkAs',
  args: {
    hrefTemplate: (page: number) => `https://example.com/?page=${page}`,
    onClick: (href: string, e: MouseEvent<HTMLElement>) => {
      e.preventDefault()
      action('click')(href, e)
    },
    linkAs: CustomLink,
  },
}
