import { type ComponentPropsWithoutRef, type FC, type ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Base } from '../Base'
import { Cluster, Stack } from '../Layout'
import { ResponseMessage } from '../ResponseMessage'

import type { ResponseStatusWithoutProcessing } from '../../hooks/useResponseStatus'
import type { AbstractSize, CharRelativeSize } from '../../themes/createSpacing'
import type { Gap } from '../../types'

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-FloatArea shr-sticky shr-z-fixed-menu -shr-mx-0.5',
    mainButtonCluster: 'shr-ms-auto',
    responseMessageWrapper: 'shr-ms-auto',
  },
  variants: {
    bottom: {
      0: {
        wrapper: 'shr-bottom-0',
      },
      0.25: {
        wrapper: 'shr-bottom-0.25',
      },
      0.5: {
        wrapper: 'shr-bottom-0.5',
      },
      0.75: {
        wrapper: 'shr-bottom-0.75',
      },
      1: {
        wrapper: 'shr-bottom-1',
      },
      1.25: {
        wrapper: 'shr-bottom-1.25',
      },
      1.5: {
        wrapper: 'shr-bottom-1.5',
      },
      2: {
        wrapper: 'shr-bottom-2',
      },
      2.5: {
        wrapper: 'shr-bottom-2.5',
      },
      3: {
        wrapper: 'shr-bottom-3',
      },
      3.5: {
        wrapper: 'shr-bottom-3.5',
      },
      4: {
        wrapper: 'shr-bottom-4',
      },
      8: {
        wrapper: 'shr-bottom-8',
      },
      X3S: {
        wrapper: 'shr-bottom-0.25',
      },
      XXS: {
        wrapper: 'shr-bottom-0.5',
      },
      XS: {
        wrapper: 'shr-bottom-1',
      },
      S: {
        wrapper: 'shr-bottom-1.5',
      },
      M: {
        wrapper: 'shr-bottom-2',
      },
      L: {
        wrapper: 'shr-bottom-2.5',
      },
      XL: {
        wrapper: 'shr-bottom-3',
      },
      XXL: {
        wrapper: 'shr-bottom-3.5',
      },
      X3L: {
        wrapper: 'shr-bottom-4',
      },
    } as { [key in Gap]: { wrapper: string } },
  },
  defaultVariants: {
    bottom: 1.5,
  },
})

type Props = {
  /** 表示する `Button` または `AnchorButton` コンポーネント */
  primaryButton: ReactNode
  /** 表示する `Button` または `AnchorButton` コンポーネント */
  secondaryButton?: ReactNode
  /** tertiary 領域に表示するボタン */
  tertiaryButton?: ReactNode
  /** 操作に対するフィードバックメッセージ */
  responseStatus?: ResponseStatusWithoutProcessing
  /** コンポーネントの下端から、包含ブロックの下端までの間隔（基準フォントサイズの相対値または抽象値） */
  bottom?: CharRelativeSize | AbstractSize
  /** コンポーネントの `z-index` 値 */
  zIndex?: number
}
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

export const FloatArea: FC<Props & ElementProps> = ({
  primaryButton,
  secondaryButton,
  tertiaryButton,
  responseStatus,
  bottom,
  zIndex,
  style,
  className,
  ...rest
}) => {
  const classNames = useMemo(() => {
    const { wrapper, mainButtonCluster, responseMessageWrapper } = classNameGenerator({ bottom })

    return {
      wrapper: wrapper({ className }),
      mainButtonCluster: mainButtonCluster(),
      responseMessageWrapper: responseMessageWrapper(),
    }
  }, [bottom, className])
  const actualStyle = useMemo(() => ({ ...style, zIndex }), [style, zIndex])

  return (
    <Base {...rest} layer={3} padding={1} className={classNames.wrapper} style={actualStyle}>
      <Stack gap={0.5}>
        <Cluster>
          {tertiaryButton}
          <Cluster gap={1} className={classNames.mainButtonCluster}>
            {secondaryButton}
            {primaryButton}
          </Cluster>
        </Cluster>
        {responseStatus && (
          <p className={classNames.responseMessageWrapper}>
            <ResponseMessage type={responseStatus.status}>{responseStatus.text}</ResponseMessage>
          </p>
        )}
      </Stack>
    </Base>
  )
}
