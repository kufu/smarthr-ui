import React, { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useOuterClick } from '../../hooks/useOuterClick'
import { hasParentElementByClassName } from './multiComboBoxHelper'

import { Icon } from '../Icon'
import { Portal } from './Portal'

const DELETE_BUTTON_CLASS_NAME = 'DELETE_BUTTON_CLASS_NAME'

type Props = {
  items: Array<{ value: string; label: string; disabled?: boolean }>
  selectedItems: Array<{ value: string; label: string; deletable?: boolean }>
  name?: string
  disabled?: boolean
  error?: boolean
  creatable?: boolean
  placeholder?: string
  width?: number | string
  className?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onAdd?: (label: string) => void
  onDelete: (option: { value: string; label: string }) => void
  onSelect: (option: { value: string; label: string }) => void
}

export const MultiComboBox: FC<Props> = ({
  items,
  selectedItems,
  name,
  disabled = false,
  error = false,
  creatable = false,
  placeholder = '',
  width = 'auto',
  className = '',
  onChange,
  onAdd,
  onDelete,
  onSelect,
}) => {
  const theme = useTheme()
  const outerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
  })
  const [inputValue, setInputValue] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const selectedLabels = selectedItems.map(({ label }) => label)
  const filteredItems = items.filter(({ label }) => {
    if (selectedLabels.includes(label)) return false
    if (!inputValue) return true
    return label.includes(inputValue)
  })
  const isDuplicate = items.map(({ label }) => label).includes(inputValue)
  const dropdownContentFlags = {
    addable: creatable && inputValue && !isDuplicate,
    duplicate: creatable && inputValue && isDuplicate,
    noItems:
      (!creatable && filteredItems.length === 0) ||
      (creatable && filteredItems.length === 0 && !inputValue),
    viewList: filteredItems.length > 0,
  }
  const classNames = [
    isFocused ? 'active' : '',
    disabled ? 'disabled' : '',
    error ? 'error' : '',
    className,
  ]
    .filter((item) => item)
    .join(' ')

  useOuterClick(
    [outerRef, dropdownRef],
    useCallback(() => {
      setIsFocused(false)
    }, []),
  )

  useEffect(() => {
    setInputValue('')

    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }

    if (outerRef.current) {
      const rect = outerRef.current.getBoundingClientRect()

      setDropdownStyle({
        top: rect.top + rect.height - 2 + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        width: outerRef.current.clientWidth,
      })
    }
  }, [isFocused, selectedItems])

  return (
    <Container
      themes={theme}
      width={width}
      ref={outerRef}
      className={classNames}
      onClick={(e) => {
        if (
          !hasParentElementByClassName(e.target as HTMLElement, DELETE_BUTTON_CLASS_NAME) &&
          !disabled &&
          !isFocused
        ) {
          setIsFocused(true)
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Escape' || e.key === 'Esc') && isFocused) {
          e.stopPropagation()
          setIsFocused(false)
        }
      }}
    >
      <Inner>
        <InputArea themes={theme}>
          <List themes={theme}>
            {selectedItems.map(({ value, label, deletable = true }, i) => (
              <li key={i}>
                <SelectedItem themes={theme} className={deletable ? 'deletable' : ''}>
                  {label}

                  {deletable && (
                    <DeleteButton
                      type="button"
                      themes={theme}
                      className={DELETE_BUTTON_CLASS_NAME}
                      onClick={() => onDelete({ value, label })}
                    >
                      <DeleteIcon
                        name="fa-times-circle"
                        size={11}
                        color={theme.palette.TEXT_BLACK}
                      />
                    </DeleteButton>
                  )}
                </SelectedItem>
              </li>
            ))}

            <InputWrapper className={isFocused ? undefined : 'hidden'}>
              <Input
                type="text"
                name={name}
                value={inputValue}
                disabled={disabled}
                ref={inputRef}
                themes={theme}
                onChange={(e) => {
                  if (onChange) onChange(e)
                  setInputValue(e.currentTarget.value)
                }}
                onFocus={() => setIsFocused(true)}
                onKeyDown={(e) => {
                  if (!isComposing && isFocused && e.key === 'Tab') {
                    setIsFocused(false)
                  }
                }}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
              />
            </InputWrapper>

            {selectedItems.length === 0 && placeholder && !isFocused && (
              <li>
                <Placeholder themes={theme}>{placeholder}</Placeholder>
              </li>
            )}
          </List>
        </InputArea>

        <Suffix themes={theme}>
          <Icon
            name="fa-caret-down"
            color={isFocused ? theme.palette.TEXT_BLACK : theme.palette.BORDER}
          />
        </Suffix>
      </Inner>

      {isFocused && (
        <Portal top={dropdownStyle.top} left={dropdownStyle.left}>
          <Dropdown themes={theme} ref={dropdownRef} width={dropdownStyle.width}>
            {dropdownContentFlags.addable && (
              <AddButton themes={theme} onClick={() => onAdd && onAdd(inputValue)}>
                <AddIcon
                  name="fa-plus-circle"
                  size={14}
                  color={theme.palette.TEXT_LINK}
                  $theme={theme}
                />
                <AddText themes={theme}>「{inputValue}」を追加</AddText>
              </AddButton>
            )}

            {dropdownContentFlags.viewList &&
              filteredItems.map(({ label, value, disabled: itemDisabled = false }, i) => (
                <SelectButton
                  key={i}
                  type="button"
                  themes={theme}
                  disabled={itemDisabled}
                  onClick={() => onSelect({ value, label })}
                >
                  {label}
                </SelectButton>
              ))}

            {dropdownContentFlags.duplicate && (
              <NoItems themes={theme}>重複する選択肢は追加できません</NoItems>
            )}

            {dropdownContentFlags.noItems && (
              <NoItems themes={theme}>一致する選択肢がありません</NoItems>
            )}
          </Dropdown>
        </Portal>
      )}
    </Container>
  )
}

