import { render, screen } from '@testing-library/react'

import { Button } from '../Button'

import { FloatArea } from './FloatArea'

describe('FloatArea', () => {
  const getFloatArea = () =>
    screen.getByRole('button', { name: '保存' }).closest('.smarthr-ui-FloatArea')

  it('stickyの基準がviewportの場合、data-sticky-to-viewport属性が付与されること', () => {
    render(<FloatArea primaryButton={<Button variant="primary">保存</Button>} />)

    expect(getFloatArea()).toHaveAttribute('data-sticky-to-viewport')
  })

  it('スクロールコンテナ内に配置された場合、data-sticky-to-viewport属性が付与されないこと', () => {
    render(
      // HINT: jsdomは算出値でoverflowをoverflowX・overflowYに展開しないため、個別プロパティで指定する
      <div style={{ overflowY: 'auto' }}>
        <div>
          <FloatArea primaryButton={<Button variant="primary">保存</Button>} />
        </div>
      </div>,
    )

    expect(getFloatArea()).not.toHaveAttribute('data-sticky-to-viewport')
  })

  it('overflow: clipの要素はスクロールコンテナにならないため、viewportが基準とみなされること', () => {
    render(
      <div style={{ overflowX: 'clip', overflowY: 'clip' }}>
        <FloatArea primaryButton={<Button variant="primary">保存</Button>} />
      </div>,
    )

    expect(getFloatArea()).toHaveAttribute('data-sticky-to-viewport')
  })
})
