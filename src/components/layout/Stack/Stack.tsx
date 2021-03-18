import styled, { css } from 'styled-components'
import { SpaceLength } from '../../../themes/createSpace'
import { useTheme } from '../../../hooks/useTheme'

/**
 * @param spaceLength rem の値
 * @param splitAfter nth-child に渡す値
 */
export const Stack = styled.div<{
  recursive?: boolean
  spaceLength?: SpaceLength
  splitAfter?: number
}>(({ recursive = false, spaceLength = 1, splitAfter }) => {
  const { space } = useTheme()

  return css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    ${!recursive && '>'} * + * {
      margin-top: ${space(spaceLength)};
    }

    ${splitAfter &&
    `
      > :nth-child(${splitAfter}) {
        margin-bottom: auto;
      }
    `}
  `
})
