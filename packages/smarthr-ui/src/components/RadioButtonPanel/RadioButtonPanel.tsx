'use client'

import {
  type ComponentProps,
  type ComponentType,
  type FC,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { Panel } from '../Panel'
import { RadioButton } from '../RadioButton'

type Props = ComponentProps<typeof RadioButton> & {
  as?: string | ComponentType<any>
  label: ReactNode
}

const classNameGenerator = tv({
  slots: {
    base: [
      'smarthr-ui-RadioButtonPanel',
      'shr-border-shorthand shr-cursor-pointer shr-list-none shr-shadow-none',
      'has-[:disabled]:shr-cursor-default',
      // FIX: なぜか storybook 上で :has が動作しないので重ねて書いている
      'has-[:focus-visible]:shr-focus-indicator [&:has(:focus-visible)]:shr-focus-indicator',
      '[&:has(:disabled)]:shr-text-disabled has-[:disabled]:[&_.smarthr-ui-RadioButtonPanel-description]:shr-text-disabled',
    ],
    radio: [
      '[&_.smarthr-ui-RadioButton-radioButton:focus-visible_+_span]:shr-focus-indicator-none',
      '[&_.smarthr-ui-RadioButton-label]:shr-ms-0.75',
    ],
    // RadioButtonPanel で指定している shr-ms-0.75 + RadioButton のボタンの shr-w-em を足して shr-ms-[1.75em] にしている
    description: ['smarthr-ui-RadioButtonPanel-description', 'shr-ms-[1.75em] shr-mt-0.5'],
  },
  variants: {
    hasDescription: {
      true: {
        base: 'shr-flex shr-flex-col',
        radio: 'shr-font-bold',
      },
    },
  },
})

/** RadioButtonのクリック可能な要素（labelまたはinput）を判定するための正規表現 */
const REGEX_RADIO_CLICKABLE_ELEMENT = /^(label|input)$/

/**
 * イベントパス内にRadioButtonの要素（LABELまたはINPUT）が含まれているか判定
 *
 * NOTE: ReactのSyntheticEventは非同期処理内でnullになる可能性があるため、
 * イベントオブジェクトではなく、事前に取得したpathとcurrentTargetを受け取る
 *
 * @param path イベントのcomposedPath（事前に取得したもの）
 * @param currentTarget イベントのcurrentTarget（事前に取得したもの）
 * @returns RadioButtonの要素がクリックされた場合true
 */
const isRadioButtonElementClicked = (path: EventTarget[], currentTarget: EventTarget): boolean => {
  for (const node of path) {
    // 先にLABELまたはINPUTをチェック（高頻度ケース）
    if (
      node instanceof HTMLElement &&
      REGEX_RADIO_CLICKABLE_ELEMENT.test(node.tagName.toLowerCase())
    ) {
      return true
    } else if (node === currentTarget) {
      // Base要素に到達したらfalse（低頻度ケース）
      return false
    }
  }

  return false
}

export const RadioButtonPanel: FC<Props> = ({
  onClick,
  as,
  className,
  children,
  label,
  'aria-describedby': ariaDescribedby,
  ...rest
}) => {
  const hasDescription = !!children
  const classNames = useMemo(() => {
    const { base, description, radio } = classNameGenerator({
      className,
      hasDescription,
    })

    return { base: base(), description: description(), radio: radio() }
  }, [className, hasDescription])

  // 外側の装飾を押しても内側のラジオボタンが押せるようにする
  const innerRef = useRef<HTMLInputElement>(null)
  const onDelegateClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // RadioButtonの要素（labelまたはinput）以外がクリックされた場合（description や Base の余白）
    if (!isRadioButtonElementClicked(e.nativeEvent.composedPath(), e.currentTarget)) {
      // Base要素のclickイベントは止める（実装の詳細を隠蔽し、input要素のclickのみを親に伝える）
      e.stopPropagation()
      // 手動でinputをクリック
      innerRef.current?.click()
    }
    // RadioButtonの要素（labelまたはinput）がクリックされた場合は何もしない
    // （ブラウザの標準動作でinputがクリックされ、そのイベントが親に伝わる）
  }, [])

  const descriptionId = useId()

  return (
    <Panel padding={1} onClick={onDelegateClick} as={as} className={classNames.base}>
      <RadioButton
        {...rest}
        onClick={onClick}
        ref={innerRef}
        aria-describedby={`${descriptionId}${ariaDescribedby ? ` ${ariaDescribedby}` : ''}`}
        className={classNames.radio}
      >
        {label}
      </RadioButton>
      {children && (
        <div id={descriptionId} className={classNames.description}>
          {children}
        </div>
      )}
    </Panel>
  )
}
