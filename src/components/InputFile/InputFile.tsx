import React, { FC, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { TextButton } from '../Button'
import { FaFolderOpenIcon, FaTrashAltIcon } from '../Icon'
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
                    prefix={<FaTrashAltIcon size={14} />}
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
          {...props}
          type="file"
          id={id}
          onChange={(e) => handleChange(e)}
          disabled={disabled}
          tabIndex={-1}
        />
        <FileButton
          themes={theme}
          className={FileButtonClassName}
          disabled={disabled}
          type="button"
        >
          <label htmlFor={id}>
            <Prefix themes={theme}>
              <FaFolderOpenIcon size={14} />
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
  const { palette, size, spacingByChar } = themes
  return css`
    font-size: ${size.pxToRem(size.font.TALL)};
    padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
    margin-bottom: ${spacingByChar(1)};
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

      /* HINT: input[type=file] が button ボタンを覆うようにサイズを調整
      Hanica のようにデフォルト font-size に !important がついているプロダクトの場合、上書きされてしまうため念のため !important を入れる */
      font-size: 128px !important;
      opacity: 0;
      appearance: none;
      cursor: pointer;

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
  const { frame, palette, size, spacingByChar } = themes
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
      padding: 0 ${spacingByChar(1)};
    }

    &.s {
      font-size: ${size.pxToRem(size.font.SHORT)};
      height: 27px;
      padding: 0 ${spacingByChar(0.5)};
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
  ${({ themes: { spacingByChar } }) => {
    return css`
      display: inline-flex;
      margin-right: ${spacingByChar(0.5)};
    `
  }}
`
