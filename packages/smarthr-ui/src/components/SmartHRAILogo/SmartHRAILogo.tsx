import { type ComponentPropsWithoutRef, memo, useMemo } from 'react'

type AbstractProps = {
  alt?: string
  width?: number | string
  height?: number | string
}
type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'svg'>, keyof AbstractProps>

export const SmartHRAILogo = memo<Props>(
  ({ alt = 'SmartHR（スマートHR） AI', width, height, fill, ...rest }) => {
    const style = useMemo(
      () => ({
        ...(width ? { width: convertValue(width) } : { height: convertValue(height || '1.5em') }),
      }),
      [height, width],
    )

    return (
      <svg
        {...rest}
        role="img"
        aria-label={alt}
        viewBox="0 0 53 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
      >
        <path
          fill="#00C4CC"
          d="M13.574 9.798a1.003 1.003 0 1 0-.66 1.894 2.782 2.782 0 0 1 1.863 2.625 2.782 2.782 0 0 1-2.78 2.779 2.781 2.781 0 0 1-2.625-1.866 1.003 1.003 0 0 0-1.895.658 4.79 4.79 0 0 0 4.52 3.214 4.79 4.79 0 0 0 4.786-4.786 4.79 4.79 0 0 0-3.21-4.519v.001Z"
        />
        <path
          fill="#00C4CC"
          d="M10.425 14.202a1.003 1.003 0 0 0 .66-1.894 2.782 2.782 0 0 1-1.863-2.625 2.782 2.782 0 0 1 2.78-2.779c1.181 0 2.237.75 2.625 1.866a1.003 1.003 0 0 0 1.895-.659 4.79 4.79 0 0 0-4.52-3.213 4.79 4.79 0 0 0-4.786 4.785 4.79 4.79 0 0 0 3.209 4.52v-.001Z"
        />
        <path
          fill="#00C4CC"
          d="M23.395 4.691A7.654 7.654 0 0 0 21.75 2.25 7.646 7.646 0 0 0 19.308.604 7.633 7.633 0 0 0 16.318 0H7.681A7.655 7.655 0 0 0 2.25 2.25 7.655 7.655 0 0 0 0 7.682v8.635a7.654 7.654 0 0 0 2.25 5.432A7.653 7.653 0 0 0 7.682 24h8.635a7.653 7.653 0 0 0 5.432-2.25A7.65 7.65 0 0 0 24 16.317V7.682a7.642 7.642 0 0 0-.604-2.99Zm-1.399 11.626a5.679 5.679 0 0 1-5.679 5.68H7.682a5.679 5.679 0 0 1-5.679-5.68V7.682a5.679 5.679 0 0 1 5.68-5.679h8.634a5.679 5.679 0 0 1 5.68 5.68v8.634Z"
        />
        <path
          fill="#23221F"
          d="M39.93 18.362h-6.57l-1.083 3.344a.42.42 0 0 1-.4.29h-3.565a.42.42 0 0 1-.395-.566l6.66-17.99a.42.42 0 0 1 .394-.275h3.334a.42.42 0 0 1 .394.274l6.685 17.99a.42.42 0 0 1-.394.567h-3.565a.42.42 0 0 1-.4-.29l-1.095-3.344Zm-1.1-3.388-2.185-6.455-2.173 6.455h4.358ZM48.46 21.576V3.586a.42.42 0 0 1 .421-.42h3.35a.42.42 0 0 1 .42.42v17.99a.42.42 0 0 1-.42.42h-3.35a.42.42 0 0 1-.42-.42Z"
        />
        <path
          fill="url(#a)"
          d="M39.93 18.362h-6.57l-1.083 3.344a.42.42 0 0 1-.4.29h-3.565a.42.42 0 0 1-.395-.566l6.66-17.99a.42.42 0 0 1 .394-.275h3.334a.42.42 0 0 1 .394.274l6.685 17.99a.42.42 0 0 1-.394.567h-3.565a.42.42 0 0 1-.4-.29l-1.095-3.344Zm-1.1-3.388-2.185-6.455-2.173 6.455h4.358Z"
        />
        <path
          fill="url(#b)"
          d="M48.46 21.576V3.586a.42.42 0 0 1 .421-.42h3.35a.42.42 0 0 1 .42.42v17.99a.42.42 0 0 1-.42.42h-3.35a.42.42 0 0 1-.42-.42Z"
        />
        <path
          fill="url(#c)"
          d="m52.649 3.586-4.188 11.388V3.586a.42.42 0 0 1 .42-.42h3.347a.42.42 0 0 1 .42.42h.001Z"
          style={{ mixBlendMode: 'screen' }}
        />
        <path
          fill="url(#d)"
          d="M48.46 14.974v6.602c0 .232.19.42.421.42h1.475l2.295-7.023V3.585l-4.19 11.388Z"
          style={{ mixBlendMode: 'multiply' }}
        />
        <path
          fill="url(#e)"
          d="m38.83 14.974-2.185-6.455 1.6-5.041a.246.246 0 0 1 .462-.019l2.072 5.578-1.949 5.937Z"
          style={{ mixBlendMode: 'multiply' }}
        />
        <defs>
          <linearGradient
            id="a"
            x1="32.185"
            x2="52.716"
            y1="6.706"
            y2="21.623"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".1" stopColor="#00C4CC" />
            <stop offset=".66" stopColor="#6D00CC" />
            <stop offset="1" stopColor="#CC00C5" />
          </linearGradient>
          <linearGradient
            id="b"
            x1="32.186"
            x2="52.717"
            y1="6.706"
            y2="21.623"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".1" stopColor="#00C4CC" />
            <stop offset=".66" stopColor="#6D00CC" />
            <stop offset="1" stopColor="#CC00C5" />
          </linearGradient>
          <linearGradient
            id="c"
            x1="51.943"
            x2="46.463"
            y1="10.181"
            y2="6.2"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6D00CC" stopOpacity="0" />
            <stop offset="1" stopColor="#6D00CC" />
          </linearGradient>
          <linearGradient
            id="d"
            x1="49.239"
            x2="53.091"
            y1="12.348"
            y2="13.489"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6D00CC" />
            <stop offset="1" stopColor="#CC00C5" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="e"
            x1="36.639"
            x2="40.581"
            y1="8.538"
            y2="9.706"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0F7F85" />
            <stop offset=".9" stopColor="#0F7F85" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
)

const convertValue = (value: number | string) => (typeof value === 'string' ? value : `${value}px`)
