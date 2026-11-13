import { act, render, screen, waitFor } from '@testing-library/react'
import { EnvironmentProvider, IntlProvider } from 'smarthr-ui'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import { BLOCK_CATALOG } from './blockCatalog'
import { ALL_FEATURES } from './configureExtensions'
import { INSERT_DIALOG_KINDS } from './insertDialogs'

import type { TiptapEditorHTMLElement } from '@tiptap/core'
import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">
    <EnvironmentProvider>{children}</EnvironmentProvider>
  </IntlProvider>
)

describe('挿入ダイアログの網羅', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  it.each(INSERT_DIALOG_KINDS)(
    'すべての feature とコールバックを渡すと、%s をスラッシュから開ける',
    async (kind) => {
      render(
        <RichTextEditor
          features={ALL_FEATURES}
          loadVideos={vi.fn(async () => [])}
          aria-label="本文"
          onImageUpload={vi.fn()}
        />,
        { wrapper: Wrapper },
      )
      const editorDom = await screen.findByRole('textbox', { name: '本文' })
      const editor = (editorDom as TiptapEditorHTMLElement).editor!
      const entry = BLOCK_CATALOG.find(
        ({ creation }) => creation?.type === 'dialog' && creation.dialog === kind,
      )

      act(() => {
        editor.view.focus()
        editor.view.dispatch(editor.state.tr.insertText('/'))
      })

      await waitFor(() =>
        expect(screen.getByRole('option', { name: entry?.label.defaultText })).toBeInTheDocument(),
      )
    },
  )
})
