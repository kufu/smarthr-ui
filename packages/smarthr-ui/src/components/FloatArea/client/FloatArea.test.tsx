import { render, screen } from '@testing-library/react'

import { EnvironmentProvider } from '../../../hooks/client/useEnvironment'
import { Button } from '../../Button'

import { FloatArea } from './FloatArea'

import type { ComponentPropsWithRef } from 'react'

const renderFloatArea = (
  props: Partial<ComponentPropsWithRef<typeof FloatArea>>,
  mobile: boolean,
) =>
  render(
    <EnvironmentProvider environment={{ mobile }}>
      <FloatArea {...props} primaryButton={<Button variant="primary">保存</Button>} />
    </EnvironmentProvider>,
  )

describe('FloatArea の tertiaryButton に渡される state', () => {
  test('モバイルかつ fixedOnMobile の場合、fixedOnMobile: true が渡る', () => {
    const tertiaryButton = vi.fn(() => <Button>プレビュー</Button>)

    renderFloatArea({ fixedOnMobile: true, tertiaryButton }, true)

    expect(tertiaryButton).toHaveBeenLastCalledWith({ fixedOnMobile: true })
  })

  test('非モバイルで fixedOnMobile を指定しても、fixedOnMobile: false が渡る', () => {
    const tertiaryButton = vi.fn(() => <Button>プレビュー</Button>)

    renderFloatArea({ fixedOnMobile: true, tertiaryButton }, false)

    expect(tertiaryButton).toHaveBeenLastCalledWith({ fixedOnMobile: false })
  })

  test('fixedOnMobile を指定しない場合、fixedOnMobile: false が渡る', () => {
    const tertiaryButton = vi.fn(() => <Button>プレビュー</Button>)

    renderFloatArea({ tertiaryButton }, true)

    expect(tertiaryButton).toHaveBeenLastCalledWith({ fixedOnMobile: false })
  })

  test('ReactNode を直接渡した場合は従来どおり描画される', () => {
    renderFloatArea({ tertiaryButton: <Button>プレビュー</Button> }, true)

    expect(screen.getByRole('button', { name: 'プレビュー' })).toBeInTheDocument()
  })
})
