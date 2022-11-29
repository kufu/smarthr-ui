import { FlattenSimpleInterpolation, css } from 'styled-components'

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
      outline: none;
      isolation: isolate;
      box-shadow: ${expectedOutline};
    `)

    expect(actualFocusIndicator).toBe(expectedFocusIndicator)
  })
})
