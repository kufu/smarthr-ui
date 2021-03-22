import styled, { css } from 'styled-components'
import { SpaceLength } from '../../themes/createSpace'
import { useSpace } from '../../hooks/useSpace'

/**
 * @param recursive 直下の要素だけでなく再帰的に適用するかどうかの指定
 * @param spaceLength 間隔の指定（rem の値）
 * @param splitAfter 分割する位置の指定（nth-child に渡す値）
 */
export const Stack = styled.div<{
  recursive?: boolean
  spaceLength?: SpaceLength
  splitAfter?: number | string
}>(({ recursive = false, spaceLength = 1, splitAfter }) => {
  return css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    ${!recursive && '>'} * + * {
      margin-top: ${useSpace(spaceLength)};
      margin-bottom: 0;
    }

    ${splitAfter &&
    `
      ${!recursive && '>'} :nth-child(${splitAfter}) {
        margin-bottom: auto;
      }
    `}
  `
})
