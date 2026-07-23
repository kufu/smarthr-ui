'use client'

import {
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  type RefObject,
  memo,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { useTheme } from '../../../../hooks/useTheme'
import { Localizer } from '../../../../intl'
import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon } from '../../../Icon'
import { Translate } from '../common/Translate'

import type { Launcher } from '../../types'

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-AppLauncher-SortDropdown-trigger',
      'shr-gap-0.25 shr-text-grey',
      '[&[aria-expanded="true"]_.smarthr-ui-Icon]:shr-rotate-180',
    ],
    contentBody: ['shr-px-0.25 shr-py-0.5', 'shr-flex shr-flex-col shr-items-stretch'],
    contentButton: [
      'shr-justify-start shr-border-none shr-py-0.75 shr-pl-2.5 shr-font-normal',
      'aria-selected:shr-pl-1',
    ],
  },
})

type Props = {
  sortType: Launcher['sortType']
  onSelectSortType: (sortType: Launcher['sortType']) => void
}

export const AppLauncherSortDropdown: FC<Props> = ({ sortType, onSelectSortType }) => {
  const triggerRef = useRef<HTMLButtonElement>(null)

  const classNames = useMemo(() => {
    const { trigger, contentBody, contentButton } = classNameGenerator()

    return {
      trigger: trigger(),
      contentBody: contentBody(),
      contentButton: contentButton(),
    }
  }, [])

  const options = useMemo<Array<[Launcher['sortType'], JSX.Element]>>(
    () => [
      [
        'default',
        <Localizer
          key="default"
          id="smarthr-ui/AppHeader/Launcher/sortDropdownOrderDefault"
          defaultText="デフォルト"
        />,
      ],
      [
        'name/asc',
        <Localizer
          key="name/asc"
          id="smarthr-ui/AppHeader/Launcher/sortDropdownOrderNameAsc"
          defaultText="アプリ名の昇順"
        />,
      ],
      [
        'name/desc',
        <Localizer
          key="name/desc"
          id="smarthr-ui/AppHeader/Launcher/sortDropdownOrderNameDesc"
          defaultText="アプリ名の降順"
        />,
      ],
    ],
    [],
  )

  const onClickOption = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onSelectSortType(e.currentTarget.value as Launcher['sortType'])

      // Dropdown がネストしており、この Dropdown のみ閉じて親の Dropdown は開いたままというのができない
      // そのため、無理矢理クリックイベントを発生させて実現している
      setTimeout(() => {
        if (triggerRef.current) {
          triggerRef.current.click()
          triggerRef.current.focus()
        }
      }, 0)
    },
    [onSelectSortType],
  )

  return (
    <Dropdown>
      <TriggerButton triggerRef={triggerRef} className={classNames.trigger}>
        <Localizer id="smarthr-ui/AppHeader/Launcher/sortDropdownLabel" defaultText="表示順" />
      </TriggerButton>
      <DropdownContent controllable>
        <div role="listbox" className={classNames.contentBody}>
          {options.map(([value, children], i) => (
            <OptionButton
              key={i}
              value={value}
              selected={value === sortType}
              onClick={onClickOption}
              className={classNames.contentButton}
            >
              {children}
            </OptionButton>
          ))}
        </div>
      </DropdownContent>
    </Dropdown>
  )
}

const TriggerButton = memo<
  PropsWithChildren<{ triggerRef: RefObject<HTMLButtonElement>; className: string }>
>(({ triggerRef, children, className }) => (
  <DropdownTrigger>
    <Button
      ref={triggerRef}
      size="S"
      variant="text"
      suffix={<FaCaretDownIcon />}
      className={className}
    >
      <Translate>{children}</Translate>
    </Button>
  </DropdownTrigger>
))

const OptionButton = memo<
  PropsWithChildren<{
    value: string
    selected: boolean
    onClick: (e: MouseEvent<HTMLButtonElement>) => void
    className: string
  }>
>(({ value, selected, onClick, children, className }) => {
  const theme = useTheme()
  return (
    <Button
      value={value}
      role="option"
      aria-selected={selected}
      className={className}
      prefix={
        selected && (
          <FaCheckIcon
            color={theme.textColor.main}
            alt={
              <Translate>
                <Localizer
                  id="smarthr-ui/AppHeader/Launcher/sortDropdownSelected"
                  defaultText="選択中"
                />
              </Translate>
            }
          />
        )
      }
      onClick={onClick}
    >
      <Translate>{children}</Translate>
    </Button>
  )
})
