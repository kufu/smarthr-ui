import { type FlattenSimpleInterpolation, css } from 'styled-components'

import { createOutline } from '../createOutline'

const replaceSpaces = (str: FlattenSimpleInterpolation) => String(str).replace(/\s/g, '')

describe('createOutline', () => {
  it('ユーザー指定の OUTLINE がフォーカススタイルに反映されること', () => {
    const userOutlineColor = 'black'
    const actual = createOutline({ OUTLINE: userOutlineColor })
    const expectedOutline = replaceSpaces(css`
      /* stylelint-disable no-invalid-position-declaration */
      outline: 2px solid ${userOutlineColor};
      outline-offset: 2px;
      isolation: isolate;
      box-shadow: 0 0 0 2px white;
      /* stylelint-enable no-invalid-position-declaration */
    `)

    expect(replaceSpaces(actual.OUTLINE)).toBe(expectedOutline)

    const actualFocusIndicator = replaceSpaces(actual.focusIndicatorStyles)
    const expectedFocusIndicator = replaceSpaces(css`
      /* stylelint-disable no-invalid-position-declaration */
      outline: 2px solid ${userOutlineColor};
      outline-offset: 2px;
      isolation: isolate;
      box-shadow: 0 0 0 2px white;
      /* stylelint-enable no-invalid-position-declaration */
    `)

    expect(actualFocusIndicator).toBe(expectedFocusIndicator)
  })
})