const Container = styled.div<{ themes: Theme; width: number | string }>`
  ${({ themes, width }) => {
    const { frame, size, palette } = themes

    return css`
      display: inline-block;
      min-width: calc(62px + 32px + ${size.pxToRem(size.space.XXS)} * 2);
      width: ${typeof width === 'number' ? `${width}px` : width};
      border-radius: ${frame.border.radius.m};
      border: ${frame.border.default};
      background-color: #fff;
      cursor: text;

      &.active {
        border-color: ${palette.MAIN};
      }

      &.error {
        border-color: ${palette.DANGER};
      }

      &.disabled {
        background-color: ${palette.COLUMN};
        cursor: not-allowed;
      }
    `
  }}
`
const Inner = styled.div`
  display: flex;
  width: 100%;
`
const InputArea = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      /* for IE */
      /* stylelint-disable-next-line length-zero-no-unit */
      flex: 1 1 0px;
      overflow-y: auto;
      max-height: 300px;
      padding: 0 ${size.pxToRem(4)};
    `
  }}
`
const List = styled.ul<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      display: flex;
      flex-wrap: wrap;
      padding: ${size.pxToRem(3.5)} 0;
      list-style: none;

      > li {
        margin: ${size.pxToRem(4)};
      }
    `
  }}
`
const SelectedItem = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { frame, palette, size } = themes

    return css`
      position: relative;
      padding: ${size.pxToRem(size.space.XXS)};
      border-radius: calc(${size.font.SHORT}px + ${size.pxToRem(size.space.XXS)} * 2);
      border: ${frame.border.default};
      background-color: #fff;
      color: ${palette.TEXT_BLACK};
      font-size: ${size.font.SHORT}px;
      line-height: 1;

      &.deletable {
        padding-right: ${size.pxToRem(size.space.M)};
      }
    `
  }}
`
const DeleteButton = styled.button<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      position: absolute;
      top: 0;
      right: 0;
      width: calc(11px + ${size.pxToRem(size.space.XXS)} * 2);
      height: calc(11px + ${size.pxToRem(size.space.XXS)} * 2);
      padding: ${size.pxToRem(size.space.XXS)};
      border-radius: 50%;
      border: none;
      background-color: transparent;
      cursor: pointer;
    `
  }}
`
const DeleteIcon = styled(Icon)`
  vertical-align: 1px;
`
const InputWrapper = styled.li`
  &.hidden {
    position: absolute;
    opacity: 0;
  }

  /* for IE */
  /* stylelint-disable-next-line length-zero-no-unit */
  flex: 1 1 0px;
`
const Input = styled.input<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      min-width: 80px;
      width: 100%;
      border: none;
      font-size: ${size.font.TALL}px;
      box-sizing: border-box;
      outline: none;
      &[disabled] {
        display: none;
      }
    `
  }}
`
const Placeholder = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette, size } = themes

    return css`
      margin: 0;
      color: ${palette.TEXT_GREY};
      font-size: ${size.font.TALL}px;
      line-height: 25px;
    `
  }}
`
const Suffix = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, frame } = themes

    return css`
      display: flex;
      justify-content: center;
      align-items: center;
      width: 31px;
      min-height: 24px;
      margin: ${size.pxToRem(size.space.XXS)} 0;
      border-left: ${frame.border.default};
      box-sizing: border-box;
    `
  }}
`
const Dropdown = styled.div<{ themes: Theme; width: number }>`
  ${({ themes, width }) => {
    const { size, frame } = themes

    return css`
      overflow-y: auto;
      max-height: 300px;
      width: ${width}px;
      padding: ${size.pxToRem(size.space.XXS)} 0;
      border-radius: ${frame.border.radius.m};
      box-shadow: rgba(51, 51, 51, 0.3) 0 4px 10px 0;
      background-color: #fff;
      white-space: nowrap;
      box-sizing: border-box;
    `
  }}
`
const NoItems = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      margin: 0;
      padding: ${size.pxToRem(size.space.XXS)} ${size.pxToRem(size.space.XS)};
      background-color: #fff;
      font-size: ${size.font.TALL}px;
    `
  }}
`
const SelectButton = styled.button<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      display: block;
      width: 100%;
      border: none;
      padding: ${size.pxToRem(size.space.XXS)} ${size.pxToRem(size.space.XS)};
      background-color: #fff;
      font-size: ${size.font.TALL}px;
      text-align: left;
      cursor: pointer;

      &:hover:not([disabled]) {
        background-color: ${palette.COLUMN};
      }

      &[disabled] {
        color: ${palette.TEXT_DISABLED};
        cursor: not-allowed;
      }
    `
  }}
`
const AddButton = styled(SelectButton)`
  display: flex;
  align-items: center;
`
const AddIcon = styled(Icon)<{ $theme: Theme }>`
  ${({ $theme }) => {
    const { size } = $theme

    return css`
      position: relative;
      top: -1px;
      margin-right: ${size.pxToRem(4)};
    `
  }}
`
const AddText = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette } = themes

    return css`
      color: ${palette.TEXT_LINK};
    `
  }}
`
