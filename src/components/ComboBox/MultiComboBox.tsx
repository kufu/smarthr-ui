import React, {
  ComponentPropsWithoutRef,
  InputHTMLAttributes,
  KeyboardEvent,
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import { useId } from '../../hooks/useId'
import { useOuterClick } from '../../hooks/useOuterClick'
import { Theme, useTheme } from '../../hooks/useTheme'
import { FaCaretDownIcon } from '../Icon'

import { ComboBoxContext } from './ComboBoxContext'
import { MultiSelectedItem } from './MultiSelectedItem'
import { hasParentElementByClassName } from './multiComboBoxHelper'
import { BaseProps, ComboBoxItem } from './types'
import { useMultiComboBoxClassNames } from './useClassNames'
import { useFocusControl } from './useFocusControl'
import { useListBox } from './useListBox'
import { useOptions } from './useOptions'

import type { DecoratorsType } from '../../types'

type Props<T> = BaseProps<T> & {
  /**
   * 選択されているアイテムのリスト
   */
  selectedItems: Array<ComboBoxItem<T> & { deletable?: boolean }>
  /**
   * 選択されているアイテムのラベルを省略表示するかどうか
   */
  selectedItemEllipsis?: boolean
  /**
   * テキストボックスの `value` 属性の値。
   * `onChangeInput` と併せて設定することで、テキストボックスの挙動が制御可能になる。
   */
  inputValue?: string
  /**
   * 選択されているアイテムの削除ボタンがクリックされた時に発火するコールバック関数
   */
  onDelete?: (item: ComboBoxItem<T>) => void
  /**
   * 選択されているアイテムのリストが変わった時に発火するコールバック関数
   */
  onChangeSelected?: (selectedItems: Array<ComboBoxItem<T>>) => void
  /**
   * コンポーネントがフォーカスされたときに発火するコールバック関数
   */
  onFocus?: () => void
  /**
   * コンポーネントからフォーカスが外れた時に発火するコールバック関数
   */
  onBlur?: () => void
  /**
   * コンポーネント内のテキストを変更する関数/
   */
  decorators?: DecoratorsType<'noResultText'> & {
    destroyButtonIconAlt?: (text: string) => string
    selectedListAriaLabel?: (text: string) => string
  }
  /**
   * input 要素の属性
   */
  inputAttributes?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'name'
    | 'disabled'
    | 'required'
    | 'type'
    | 'aria-activedescendant'
    | 'aria-autocomplete'
    | 'aria-controls'
    | 'aria-disabled'
    | 'aria-expanded'
    | 'aria-haspopup'
    | 'aria-invalid'
    | 'autoComplete'
    | 'className'
    | 'onChange'
    | 'onCompositionEnd'
    | 'onCompositionStart'
    | 'onFocus'
    | 'onKeyDown'
    | 'ref'
    | 'role'
    | 'tabIndex'
    | 'value'
  >
}

type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props<unknown>>

const SELECTED_LIST_ARIA_LABEL = '選択済みアイテム'

const ActualMultiComboBox = <T,>(
  {
    items,
    selectedItems,
    name,
    disabled = false,
    required = false,
    error = false,
    creatable = false,
    placeholder = '',
    dropdownHelpMessage,
    isLoading,
    selectedItemEllipsis,
    width = 'auto',
    dropdownWidth = 'auto',
    inputValue: controlledInputValue,
    className = '',
    onChange,
    onChangeInput,
    onAdd,
    onDelete,
    onSelect,
    onChangeSelected,
    onFocus,
    onBlur,
    onKeyPress,
    decorators,
    inputAttributes,
    ...props
  }: Props<T> & ElementProps,
  ref: Ref<HTMLInputElement>,
) => {
  const theme = useTheme()
  const classNames = useMultiComboBoxClassNames()
  const outerRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const isInputControlled = useMemo(
    () => controlledInputValue !== undefined,
    [controlledInputValue],
  )
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState('')
  const inputValue = isInputControlled ? controlledInputValue : uncontrolledInputValue
  const [isComposing, setIsComposing] = useState(false)
  const { options } = useOptions({
    items,
    selected: selectedItems,
    creatable,
    inputValue,
  })
  const handleDelete = useCallback(
    (item: ComboBoxItem<T>) => {
      // HINT: Dropdown系コンポーネント内でComboBoxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
      // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
      requestAnimationFrame(() => {
        onDelete && onDelete(item)
        onChangeSelected &&
          onChangeSelected(
            selectedItems.filter(
              (selected) => selected.label !== item.label || selected.value !== item.value,
            ),
          )
      })
    },
    [onChangeSelected, onDelete, selectedItems],
  )
  const handleSelect = useCallback(
    (selected: ComboBoxItem<T>) => {
      // HINT: Dropdown系コンポーネント内でComboBoxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
      // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
      requestAnimationFrame(() => {
        const matchedSelectedItem = selectedItems.find(
          (item) => item.label === selected.label && item.value === selected.value,
        )
        if (matchedSelectedItem !== undefined) {
          if (matchedSelectedItem.deletable !== false) {
            handleDelete(selected)
          }
        } else {
          onSelect && onSelect(selected)
          onChangeSelected && onChangeSelected(selectedItems.concat(selected))
        }
      })
    },
    [handleDelete, onChangeSelected, onSelect, selectedItems],
  )

  const {
    renderListBox,
    activeOption,
    handleKeyDown: handleListBoxKeyDown,
    listBoxId,
    listBoxRef,
  } = useListBox({
    options,
    dropdownHelpMessage,
    dropdownWidth,
    onAdd,
    onSelect: handleSelect,
    isExpanded: isFocused,
    isLoading,
    triggerRef: outerRef,
    decorators,
  })

  const {
    deletionButtonRefs,
    inputRef,
    focusPrevDeletionButton,
    focusNextDeletionButton,
    resetDeletionButtonFocus,
  } = useFocusControl(selectedItems.length)

  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current)

  const focus = useCallback(() => {
    onFocus && onFocus()
    setIsFocused(true)
  }, [onFocus])
  const blur = useCallback(() => {
    if (!isFocused) return
    onBlur && onBlur()
    setIsFocused(false)
    resetDeletionButtonFocus()
  }, [isFocused, onBlur, resetDeletionButtonFocus])

  const caretIconColor = useMemo(() => {
    if (isFocused) return theme.color.TEXT_BLACK
    if (disabled) return theme.color.TEXT_DISABLED
    return theme.color.TEXT_GREY
  }, [disabled, isFocused, theme])

  useOuterClick([outerRef, listBoxRef], blur)

  useEffect(() => {
    if (!isInputControlled) {
      setUncontrolledInputValue('')
    }

    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef, isFocused, isInputControlled, selectedItems])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (isComposing) {
        return
      } else if (e.key === 'Escape' || e.key === 'Esc') {
        e.stopPropagation()
        blur()
      } else if (e.key === 'Tab') {
        if (isFocused) {
          // フォーカスがコンポーネントを抜けるように先に input をフォーカスしておく
          inputRef.current?.focus()
        }
        blur()
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        e.stopPropagation()
        focusPrevDeletionButton()
      } else if (e.key === 'Right' || e.key === 'ArrowRight') {
        e.stopPropagation()
        focusNextDeletionButton()
      } else {
        e.stopPropagation()
        inputRef.current?.focus()
        resetDeletionButtonFocus()
      }
      handleListBoxKeyDown(e)
    },
    [
      blur,
      focusNextDeletionButton,
      focusPrevDeletionButton,
      handleListBoxKeyDown,
      inputRef,
      isComposing,
      isFocused,
      resetDeletionButtonFocus,
    ],
  )

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (
        !hasParentElementByClassName(e.target as HTMLElement, classNames.deleteButton) &&
        !disabled &&
        !isFocused
      ) {
        focus()
      }
    },
    [isFocused, disabled, focus, classNames.deleteButton],
  )
  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e)
      if (onChangeInput) onChangeInput(e)
      if (!isInputControlled) {
        setUncontrolledInputValue(e.currentTarget.value)
      }
    },
    [isInputControlled, onChangeInput, onChange],
  )
  const handleFocusInput = useCallback(() => {
    resetDeletionButtonFocus()

    if (!isFocused) {
      focus()
    }
  }, [isFocused, focus, resetDeletionButtonFocus])
  const handleCompositionStartInput = useCallback(() => setIsComposing(true), [])
  const handleCompositionEndInput = useCallback(() => setIsComposing(false), [])
  const handleInputKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Down' || e.key === 'ArrowDown' || e.key === 'Up' || e.key === 'ArrowUp') {
      // 上下キー入力はリストボックスの activeDescendant の移動に用いるため、input 内では作用させない
      e.preventDefault()
    }
  }, [])

  // HINT: form内にcomboboxを設置 & 検索inputにfocusした状態で
  // アイテムをキーボードで選択し、Enterを押すとinput上でEnterを押したことになるため、
  // submitイベントが発生し、formが送信される場合がある
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.key === 'Enter' && e.preventDefault()
      onKeyPress && onKeyPress(e)
    },
    [onKeyPress],
  )

  const contextValue = useMemo(
    () => ({
      listBoxClassNames: classNames.listBox,
    }),
    [classNames.listBox],
  )

  const selectedListId = useId()

  return (
    <ComboBoxContext.Provider value={contextValue}>
      <Container
        {...props}
        themes={theme}
        $width={width}
        isFocused={isFocused}
        error={error}
        $disabled={disabled}
        ref={outerRef}
        className={`${className} ${classNames.wrapper}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onKeyPress={handleKeyPress}
        role="group"
      >
        <InputArea themes={theme}>
          <SelectedList
            id={selectedListId}
            aria-label={
              decorators?.selectedListAriaLabel?.(SELECTED_LIST_ARIA_LABEL) ||
              SELECTED_LIST_ARIA_LABEL
            }
            className={classNames.selectedList}
          >
            {selectedItems.map((selectedItem, i) => (
              <li key={`${selectedItem.label}-${selectedItem.value}`}>
                <MultiSelectedItem
                  item={selectedItem}
                  disabled={disabled}
                  onDelete={handleDelete}
                  enableEllipsis={selectedItemEllipsis}
                  buttonRef={deletionButtonRefs[i]}
                  decorators={decorators}
                />
              </li>
            ))}
          </SelectedList>

          <InputWrapper $hidden={!isFocused}>
            <Input
              {...inputAttributes}
              type="text"
              name={name}
              value={inputValue}
              disabled={disabled}
              required={required && selectedItems.length === 0}
              ref={inputRef}
              themes={theme}
              onChange={handleChangeInput}
              onFocus={handleFocusInput}
              onCompositionStart={handleCompositionStartInput}
              onCompositionEnd={handleCompositionEndInput}
              onKeyDown={handleInputKeyDown}
              autoComplete="off"
              tabIndex={0}
              role="combobox"
              aria-activedescendant={activeOption?.id}
              aria-controls={`${listBoxId} ${selectedListId}`}
              aria-haspopup="listbox"
              aria-expanded={isFocused}
              aria-invalid={error || undefined}
              aria-disabled={disabled}
              aria-autocomplete="list"
              className={classNames.input}
            />
          </InputWrapper>

          {selectedItems.length === 0 && placeholder && !isFocused && (
            <Placeholder themes={theme} className={classNames.placeholder}>
              {placeholder}
            </Placeholder>
          )}
        </InputArea>

        <Suffix themes={theme} $disabled={disabled}>
          <FaCaretDownIcon color={caretIconColor} />
        </Suffix>

        {renderListBox()}
      </Container>
    </ComboBoxContext.Provider>
  )
}

// forwardRef したコンポーネントでジェネリクスを使うときのワークアラウンド
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref/58473012
export const MultiComboBox = forwardRef(ActualMultiComboBox) as (<T>(
  props: ComponentPropsWithoutRef<typeof ActualMultiComboBox<T>> & {
    ref?: Ref<HTMLInputElement>
  },
) => ReturnType<typeof ActualMultiComboBox<T>>) & {
  displayName: string
}

type ContainerType = {
  isFocused: boolean
  error: boolean
  $disabled: boolean
  themes: Theme
  $width: number | string
}
const Container = styled.div.attrs(
  ({ isFocused, error, $disabled, $width, themes }: ContainerType) => {
    const style: React.CSSProperties = {
      width: typeof $width === 'number' ? `${$width}px` : $width,
    }

    if (isFocused) {
      style.boxShadow = themes.shadow.OUTLINE
    }
    if (error) {
      style.borderColor = themes.color.DANGER
    }
    if ($disabled) {
      style.cursor = 'not-allowed'
      style.borderColor = themes.color.disableColor(themes.color.BORDER)
      style.backgroundColor = themes.color.hoverColor(themes.color.WHITE)
      style.color = themes.color.TEXT_DISABLED
    }

    return { style }
  },
)<ContainerType>`
  ${({ themes }) => {
    const { border, color, radius, space } = themes

    return css`
      display: inline-flex;
      border-radius: ${radius.m};
      border: ${border.shorthand};
      background-color: ${color.WHITE};
      padding: ${space(0.25)} ${space(0.5)};
      cursor: text;
      min-width: 15em;
      box-sizing: border-box;

      @media (prefers-contrast: more) {
        border: ${border.highContrast};
      }
    `
  }}
`
const InputArea = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: ${spacingByChar(0.5)};
    overflow-y: auto;
  `}
`
const SelectedList = styled.ul`
  display: contents;
  list-style: none;
  li {
    /** 選択済みアイテムのラベルの省略表示のために幅を計算させる */
    min-width: 0;
  }
`

type InputWrapperProps = { $hidden: boolean }
const InputWrapper = styled.div.attrs(({ $hidden }: InputWrapperProps) => ({
  style: $hidden
    ? {
        position: 'absolute',
        opacity: '0',
        pointerEvents: 'none',
      }
    : undefined,
}))<InputWrapperProps>`
  flex: 1;
  display: flex;
  align-items: center;
`
const Input = styled.input<{ themes: Theme }>`
  ${({ themes }) => {
    const { color, fontSize } = themes

    return css`
      min-width: 5em;
      width: 100%;
      border: none;
      font-size: ${fontSize.M};
      color: ${color.TEXT_BLACK};
      outline: none;

      :disabled {
        display: none;
      }
    `
  }}
`
const Placeholder = styled.p<{ themes: Theme }>`
  margin-block: 0;
  align-self: center;
`
const Suffix = styled.div<{ themes: Theme; $disabled: boolean }>`
  ${({ themes: { border, space }, $disabled }) => css`
    position: relative;
    margin-inline: ${space(0.5)} ${space(-0.5)};
    padding: ${space(0.5)};
    cursor: ${$disabled ? 'not-allowed' : 'pointer'};

    &::before {
      content: '';
      position: absolute;
      inset: ${space(0.25)} 0;
      width: 0;
      border-left: ${border.shorthand};
    }

    .smarthr-ui-Icon {
      display: block;
    }
  `}
`
