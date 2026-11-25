import { render, screen } from '@testing-library/react'

import { List } from './List'
import { ListItem } from './ListItem'

import type { ComponentPropsWithoutRef } from 'react'

const renderList = (divider?: ComponentPropsWithoutRef<typeof List>['divider']) =>
  render(
    <List divider={divider}>
      <ListItem heading="アイテム1" />
      <ListItem heading="アイテム2" />
    </List>,
  )

describe('List', () => {
  describe('divider', () => {
    it.each([undefined, 'full', 'content', { type: 'full', last: true }] as const)(
      '%o のとき、最後のアイテムの下にも区切り線を引く',
      (divider) => {
        renderList(divider)

        screen.getAllByRole('listitem').forEach((item) => {
          expect(item).toHaveClass('after:shr-border-b-shorthand')
          expect(item).not.toHaveClass('last:after:shr-hidden')
        })
      },
    )

    it.each([
      { type: 'full', last: false },
      { type: 'content', last: false },
    ] as const)('%o のとき、最後のアイテムの下には区切り線を引かない', (divider) => {
      renderList(divider)

      screen.getAllByRole('listitem').forEach((item) => {
        expect(item).toHaveClass('after:shr-border-b-shorthand')
        expect(item).toHaveClass('last:after:shr-hidden')
      })
    })

    it('false のとき、区切り線を引かない', () => {
      renderList(false)

      screen.getAllByRole('listitem').forEach((item) => {
        expect(item).not.toHaveClass('after:shr-border-b-shorthand')
      })
    })
  })
})
