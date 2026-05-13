import { type FlattenSimpleInterpolation, css } from 'styled-components'

import { createShadow } from '../createShadow'

const replaceSpaces = (str: FlattenSimpleInterpolation) => String(str).replace(/\s/g, '')

describe('createShadow', () => {
  it('ユーザー指定の OUTLINE がフォーカススタイルに反映されること', () => {
    const userOutlineColor = 'black'
    const actual = createShadow(undefined, { OUTLINE: userOutlineColor })
    const expectedOutline = `0 0 0 2px white, 0 0 0 4px ${userOutlineColor}`

    expect(actual.OUTLINE).toBe(expectedOutline)

    const actualFocusIndicator = replaceSpaces(actual.focusIndicatorStyles)
    const expectedFocusIndicator = replaceSpaces(css`
      /* stylelint-disable no-invalid-position-declaration */
      isolation: isolate;
      box-shadow: 0 0 0 2px white;
      outline: 2px solid ${userOutlineColor};
      outline-offset: 2px;
      /* stylelint-enable no-invalid-position-declaration */
    `)

    expect(actualFocusIndicator).toBe(expectedFocusIndicator)
  })
})
