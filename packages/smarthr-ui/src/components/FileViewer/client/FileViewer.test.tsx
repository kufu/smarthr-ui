import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { EnvironmentProvider } from '../../../hooks/client/useEnvironment'
import { IntlProvider } from '../../../intl'

import { FileViewer } from './FileViewer'

import type { ComponentPropsWithoutRef } from 'react'

const renderFileViewer = (
  props: Pick<ComponentPropsWithoutRef<typeof FileViewer>, 'scaleStep' | 'scaleSteps'>,
) =>
  render(
    <IntlProvider locale="ja">
      <EnvironmentProvider>
        {/* HINT: widthを指定しないとjsdomに無いResizeObserverを使うため、固定幅にする */}
        <FileViewer {...props} file={{ url: 'dummy.txt', contentType: 'text/plain' }} width={500} />
      </EnvironmentProvider>
    </IntlProvider>,
  )

describe('FileViewer', () => {
  // HINT: 1 - 0.1 - 0.1 - 0.1 は浮動小数点では 0.7000000000000001 になるため、
  // 誤差を取り除けていないと最小の拡大率に達しても縮小ボタンが無効にならない
  it('縮小を繰り返して最小の拡大率に達すると、縮小ボタンが無効になる', async () => {
    renderFileViewer({ scaleStep: 0.1, scaleSteps: [0.7, 1, 2] })

    const scaleDownButton = screen.getByRole('button', { name: '縮小' })

    await userEvent.click(scaleDownButton)
    await userEvent.click(scaleDownButton)
    expect(scaleDownButton).not.toHaveAttribute('aria-disabled', 'true')

    await userEvent.click(scaleDownButton)
    expect(screen.getByText('70%')).toBeInTheDocument()
    expect(scaleDownButton).toHaveAttribute('aria-disabled', 'true')
  })

  it('拡大すると、scaleStep分だけ拡大率が上がる', async () => {
    renderFileViewer({ scaleStep: 0.2 })

    await userEvent.click(screen.getByRole('button', { name: '拡大' }))
    await userEvent.click(screen.getByRole('button', { name: '拡大' }))

    expect(screen.getByText('140%')).toBeInTheDocument()
  })
})
