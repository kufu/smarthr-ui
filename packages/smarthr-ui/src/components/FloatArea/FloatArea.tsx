'use client'

import { type FC, type ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../../hooks/client/useEnvironment'
import { Cluster, Stack } from '../Layout'
import { Panel } from '../Panel'
import { ResponseMessage } from '../ResponseMessage'

import type { ResponseStatusWithoutProcessing } from '../../hooks/useResponseStatus'
import type { AbstractSize, CharRelativeSize } from '../../themes'
import type { SHRComponentPropsWithRef } from '../../types'

const classNameGenerator = tv({
  base: 'smarthr-ui-FloatArea shr-z-fixed-menu',
  variants: {
    sticky: {
      true: 'shr-sticky',
    },
    bottomFixed: {
      true: [
        // HINT: 画面幅いっぱいに広げるため、親の padding を打ち消してビューポート幅で表示する
        'shr-ms-[calc(50%-50vw)] shr-box-border shr-w-screen shr-rounded-none',
        // Layer 3 だが、上方向への指定のためベタ書き： https://smarthr.design/products/design-tokens/shadow/
        '[box-shadow:_0_-4px_8px_2px_rgba(0,_0,_0,_0.24)]',
        /* 仮想キーボードが出る入力要素にフォーカス中は、操作領域を確保するため固定を解除する
         * 対象は許可リストで指定し、checkbox・radio・date 系など対象外の type は固定を維持する
         * タッチ端末でキーボードだけ閉じるとフォーカスが残り、解除状態が続くが許容する */
        '[body:has(:is(input:is(:not([type]),[type=text],[type=email],[type=number],[type=password],[type=search],[type=tel],[type=url]),textarea,[contenteditable]):focus)_&]:shr-static',
      ],
      false: '-shr-mx-0.5',
    },
    bottom: {
      // HINT: Stack直下でもmargin-bottomがリセットされないように詳細度を上げる
      0: 'shr-bottom-0 [&&]:shr-mb-0',
      0.25: 'shr-bottom-0.25 [&&]:shr-mb-0.25',
      0.5: 'shr-bottom-0.5 [&&]:shr-mb-0.5',
      0.75: 'shr-bottom-0.75 [&&]:shr-mb-0.75',
      1: 'shr-bottom-1 [&&]:shr-mb-1',
      1.25: 'shr-bottom-1.25 [&&]:shr-mb-1.25',
      1.5: 'shr-bottom-1.5 [&&]:shr-mb-1.5',
      2: 'shr-bottom-2 [&&]:shr-mb-2',
      2.5: 'shr-bottom-2.5 [&&]:shr-mb-2.5',
      3: 'shr-bottom-3 [&&]:shr-mb-3',
      3.5: 'shr-bottom-3.5 [&&]:shr-mb-3.5',
      4: 'shr-bottom-4 [&&]:shr-mb-4',
      8: 'shr-bottom-8 [&&]:shr-mb-8',
      X3S: 'shr-bottom-0.25 [&&]:shr-mb-0.25',
      XXS: 'shr-bottom-0.5 [&&]:shr-mb-0.5',
      XS: 'shr-bottom-1 [&&]:shr-mb-1',
      S: 'shr-bottom-1.5 [&&]:shr-mb-1.5',
      M: 'shr-bottom-2 [&&]:shr-mb-2',
      L: 'shr-bottom-2.5 [&&]:shr-mb-2.5',
      XL: 'shr-bottom-3 [&&]:shr-mb-3',
      XXL: 'shr-bottom-3.5 [&&]:shr-mb-3.5',
      X3L: 'shr-bottom-4 [&&]:shr-mb-4',
    } as { [key in CharRelativeSize | AbstractSize]: string },
  },
})

type Props = SHRComponentPropsWithRef<
  'div',
  {
    /** 表示する `Button` または `AnchorButton` コンポーネント */
    primaryButton: ReactNode
    /** 表示する `Button` または `AnchorButton` コンポーネント */
    secondaryButton?: ReactNode
    /** tertiary 領域に表示するボタン */
    tertiaryButton?: ReactNode
    /** 操作に対するフィードバックメッセージ */
    responseStatus?: ResponseStatusWithoutProcessing
    /** コンポーネントの下端から、包含ブロックの下端までの間隔（基準フォントサイズの相対値または抽象値）。`fixedOnMobile` によりモバイルで下部固定されている間は無視されます */
    bottom?: CharRelativeSize | AbstractSize
    /** コンポーネントの `z-index` 値 */
    zIndex?: number
    /** モバイル時のみ画面下部に固定する。固定中は画面幅いっぱいに表示され、`bottom` は無視されます */
    fixedOnMobile?: boolean
  }
>

export const FloatArea: FC<Props> = ({
  primaryButton,
  secondaryButton,
  tertiaryButton,
  responseStatus,
  bottom,
  zIndex,
  fixedOnMobile,
  style,
  className,
  ...rest
}) => {
  const { mobile } = useEnvironment()
  const bottomFixed = mobile && !!fixedOnMobile
  const actualClassName = useMemo(
    () =>
      classNameGenerator({
        sticky: !mobile || bottomFixed,
        bottomFixed,
        bottom: bottomFixed ? 0 : (bottom ?? 1.5),
        className,
      }),
    [bottom, bottomFixed, className, mobile],
  )

  return (
    <Panel {...rest} layer={3} padding={1} className={actualClassName} style={{ ...style, zIndex }}>
      <Stack gap={0.5}>
        <Cluster>
          {tertiaryButton}
          <Cluster gap={1} className="shr-ms-auto">
            {secondaryButton}
            {primaryButton}
          </Cluster>
        </Cluster>
        {responseStatus && (
          <p className="shr-ms-auto">
            <ResponseMessage status={responseStatus.status}>{responseStatus.text}</ResponseMessage>
          </p>
        )}
      </Stack>
    </Panel>
  )
}
