import { render, screen } from '@testing-library/react'

import { DialogContentInner } from './DialogContentInner'

describe('DialogContentInner', () => {
  // mobile環境かどうかの判定は呼び出し元（Controlled*Dialog）が行い、
  // 確定済みのmobileTypeをpropsとして渡す契約になっている
  const renderDialog = (mobileType: 'sheet' | undefined) =>
    render(
      <DialogContentInner isOpen mobileType={mobileType} size="M" ariaLabel="ダイアログ">
        ダイアログコンテンツ
      </DialogContentInner>,
    )

  it('mobileTypeがsheetの場合はsizeを適用しないこと', () => {
    renderDialog('sheet')

    const layout = screen.getByRole('dialog', { name: 'ダイアログ' }).parentElement

    expect(layout).toHaveClass('shr-w-[100dvw]')
    expect(layout).not.toHaveClass('shr-w-col5')
  })

  it('mobileTypeがundefinedの場合はsizeを適用すること', () => {
    renderDialog(undefined)

    const layout = screen.getByRole('dialog', { name: 'ダイアログ' }).parentElement

    expect(layout).toHaveClass('shr-w-col5')
    expect(layout).not.toHaveClass('shr-w-[100dvw]')
  })
})
