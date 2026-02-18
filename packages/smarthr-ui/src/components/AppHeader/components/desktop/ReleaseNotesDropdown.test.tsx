import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { IntlProvider } from '../../../../intl'

import { ReleaseNotesDropdown } from './ReleaseNotesDropdown'

describe('ReleaseNotesDropdown', () => {
  const defaultProps = {
    indexUrl: 'https://example.com/release-notes',
    links: [
      { title: 'リリースノート1', url: 'https://example.com/note1' },
      { title: 'リリースノート2', url: 'https://example.com/note2' },
    ],
    loading: false,
    error: false,
  }

  describe('リリースノートリンクの属性', () => {
    it('リリースノートリンクに適切なrel属性とreferrerPolicyが設定される', async () => {
      const user = userEvent.setup()
      render(
        <IntlProvider locale="ja">
          <ReleaseNotesDropdown {...defaultProps} />
        </IntlProvider>,
      )

      const button = screen.getByRole('button', { name: 'リリースノート' })
      await user.click(button)

      const link1 = screen.getByRole('link', { name: /リリースノート1/ })
      expect(link1).toHaveAttribute('rel', 'noopener')
      expect(link1).toHaveAttribute('referrerpolicy', 'no-referrer-when-downgrade')
      expect(link1).toHaveAttribute('target', '_blank')
      expect(link1).toHaveAttribute('href', 'https://example.com/note1')

      const link2 = screen.getByRole('link', { name: /リリースノート2/ })
      expect(link2).toHaveAttribute('rel', 'noopener')
      expect(link2).toHaveAttribute('referrerpolicy', 'no-referrer-when-downgrade')
      expect(link2).toHaveAttribute('target', '_blank')
      expect(link2).toHaveAttribute('href', 'https://example.com/note2')
    })

    it('「すべてのリリースノートを見る」リンクに適切な属性が設定される', async () => {
      const user = userEvent.setup()
      render(
        <IntlProvider locale="ja">
          <ReleaseNotesDropdown {...defaultProps} />
        </IntlProvider>,
      )

      const button = screen.getByRole('button', { name: 'リリースノート' })
      await user.click(button)

      const seeAllLink = screen.getByRole('link', { name: /すべてのリリースノートを見る/ })
      expect(seeAllLink).toHaveAttribute('rel', 'noopener')
      expect(seeAllLink).toHaveAttribute('referrerpolicy', 'no-referrer-when-downgrade')
      expect(seeAllLink).toHaveAttribute('target', '_blank')
      expect(seeAllLink).toHaveAttribute('href', 'https://example.com/release-notes')
    })

    it('最大5件のリリースノートを表示する', async () => {
      const user = userEvent.setup()
      const manyLinks = Array.from({ length: 10 }, (_, i) => ({
        title: `リリースノート${i + 1}`,
        url: `https://example.com/note${i + 1}`,
      }))

      render(
        <IntlProvider locale="ja">
          <ReleaseNotesDropdown {...defaultProps} links={manyLinks} />
        </IntlProvider>,
      )

      const button = screen.getByRole('button', { name: 'リリースノート' })
      await user.click(button)

      expect(screen.getByRole('link', { name: /リリースノート1/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /リリースノート5/ })).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /リリースノート6/ })).not.toBeInTheDocument()
    })
  })

  describe('ローディング状態', () => {
    it('loading=trueの場合、ローダーを表示する', async () => {
      const user = userEvent.setup()
      render(
        <IntlProvider locale="ja">
          <ReleaseNotesDropdown {...defaultProps} loading={true} />
        </IntlProvider>,
      )

      const button = screen.getByRole('button', { name: 'リリースノート' })
      await user.click(button)

      expect(screen.getByText('処理中')).toBeInTheDocument()
      const links = screen.queryAllByRole('link')
      expect(links).toHaveLength(0)
    })
  })

  describe('エラー状態', () => {
    it('error=trueの場合、エラーメッセージを表示する', async () => {
      const user = userEvent.setup()
      render(
        <IntlProvider locale="ja">
          <ReleaseNotesDropdown {...defaultProps} error={true} />
        </IntlProvider>,
      )

      const button = screen.getByRole('button', { name: 'リリースノート' })
      await user.click(button)

      expect(screen.getByText(/リリースノートの読み込みに失敗しました/)).toBeInTheDocument()
      expect(screen.getByText(/時間をおいて、やり直してください/)).toBeInTheDocument()
      const links = screen.queryAllByRole('link')
      expect(links).toHaveLength(0)
    })
  })
})
