import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import { withTheme, InjectedProps } from '../../hocs/withTheme'
import hoverable from '../../hocs/hoverable'
import { isTouchDevice } from '../../libs/ua'

type ButtonSize = 's' | 'm' | 'l'
interface Props extends React.Props<{}> {
  element?: 'button' | 'input' | 'a'
  onClick?: (e: any) => void
  disabled?: boolean
  to?: string
  size?: ButtonSize
  wide?: boolean
  style?: {}
}

const Button: React.SFC<Props & InjectedProps> = ({
  element,
  onClick,
  disabled = false,
  to = '',
  size = 'm',
  wide = false,
  theme,
  style = {},
  children,
}) => {
  if (element === 'button') {
    return (
      <Trigger
        onClick={onClick}
        disabled={disabled}
        theme={theme}
        size={size}
        wide={wide}
        style={style}
      >
        {children}
      </Trigger>
    )
  }

  if (element === 'input') {
    if (typeof children === 'string') {
      return (
        <Submit
          type="submit"
          value={children}
          disabled={disabled}
          theme={theme}
          size={size}
          wide={wide}
          style={style}
        />
      )
    } else {
      throw new Error('"children" must be type of string if "element" is "input".')
    }
  }

  if (element === 'a') {
    return (
      <Link href={to} onClick={onClick} theme={theme} size={size} wide={wide} style={style}>
        {children}
      </Link>
    )
  }

  return null
}

Button.propTypes = {
  element: PropTypes.oneOf(['button', 'input', 'a']).isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  to: PropTypes.string,
  size: PropTypes.oneOf(['s', 'm', 'l']),
  wide: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  style: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export default withTheme(Button)

interface Styles extends InjectedProps {
  size: ButtonSize
  wide: boolean
}
const sizeMap = {
  s: {
    padding: '5px 10px',
    fontSize: 14,
  },
  m: {
    padding: '10px 15px',
    fontSize: 16,
  },
  l: {
    padding: '15px 20px',
    fontSize: 18,
  },
}
const Base = styled.button`
  display: inline-block;
  box-sizing: border-box;
  width: ${({ wide }: Styles) => (wide ? '100%;' : 'auto')};
  margin: 0;
  padding: ${({ size }: Styles) => sizeMap[size].padding};
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }: Styles) => theme.palette.primary};
  color: ${({ theme }: Styles) => theme.palette.white};
  font-size: ${({ theme, size }: Styles) => theme.typography.pxToRem(sizeMap[size].fontSize)};
  line-height: 1;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  touch-action: manipulation;
  user-select: none;
  text-decoration: none;
  cursor: pointer;
  transition: ${isTouchDevice ? 'none' : 'background-color 0.3s ease-in-out'};

  &.hover {
    background-color: ${({ theme }: Styles) => theme.palette.primaryLight};
    color: ${({ theme }: Styles) => theme.palette.white};
    text-decoration: none;
  }

  &:focus {
    color: ${({ theme }: Styles) => theme.palette.white};
    text-decoration: none;
  }

  &[disabled] {
    background-color: ${({ theme }: Styles) => theme.palette.primaryLight};
    pointer-events: none;
  }
`
const Trigger: any = hoverable()(Base as any)
const Submit: any = hoverable()(Base.withComponent('input') as any)
const Link: any = hoverable()(Base.withComponent('a') as any)
