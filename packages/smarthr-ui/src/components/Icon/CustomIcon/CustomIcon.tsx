import {
  type ComponentType,
  type ReactElement,
  type SVGProps,
  isValidElement,
  useMemo,
} from 'react'
import { renderToString } from 'react-dom/server'

import { type Props as IconProps, generateIcon } from '../generateIcon'

type SvgIconType = ComponentType<SVGProps<SVGSVGElement>>
type BaseSvgProps = SVGProps<SVGSVGElement>

type Props = IconProps & {
  icon: SvgIconType | ReactElement<BaseSvgProps>
}

const joinClassName = (a?: string, b?: string) => [a, b].filter(Boolean).join(' ') || undefined

const validateSvgComponent = (Component: SvgIconType): boolean => {
  try {
    const rendered = renderToString(<Component />)
    return rendered.startsWith('<svg')
  } catch {
    return false
  }
}

export const CustomIcon = ({ icon, ...rest }: Props) => {
  // iconのpropがReactElementかどうかを判定する処理をする。
  // TSの型チェックでは、ReactElementの型はJSX.Elementに上書きされるため、JSX.Elementの型情報を保持するために、propsとして渡す必要があります。
  const isValid = isValidElement<BaseSvgProps>(icon)

  // TSの型チェックを出来ないために、Lintingに出ない。そのために、ランタイムチェックを行います.
  if (process.env.NODE_ENV !== 'production') {
    if (isValid) {
      if (icon.type !== 'svg') {
        throw Error(
          `[CustomIcon] Expected the icon prop to be either a React component or an SVG JSX element, ` +
            `but received "${String(icon.type)}".` +
            `Ensure the icon prop is a React component that renders a valid SVG element or a JSX SVG element.`,
        )
      }
    } else if (typeof icon === 'function' && !validateSvgComponent(icon)) {
      throw Error(
        `[CustomIcon] Expected the icon prop to be either a React component or an SVG JSX element, ` +
          `but received "${typeof icon}". ` +
          `Ensure the icon prop is a React component that renders a valid SVG element or a JSX SVG element.`,
      )
    } else if (typeof icon !== 'function') {
      throw Error(
        `[CustomIcon] Expected the icon prop to be either a React component or an SVG JSX element, ` +
          `but received "${typeof icon}". ` +
          `Ensure the icon prop is a React component that renders a valid SVG element or a JSX SVG element.`,
      )
    }
  }

  const Icon = useMemo(() => {
    const svgElement = isValid ? icon : (icon as () => ReactElement<BaseSvgProps>)()
    const { type: SvgType, props: baseProps } = svgElement

    return generateIcon((iconProps) => {
      const props = iconProps as BaseSvgProps
      return (
        <SvgType
          {...baseProps}
          {...props}
          className={joinClassName(baseProps.className, props.className)}
        />
      )
    })
  }, [icon, isValid])

  return <Icon {...rest} />
}
