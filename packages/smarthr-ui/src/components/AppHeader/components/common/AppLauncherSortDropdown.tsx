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

import { useIntl } from '../../../../intl'
import { textColor } from '../../../../themes'
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

  const { localize } = useIntl()
  const translated = useMemo(
    () => ({
      label: localize({
        id: 'smarthr-ui/AppHeader/Launcher/sortDropdownLabel',
        defaultText: '表示順',
      }),
      selected: localize({
        id: 'smarthr-ui/AppHeader/Launcher/sortDropdownSelected',
        defaultText: '選択中',
      }),
      default: localize({
        id: 'smarthr-ui/AppHeader/Launcher/sortDropdownOrderDefault',
        defaultText: 'デフォルト',
      }),
      asc: localize({
        id: 'smarthr-ui/AppHeader/Launcher/sortDropdownOrderNameAsc',
        defaultText: 'アプリ名の昇順',
      }),
      desc: localize({
        id: 'smarthr-ui/AppHeader/Launcher/sortDropdownOrderNameDesc',
        defaultText: 'アプリ名の降順',
      }),
    }),
    [localize],
  )

  const options = useMemo(
    () => [
      ['default', translated.default],
      ['name/asc', translated.asc],
      ['name/desc', translated.desc],
    ],
    [translated],
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
        {translated.label}
      </TriggerButton>
      <DropdownContent controllable>
        <div role="listbox" className={classNames.contentBody}>
          {options.map(([value, children], i) => (
            <OptionButton
              key={i}
              value={value}
              selected={value === sortType}
              selectedAlt={translated.selected}
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
      size="s"
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
    selectedAlt: string
    onClick: (e: MouseEvent<HTMLButtonElement>) => void
    className: string
  }>
>(({ value, selected, selectedAlt, onClick, children, className }) => (
  <Button
    value={value}
    role="option"
    aria-selected={selected}
    className={className}
    prefix={
      selected && <FaCheckIcon color={textColor.main} alt={<Translate>{selectedAlt}</Translate>} />
    }
    onClick={onClick}
  >
    <Translate>{children}</Translate>
  </Button>
))
