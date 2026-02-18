import { render, screen } from '@testing-library/react'

import { IntlProvider } from '../../../../intl'

import { ReleaseNote } from './ReleaseNote'
import { ReleaseNoteContext } from './ReleaseNoteContext'

describe('ReleaseNote', () => {
  const defaultReleaseNoteData = {
    indexUrl: 'https://example.com/release-notes',
    links: [
      { title: 'リリースノート1', url: 'https://example.com/note1' },
      { title: 'リリースノート2', url: 'https://example.com/note2' },
    ],
    loading: false,
    error: false,
  }

  const renderWithContext = (
    releaseNote: typeof defaultReleaseNoteData | null,
    isReleaseNoteSelected = false,
  ) =>
    render(
      <IntlProvider locale="ja">
        <ReleaseNoteContext.Provider
          value={{
            releaseNote,
            isReleaseNoteSelected,
            setIsReleaseNoteSelected: vi.fn(),
          }}
        >
          <ReleaseNote />
        </ReleaseNoteContext.Provider>
      </IntlProvider>,
    )

  describe('リリースノートリンクの属性', () => {
    it('リリースノートリンクに適切なrel属性とreferrerPolicyが設定される', () => {
      renderWithContext(defaultReleaseNoteData)

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

    it('「すべてのリリースノートを見る」リンクに適切な属性が設定される', () => {
      renderWithContext(defaultReleaseNoteData)

      const seeAllLink = screen.getByRole('link', { name: /すべてのリリースノートを見る/ })
      expect(seeAllLink).toHaveAttribute('rel', 'noopener')
      expect(seeAllLink).toHaveAttribute('referrerpolicy', 'no-referrer-when-downgrade')
      expect(seeAllLink).toHaveAttribute('target', '_blank')
      expect(seeAllLink).toHaveAttribute('href', 'https://example.com/release-notes')
    })

    it('最大5件のリリースノートを表示する', () => {
      const manyLinks = Array.from({ length: 10 }, (_, i) => ({
        title: `リリースノート${i + 1}`,
        url: `https://example.com/note${i + 1}`,
      }))

      renderWithContext({
        ...defaultReleaseNoteData,
        links: manyLinks,
      })

      expect(screen.getByRole('link', { name: /リリースノート1/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /リリースノート5/ })).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /リリースノート6/ })).not.toBeInTheDocument()
    })
  })

  describe('ローディング状態', () => {
    it('loading=trueの場合、ローダーを表示する', () => {
      renderWithContext({
        ...defaultReleaseNoteData,
        loading: true,
      })

      expect(screen.getByText('処理中')).toBeInTheDocument()
      const seeAllLink = screen.getByRole('link', { name: /すべてのリリースノートを見る/ })
      expect(seeAllLink).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /リリースノート1/ })).not.toBeInTheDocument()
    })
  })

  describe('エラー状態', () => {
    it('error=trueの場合、エラーメッセージを表示する', () => {
      renderWithContext({
        ...defaultReleaseNoteData,
        error: true,
      })

      expect(screen.getByText(/リリースノートの読み込みに失敗しました/)).toBeInTheDocument()
      expect(screen.getByText(/時間をおいて、やり直してください/)).toBeInTheDocument()
      const seeAllLink = screen.getByRole('link', { name: /すべてのリリースノートを見る/ })
      expect(seeAllLink).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /リリースノート1/ })).not.toBeInTheDocument()
    })
  })

  describe('releaseNoteがnullの場合', () => {
    it('何も表示しない', () => {
      const { container } = renderWithContext(null)
      expect(container.firstChild).toBeNull()
    })
  })
})
