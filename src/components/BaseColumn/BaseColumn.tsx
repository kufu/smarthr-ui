import React, { ComponentProps, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { GreyScaleColors } from '../../themes/createColor'
import { Base as shrBase } from '../Base'

type BaseProps = Omit<ComponentProps<typeof Base>, 'radius' | 'layer'>
type Props = {
  /** 背景色。初期値は COLUMN */
  bgColor?: GreyScaleColors
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof BaseProps | keyof Props>

export const BaseColumn: React.FC<BaseProps & Props & ElementProps> = ({
  padding = 1,
  ...props
}) => {
  const themes = useTheme()
  return <Base {...props} padding={padding} layer={0} themes={themes} />
}

const Base = styled(shrBase)<{
  bgColor?: Props['bgColor']
  themes: Theme
}>`
  ${({ bgColor = 'COLUMN', themes: { color } }) => css`
    border-radius: unset;

    ${bgColor &&
    css`
      background-color: ${color[bgColor]};
    `}
  `}
`
