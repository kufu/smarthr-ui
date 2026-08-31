import { render, screen } from '@testing-library/react'

import { EnvironmentProvider } from '../../hooks/useEnvironment'

import { DialogContentInner } from './DialogContentInner'

describe('DialogContentInner', () => {
  const renderDialog = (mobile: boolean) =>
    render(
      <EnvironmentProvider environment={{ mobile }}>
        <DialogContentInner isOpen ariaLabel="ダイアログ" mobileType="sheet" size="M">
          ダイアログコンテンツ
        </DialogContentInner>
      </EnvironmentProvider>,
    )

  it('モバイルでsheet表示の場合はsizeを適用しないこと', () => {
    renderDialog(true)

    const layout = screen.getByRole('dialog', { name: 'ダイアログ' }).parentElement

    expect(layout).toHaveClass('shr-w-[100dvw]')
    expect(layout).not.toHaveClass('shr-w-col5')
  })

  it('非モバイルではsheet指定時もsizeを適用すること', () => {
    renderDialog(false)

    const layout = screen.getByRole('dialog', { name: 'ダイアログ' }).parentElement

    expect(layout).toHaveClass('shr-w-col5')
    expect(layout).not.toHaveClass('shr-w-[100dvw]')
  })
})
