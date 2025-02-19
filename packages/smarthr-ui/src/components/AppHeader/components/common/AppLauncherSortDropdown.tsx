import React, {
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  memo,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { textColor } from '../../../../themes'
import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon } from '../../../Icon'
import { useTranslate } from '../../hooks/useTranslate'
import { Launcher } from '../../types'
import { Translate } from '../common/Translate'

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-AppLauncher-SortDropdown-trigger',
      'shr-gap-0.25 shr-text-grey',
      '[&[aria-expanded="true"]>.smarthr-ui-Icon]:shr-rotate-180',
    ],
    contentBody: ['shr-px-0.25 shr-py-0.5', 'shr-flex-col shr-flex shr-items-stretch'],
    contentButton: [
      'shr-border-none shr-justify-start shr-py-0.75 shr-font-normal shr-pl-2.5',
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

  const translate = useTranslate()
  const translated = useMemo(
    () => ({
      label: translate('Launcher/sortDropdownLabel'),
      selected: translate('Launcher/sortDropdownSelected'),
      default: translate('Launcher/sortDropdownOrderDefault'),
      asc: translate('Launcher/sortDropdownOrderNameAsc'),
      desc: translate('Launcher/sortDropdownOrderNameDesc'),
    }),
    [translate],
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
