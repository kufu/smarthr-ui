import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from '@tiptap/core'
import { EnvironmentProvider, IntlProvider } from 'smarthr-ui'
import { describe, expect, it, onTestFinished } from 'vitest'

import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'
import { ALL_FEATURES, configureExtensions } from '../configureExtensions'

import { VideoFloatingUI } from './VideoFloatingUI'

import type { RichTextJSON } from '../../types'
import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">
    <EnvironmentProvider>{children}</EnvironmentProvider>
  </IntlProvider>
)

const videoDoc: RichTextJSON = {
  type: 'doc',
  content: [{ type: 'paragraph' }, { type: 'video', attrs: { src: '/a.mp4', title: '動画' } }],
}

const renderSelectedVideo = () => {
  const element = document.createElement('div')
  document.body.append(element)
  const editor = new Editor({
    element,
    extensions: configureExtensions({ features: ALL_FEATURES }),
    content: videoDoc,
  })
  const container = document.createElement('div')
  document.body.append(container)
  onTestFinished(() => {
    editor.destroy()
    element.remove()
    container.remove()
  })
  editor.commands.setNodeSelection(2)

  render(<VideoFloatingUI containerRef={{ current: container }} editor={editor as never} />, {
    wrapper: Wrapper,
  })

  return editor
}

describe('VideoFloatingUI', () => {
  it('動画を選んでいなければ操作バーを出さない', async () => {
    render(<RichTextEditor defaultValue={videoDoc} features={['video']} />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    expect(screen.queryByRole('toolbar', { name: '動画の操作' })).not.toBeInTheDocument()
  })

  it('選択中は出て、配置・サイズ・削除が効く', async () => {
    const user = userEvent.setup()
    const editor = renderSelectedVideo()
    const video = editor.view.dom.querySelector('video')!
    Object.defineProperty(video, 'videoWidth', { value: 1280, configurable: true })
    Object.defineProperty(video, 'videoHeight', { value: 720, configurable: true })

    expect(await screen.findByRole('toolbar', { name: '動画の操作' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '配置: 左揃え' }))
    await user.click(screen.getByRole('option', { name: '中央揃え' }))
    expect(editor.$node('video')?.attributes.align).toBe('center')

    await user.click(screen.getByRole('button', { name: 'サイズ' }))
    await user.clear(screen.getByRole('spinbutton', { name: '幅（px）' }))
    await user.type(screen.getByRole('spinbutton', { name: '幅（px）' }), '480')
    await user.clear(screen.getByRole('spinbutton', { name: '高さ（px）' }))
    await user.type(screen.getByRole('spinbutton', { name: '高さ（px）' }), '270')
    await user.click(screen.getByRole('button', { name: '適用' }))
    expect(editor.$node('video')?.attributes).toMatchObject({ width: 480, height: 270 })

    await user.click(screen.getByRole('button', { name: '動画を削除' }))
    expect(editor.$node('video')).toBeNull()
    expect(screen.queryByRole('toolbar', { name: '動画の操作' })).not.toBeInTheDocument()
  })

  it('動画を選んで Alt+Enter を押すと、操作バーの先頭のボタンへ移る', async () => {
    const editor = renderSelectedVideo()
    await screen.findByRole('toolbar', { name: '動画の操作' })

    act(() => {
      editor.commands.keyboardShortcut('Alt-Enter')
    })

    expect(screen.getByRole('button', { name: '配置: 左揃え' })).toHaveFocus()
  })
})
