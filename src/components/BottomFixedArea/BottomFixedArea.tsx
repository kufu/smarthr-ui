import React, {
  ComponentProps,
  FunctionComponentElement,
  HTMLAttributes,
  ReactNode,
  VFC,
  useEffect,
} from 'react'
import styled, { css } from 'styled-components'

import { TertiaryLink } from './TertiaryLink'
import { validateElement } from './bottomFixedAreaHelper'

import { Base as BaseComponent } from '../Base'
import {
  PrimaryButton,
  PrimaryButtonAnchor,
  SecondaryButton,
  SecondaryButtonAnchor,
} from '../Button'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

export type Primary =
  | FunctionComponentElement<ComponentProps<typeof PrimaryButton>>
  | FunctionComponentElement<ComponentProps<typeof PrimaryButtonAnchor>>

export type Secondary =
  | FunctionComponentElement<ComponentProps<typeof SecondaryButton>>
  | FunctionComponentElement<ComponentProps<typeof SecondaryButtonAnchor>>

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

type Props = {
  description?: ReactNode
  primaryButton?: Primary
  secondaryButton?: Secondary
  tertiaryLinks?: Array<React.ComponentProps<typeof TertiaryLink>>
  zIndex?: number
  className?: string
}

export const BottomFixedArea: VFC<Props & ElementProps> = ({
  description,
  primaryButton,
  secondaryButton,
  tertiaryLinks,
  zIndex = 500,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  useEffect(() => {
    validateElement(primaryButton, secondaryButton)
  }, [primaryButton, secondaryButton])

  return (
    <Base
      themes={theme}
      zIndex={zIndex}
      className={`${className} ${classNames.wrapper}`}
      {...props}
    >
      {description && <Text className={classNames.description}>{description}</Text>}
      {(secondaryButton || primaryButton) && (
        <ButtonList themes={theme} className={classNames.buttonList}>
          {secondaryButton && <li className={classNames.secondaryButton}>{secondaryButton}</li>}
          {primaryButton && <li className={classNames.primaryButton}>{primaryButton}</li>}
        </ButtonList>
      )}
      {tertiaryLinks && tertiaryLinks.length > 0 && (
        <TertiaryList themes={theme} className={classNames.tertiaryList}>
          {tertiaryLinks.map((tertiaryLink, index) => (
            <li key={index} className={classNames.tertiaryListItem}>
              <TertiaryLink {...tertiaryLink} />
            </li>
          ))}
        </TertiaryList>
      )}
    </Base>
  )
}

const Base = styled(BaseComponent)<{ themes: Theme; zIndex: number }>`
  ${({ themes, zIndex }) => {
    const { pxToRem, space } = themes.size

    return css`
      display: flex;
      flex-direction: column;
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: ${pxToRem(space.S)};
      text-align: center;
      z-index: ${zIndex};
    `
  }}
`
const Text = styled.div`
  margin: 0;
`
const ButtonList = styled.ul<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      margin: ${pxToRem(space.XS)} 0 0 0;
      padding: 0;
      display: flex;
      justify-content: center;

      > li {
        list-style: none;
        margin-right: ${pxToRem(space.XS)};

        &:last-of-type {
          margin-right: 0;
        }
      }
    `
  }}
`
const TertiaryList = styled.ul<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      margin: ${pxToRem(space.XS)} 0 0 0;
      padding: 0;
      display: flex;
      justify-content: center;

      > li {
        list-style: none;
        margin-right: ${pxToRem(space.XS)};

        &:last-of-type {
          margin-right: 0;
        }
      }
    `
  }}
`
