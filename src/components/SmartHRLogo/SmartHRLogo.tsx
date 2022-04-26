import React, { HTMLAttributes, VFC, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  /** コンポーネントのタイトル */
  title?: string
  /** コンポーネントの幅 */
  width?: number
  /** コンポーネントの高さ */
  height?: number
  /** ロゴの色 */
  fill?: 'white' | 'brand' | 'black'
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

export const SmartHRLogo: VFC<Props & ElementProps> = ({
  title = 'SmartHR',
  width = 150,
  height = 27,
  fill = 'white',
  className = '',
  ...props
}) => {
  const classNames = useClassNames()
  const theme = useTheme()

  const fillColor = useMemo(() => {
    switch (fill) {
      case 'white':
        return theme.color.WHITE
      case 'brand':
        return theme.color.BRAND
      case 'black':
        return '#000000'
    }
  }, [fill, theme.color])

  return (
    <Wrapper
      {...props}
      $width={width}
      $height={height}
      $fill={fillColor}
      className={`${className} ${classNames.wrapper}`}
    >
      <svg role="img" viewBox="0, 0, 100, 19" width={width} height={height} aria-label={title}>
        <path
          fillRule="evenodd"
          d="M65.924 6.442c-.172-.03-.372-.047-.6-.047-.487 0-.867.047-1.305.297-.397.227-.71.48-.968.948l-.068-.767a.31.31 0 0 0-.31-.288h-2.18a.31.31 0 0 0-.311.311v9.642a.31.31 0 0 0 .311.311h2.337a.31.31 0 0 0 .311-.311v-5.81c0-.485.334-1.092.716-1.37.348-.254.738-.43 1.266-.476.147-.013.377-.003.688.026.18.017.338-.124.34-.306l.03-1.847c.002-.155-.11-.285-.26-.312h0zm7.065 8.15l-.453.02c-.38 0-.648-.073-.806-.218s-.237-.42-.237-.825V8.91h1.406a.31.31 0 0 0 .311-.311v-1.89a.31.31 0 0 0-.311-.311h-1.406v-2.04a.31.31 0 0 0-.311-.311h-2.337a.31.31 0 0 0-.311.311v2.04H67.44a.31.31 0 0 0-.311.311v1.89a.31.31 0 0 0 .311.311h1.093v5.018c0 1.075.264 1.863.792 2.362s1.29.75 2.28.75c.545 0 1.047-.066 1.507-.197.13-.037.22-.162.22-.3V14.9c0-.185-.16-.326-.344-.31h0zm-18.127-.033c-.307.174-.662.26-1.067.26-.36 0-.65-.096-.868-.29s-.327-.444-.327-.754c0-.443.152-.808.455-1.096s.77-.432 1.404-.432h1.063v1.68c-.133.247-.353.457-.66.63h0zm1.613-7.75c-.63-.275-1.352-.413-2.168-.413-.88 0-1.656.146-2.33.436s-1.192.7-1.556 1.195a2.82 2.82 0 0 0-.526 1.346c-.02.183.127.343.31.343h2.342c.152 0 .273-.114.3-.264a.98.98 0 0 1 .325-.595c.23-.2.555-.3.972-.3.468 0 .814.128 1.04.384s.337.615.337 1.077v.56h-1.1c-1.58 0-2.772.293-3.572.878s-1.2 1.418-1.2 2.5c0 .588.155 1.118.465 1.59s.73.838 1.262 1.1a3.91 3.91 0 0 0 1.755.393c1.075 0 1.923-.367 2.542-1.1v.6a.31.31 0 0 0 .311.311h2.204a.31.31 0 0 0 .311-.311l.001-6.5c0-.8-.18-1.457-.536-2.002s-.85-.953-1.48-1.228h0zm39.62 1.786c-.354.314-.87.47-1.546.47h-2.2V5.508h2.2c.683 0 1.2.157 1.55.47s.526.753.526 1.316c0 .552-.177.985-.53 1.3h0zm3.87 7.803l-2.7-5.287c.8-.36 1.395-.85 1.812-1.47s.626-1.43.626-2.43c0-.898-.207-1.66-.62-2.282s-1.01-1.094-1.784-1.413-1.693-.48-2.756-.48H89.57a.31.31 0 0 0-.311.311v13.19a.31.31 0 0 0 .311.311h2.46a.31.31 0 0 0 .311-.311v-4.955h1.903l2.564 5.096a.31.31 0 0 0 .278.171h2.6c.233 0 .383-.246.277-.453h0zM86.707 3.02h-2.454c-.172 0-.312.14-.312.312v5.732H78.7V3.332c0-.172-.14-.312-.312-.312h-2.463c-.172 0-.312.14-.312.312v13.205c0 .172.14.312.312.312h2.463c.172 0 .312-.14.312-.312v-4.994h5.243v4.994c0 .172.14.312.312.312h2.454c.172 0 .312-.14.312-.312V3.332c0-.172-.14-.312-.312-.312h0zm-78.98 8.34c.08.028.164.042.245.042.307 0 .595-.192.702-.5.135-.388-.07-.812-.457-.947a2.06 2.06 0 0 1 .678-4.005 2.06 2.06 0 0 1 1.946 1.383c.135.388.56.593.946.458s.593-.56.458-.946a3.55 3.55 0 0 0-6.896 1.165 3.55 3.55 0 0 0 2.378 3.349h0zM44.89 6.395c-.67 0-1.262.135-1.774.403a3.44 3.44 0 0 0-1.271 1.153c-.246-.525-.598-.915-1.053-1.172s-1-.384-1.632-.384c-.626 0-1.186.117-1.68.35a3.45 3.45 0 0 0-1.252 1.006l-.072-.88a.31.31 0 0 0-.31-.286h-2.18a.31.31 0 0 0-.311.311v9.642a.31.31 0 0 0 .311.311h2.337a.31.31 0 0 0 .311-.311v-6.42c.165-.284.376-.504.636-.66s.563-.232.91-.232c.316 0 .575.043.778.128s.357.245.465.48.16.563.16.986v5.72a.31.31 0 0 0 .311.311h2.337a.31.31 0 0 0 .311-.311V10.23c.152-.316.357-.563.617-.74s.572-.266.94-.266c.316 0 .574.043.773.128s.353.244.46.475.16.555.16.972v5.738a.31.31 0 0 0 .311.311h2.347a.31.31 0 0 0 .311-.311V10.36c0-1.404-.283-2.416-.85-3.036s-1.368-.93-2.405-.93h0zm-28.6 6.533a4.21 4.21 0 0 1-4.208 4.209h-6.4a4.21 4.21 0 0 1-4.209-4.209v-6.4A4.21 4.21 0 0 1 5.693 2.32h6.4a4.21 4.21 0 0 1 4.208 4.208v6.4zm-.183-10.425a5.67 5.67 0 0 0-1.809-1.219 5.66 5.66 0 0 0-2.217-.448h-6.4a5.66 5.66 0 0 0-2.217.448 5.67 5.67 0 0 0-1.809 1.219c-.522.522-.933 1.13-1.22 1.81A5.66 5.66 0 0 0 0 6.529v6.4a5.66 5.66 0 0 0 .448 2.217 5.67 5.67 0 0 0 1.22 1.809 5.67 5.67 0 0 0 1.809 1.219 5.66 5.66 0 0 0 2.217.448h6.4a5.66 5.66 0 0 0 2.217-.448 5.67 5.67 0 0 0 1.809-1.219c.522-.522.933-1.13 1.22-1.81a5.66 5.66 0 0 0 .448-2.217v-6.4a5.66 5.66 0 0 0-.448-2.217c-.287-.678-.697-1.287-1.22-1.81h0zm-6.06 5.594c-.388-.135-.812.07-.947.457s.07.812.457.947a2.06 2.06 0 0 1-.678 4.005 2.06 2.06 0 0 1-1.946-1.383c-.135-.388-.56-.593-.946-.458s-.593.558-.458.946a3.55 3.55 0 0 0 6.896-1.165 3.55 3.55 0 0 0-2.378-3.349h0zm18.992.743l-2.016-.8c-1.193-.467-2.055-.805-2.055-1.632s.687-1.314 1.84-1.314c.97 0 1.802.272 2.72.9a.31.31 0 0 0 .416-.065l1.237-1.557c.105-.132.084-.322-.043-.433-1.157-1.006-2.746-1.598-4.33-1.598-2.928 0-5.136 1.832-5.136 4.262 0 2.457 2.003 3.52 2.864 3.86l2.096.882c1.12.468 1.86.778 1.86 1.63 0 .513-.26 1.373-1.994 1.373-1.014 0-2.236-.47-3.267-1.247-.133-.1-.32-.082-.424.046l-1.443 1.757a.31.31 0 0 0 .038.434c1.38 1.136 3.186 1.782 5.02 1.782 3.716 0 5.408-2.3 5.408-4.417 0-1.87-.886-3.097-2.787-3.86h0z"
        />
      </svg>
    </Wrapper>
  )
}

const Wrapper = styled.figure<{ $width: number; $height: number; $fill: string }>`
  ${({ $width, $height, $fill }) => {
    return css`
      display: inline-block;
      margin: 0;
      padding: 0;
      width: ${$width}px;
      height: ${$height}px;

      > svg {
        display: inline-block;
        fill: ${$fill};
      }
    `
  }}
`
