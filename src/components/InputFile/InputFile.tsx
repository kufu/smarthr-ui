import React, { FC, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { TextButton } from '../Button'
import { Icon } from '../Icon'
import { Theme, useTheme } from '../../hooks/useTheme'

type Size = 'default' | 's'

export type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  id?: string
  className?: string
  size?: Size
  label: string
  files?: File[]
  onAdd?: (addFiles: File[]) => void
  onDelete?: (index: number) => void
  hasFileList?: boolean
}

export const InputFile: FC<Props> = ({
  id,
  className,
  size = 'default',
  label,
  files = [],
  hasFileList = true,
  onAdd,
  onDelete,
  disabled = false,
  ...props
}) => {
  const theme = useTheme()
  const FileButtonWrapperClassName = `${disabled ? 'disabled' : ''}`
  const FileButtonClassName = `${size}`

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onAdd && e.target.files && e.target.files?.length > 0) {
      const uploadFile = Array.from(e.target.files)
      onAdd(uploadFile)

      const target = e.target as HTMLInputElement
      target.value = ''
    }
  }

  const handleDelete = (index: number) => {
    onDelete && onDelete(index)
  }

  return (
    <Wrapper className={className}>
      {!disabled && hasFileList && files.length > 0 && (
        <FileList themes={theme}>
          {files.map((file, index) => {
            return (
              <li key={index}>
                <span>{file.name}</span>
                <span>
                  <TextButton
                    prefix={<Icon size={14} name="fa-trash-alt" />}
                    onClick={() => handleDelete(index)}
                  >
                    削除
                  </TextButton>
                </span>
              </li>
            )
          })}
        </FileList>
      )}
      <FileButtonWrapper themes={theme} className={FileButtonWrapperClassName}>
        <input
          type="file"
          id={id}
          onChange={(e) => handleChange(e)}
          disabled={disabled}
          {...props}
        />
        <FileButton themes={theme} className={FileButtonClassName} disabled={disabled}>
          <label htmlFor={id}>
            <Prefix themes={theme}>
              <Icon size={14} name="fa-folder-open" />
            </Prefix>
            {label}
          </label>
        </FileButton>
      </FileButtonWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: block;
`

const FileList = styled.ul<{ themes: Theme }>(({ themes }) => {
  const { palette, size } = themes
  return css`
    font-size: ${size.pxToRem(size.font.TALL)};
    padding: ${size.pxToRem(size.space.XXS)} ${size.pxToRem(size.space.XS)};
    margin-bottom: ${size.pxToRem(size.space.XS)};
    background-color: ${palette.COLUMN};
    list-style: none;

    > li {
      display: flex;
      align-items: center;
    }
  `
})

const FileButtonWrapper = styled.div<{ themes: Theme }>(({ themes }) => {
  const { palette, interaction } = themes

  return css`
    position: relative;
    overflow: hidden;
    display: inline-block;

    > input[type='file'] {
      position: absolute;
      height: 100%;

      /* Prevent to show caret on the upload button on IE11 */
      left: -10px;
      top: 0;
      margin: 0;
      font-size: 128px;
      opacity: 0;

      &::-webkit-file-upload-button {
        cursor: pointer;
      }
    }

    > button {
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
    }

    &:hover {
      > button {
        background-color: ${palette.hoverColor('#fff')};
      }
      &.disabled {
        > button {
          background-color: ${palette.COLUMN};
        }
      }
    }

    &.disabled {
      > input[type='file'] {
        display: none;
      }
    }
  `
})

const FileButton = styled.button<{ themes: Theme }>(({ themes }) => {
  const { frame, palette, size } = themes
  return css`
    font-family: inherit;
    font-weight: bold;
    border-radius: ${frame.border.radius.m};
    color: ${palette.TEXT_BLACK};
    background-color: #fff;
    border: ${frame.border.default};

    > label {
      display: flex;
      align-items: center;
    }

    &.default {
      font-size: ${size.pxToRem(size.font.TALL)};
      height: 40px;
      padding: 0 ${size.pxToRem(size.space.XS)};
    }

    &.s {
      font-size: ${size.pxToRem(size.font.SHORT)};
      height: 27px;
      padding: 0 ${size.pxToRem(size.space.XXS)};
    }

    &.square {
      width: 40px;
      padding: 0;

      &.s {
        width: 27px;
        min-width: 27px;
      }
    }

    &.prefix {
      justify-content: left;
    }

    &[disabled] {
      cursor: not-allowed;
      background-color: ${palette.COLUMN};
      color: ${palette.TEXT_DISABLED};
      > label {
        cursor: not-allowed;
      }
    }
  `
})

const Prefix = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size
    return css`
      display: inline-flex;
      margin-right: ${pxToRem(space.XXS)};
    `
  }}
`
