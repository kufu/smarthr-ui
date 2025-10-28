import { type FlattenSimpleInterpolation, css } from 'styled-components'

import { createOutline } from '../createOutline'

const replaceSpaces = (str: FlattenSimpleInterpolation) => String(str).replace(/\s/g, '')

describe('createOutline', () => {
  it('ユーザー指定の OUTLINE がフォーカススタイルに反映されること', () => {
    const userOutlineColor = 'black'
    const actual = createOutline({ OUTLINE: userOutlineColor })
    const expectedOutline = replaceSpaces(css`
      outline: 2px solid ${userOutlineColor};
      outline-offset: -2px;
      box-shadow: inset 0 0 0 2px white;
    `)

    expect(replaceSpaces(actual.OUTLINE)).toBe(expectedOutline)

    const actualFocusIndicator = replaceSpaces(actual.focusIndicatorStyles)
    const expectedFocusIndicator = replaceSpaces(css`
      outline: 2px solid ${userOutlineColor};
      outline-offset: -2px;
      box-shadow: inset 0 0 0 2px white;
    `)

    expect(actualFocusIndicator).toBe(expectedFocusIndicator)
  })
})
