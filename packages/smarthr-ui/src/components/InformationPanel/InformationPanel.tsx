'use client'

import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'
import { useIntl } from '../../intl'
import { Base, type BaseElementProps } from '../Base'
import { Button } from '../Button'
import { Heading, type HeadingTagTypes } from '../Heading'
import {
  FaCaretDownIcon,
  FaCaretUpIcon,
  FaCircleCheckIcon,
  FaCircleExclamationIcon,
  FaCircleInfoIcon,
  FaRotateIcon,
  WarningIcon,
} from '../Icon'
import { Sidebar } from '../Layout'

type ObjectHeadingType = {
  text: ReactNode
  /**
   * 可能な限り利用せず、SectioningContent(Article, Aside, Nav, Section)を使ってInformationPanel全体を囲むことで、InformationPanelのheadingのレベルを調整する方法を検討してください
   */
  unrecommendedTag?: HeadingTagTypes
}
type HeadingType = ReactNode | ObjectHeadingType
type AbstractProps = PropsWithChildren<{
  /** パネルのタイトル */
  heading: HeadingType
  /** `true` のとき、開閉ボタンを表示する */
  toggleable?: boolean
  /** 開閉ボタン押下時に発火するコールバック関数 */
  onClickTrigger?: (active: boolean) => void
}> &
  VariantProps<typeof classNameGenerator>

type Props = AbstractProps & Omit<BaseElementProps, keyof AbstractProps>

const headingObjectConverter = (text: ReactNode) => ({ text })

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-InformationPanel shr-shadow-layer-3',
    header: 'shr-p-1.5',
    heading: 'smarthr-ui-InformationPanel-heading',
    toggleableButton: 'smarthr-ui-InformationPanel-closeButton -shr-my-0.5 shr-ms-auto',
    content: [
      'smarthr-ui-InformationPanel-content',
      'shr-p-1.5 shr-pt-0 shr-text-base aria-hidden:shr-hidden',
    ],
  },
  variants: {
    type: {
      success: {},
      info: {},
      warning: {},
      error: {},
      sync: {},
    },
    active: {
      true: {},
      false: {
        header: 'shr-py-1',
      },
    },
    bold: {
      true: {
        header: 'shr-py-1',
        content: 'shr-pt-1',
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      type: ['success', 'warning', 'error'],
      bold: true,
      className: {
        header: 'shr-text-white',
        heading: '[&_.smarthr-ui-Icon]:shr-fill-white',
      },
    },
    {
      type: 'success',
      bold: true,
      className: {
        header: 'shr-bg-main',
      },
    },
    {
      type: 'warning',
      bold: true,
      className: {
        header: 'shr-bg-warning-yellow shr-text-black',
        heading: [
          '[&_.smarthr-ui-WarningIcon-wrapper]:shr-fill-black',
          '[&_.smarthr-ui-WarningIcon-mark]:shr-fill-warning-yellow',
        ],
      },
    },
    {
      type: 'error',
      bold: true,
      className: {
        header: 'shr-bg-danger',
      },
    },
  ],
})

export const InformationPanel: FC<Props> = ({
  heading,
  type = 'info',
  toggleable,
  active: activeProps = true,
  bold,
  className,
  children,
  onClickTrigger,
  ...rest
}) => {
  const [active, setActive] = useState(activeProps)
  const id = useId()
  const contentId = `${id}-content`

  useEffect(() => {
    setActive(activeProps)
  }, [activeProps])

  const classNamesMapper = useMemo(() => {
    const withActive = classNameGenerator({
      type,
      active: true,
      bold,
    })
    const withInactive = classNameGenerator({
      type,
      active: false,
      bold,
    })

    const wrapperProps = { className }

    return {
      active: {
        wrapper: withActive.wrapper(wrapperProps),
        header: withActive.header(),
        heading: withActive.heading(),
        toggleableButton: withActive.toggleableButton(),
        content: withActive.content(),
      },
      inactive: {
        wrapper: withInactive.wrapper(wrapperProps),
        header: withInactive.header(),
        heading: withInactive.heading(),
        toggleableButton: withInactive.toggleableButton(),
        content: withInactive.content(),
      },
    }
  }, [bold, type, className])

  const classNames = classNamesMapper[active ? 'active' : 'inactive']

  return (
    <Base {...rest} overflow="hidden" as="section" className={classNames.wrapper}>
      <Sidebar align="baseline" right className={classNames.header}>
        <MemoizedHeading
          heading={heading}
          id={`${id}-heading`}
          className={classNames.heading}
          type={type}
        />
        {toggleable && (
          <ToggleableButton
            active={active}
            onClickTrigger={onClickTrigger}
            setActive={setActive}
            contentId={contentId}
            className={classNames.toggleableButton}
          />
        )}
      </Sidebar>
      <div id={contentId} aria-hidden={!active} className={classNames.content}>
        {children}
      </div>
    </Base>
  )
}

const MemoizedHeading = memo<
  Required<Pick<Props, 'type'>> & {
    heading: Props['heading']
    id: string
    className: string
  }
>(({ type, heading: orgHeading, ...rest }) => {
  const heading = useObjectAttributes<HeadingType, ObjectHeadingType>(
    orgHeading,
    headingObjectConverter,
  )

  const icon = useMemo(() => {
    switch (type) {
      case 'info':
        return <FaCircleInfoIcon color="TEXT_GREY" />
      case 'success':
        return <FaCircleCheckIcon color="MAIN" />
      case 'warning':
        return <WarningIcon />
      case 'error':
        return <FaCircleExclamationIcon color="DANGER" />
      case 'sync':
        return <FaRotateIcon color="MAIN" />
    }
  }, [type])

  return (
    <Heading
      {...rest}
      // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
      unrecommendedTag={heading.unrecommendedTag}
      icon={{
        prefix: icon,
        gap: 0.5,
      }}
      type="blockTitle"
    >
      {heading.text}
    </Heading>
  )
})

const ToggleableButton: FC<
  Pick<Props, 'onClickTrigger'> & {
    active: boolean
    setActive: (flg: boolean) => void
    contentId: string
    className: string
  }
> = ({ active, onClickTrigger, setActive, contentId, className }) => {
  const { localize } = useIntl()

  const buttonLabels = useMemo(
    () => ({
      open: localize({
        id: 'smarthr-ui/InformationPanel/openButtonLabel',
        defaultText: '開く',
      }),
      close: localize({
        id: 'smarthr-ui/InformationPanel/closeButtonLabel',
        defaultText: '閉じる',
      }),
    }),
    [localize],
  )

  const onClick = useMemo(
    () => (onClickTrigger ? () => onClickTrigger(active) : () => setActive(!active)),
    [active, onClickTrigger, setActive],
  )

  return (
    <Button
      aria-expanded={active}
      aria-controls={contentId}
      onClick={onClick}
      suffix={active ? <FaCaretUpIcon /> : <FaCaretDownIcon />}
      size="S"
      className={className}
    >
      {active ? buttonLabels.close : buttonLabels.open}
    </Button>
  )
}
