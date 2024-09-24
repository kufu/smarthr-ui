import { render, screen } from '@testing-library/react'
import React from 'react'

import { FlashMessage } from './FlashMessage'

describe('FlashMessage', () => {
  it('visible=true の場合、フラッシュメッセージが描画される', () => {
    render(<FlashMessage type="success" text="flash!!" onClose={vi.fn()} visible={true} />)
    expect(screen.queryByText('flash!!')).toBeTruthy()
  })
  it('visible=false の場合、フラッシュメッセージが描画されない', () => {
    render(<FlashMessage type="success" text="flash!!" onClose={vi.fn()} visible={false} />)
    expect(screen.queryByText('flash!!')).toBeFalsy()
  })
  it('閉じるボタンを押下すると onClose が発火する', () => {
    const spy = vi.fn()
    render(<FlashMessage type="success" text="flash!!" onClose={spy} visible={true} />)
    screen.getByText('閉じる').click()
    expect(spy).toHaveBeenCalled()
  })
})
