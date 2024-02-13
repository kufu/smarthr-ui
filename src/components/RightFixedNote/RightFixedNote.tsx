import React, { FormHTMLAttributes, ReactNode, VFC, useCallback, useMemo } from 'react'
import innerText from 'react-innertext'
import styled, { css } from 'styled-components'

import { useId } from '../../hooks/useId'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Button } from '../Button'
import { Heading } from '../Heading'
import { Center } from '../Layout'
import { Loader } from '../Loader'
import { Section } from '../SectioningContent'
import { Text } from '../Text'
import { Textarea } from '../Textarea'

import { ItemProps, OnClickEdit, RightFixedNoteItem } from './RightFixedNoteItem'
import { useClassNames } from './useClassNames'

import type { DecoratorsType } from '../../types'

type Props = {
  /** コンポーネントのタイトル */
  title: ReactNode
  /** 表示するアイテムの配列 */
  items?: ItemProps[]
  /** コンポーネントの幅 */
  width?: number
  /** textarea のラベル */
  textareaLabel?: ReactNode
  /** edit ボタンを押下したときに発火するコールバック関数 */
  onClickEdit: OnClickEdit
  /** submit ボタンを押下したときに発火するコールバック関数 */
  onSubmit: (e: React.FormEvent<HTMLFormElement>, text: string) => void
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'submitLabel'>
  /** 読み込み中かどうか */
  loading?: boolean
  /** 送信中かどうか */
  submitting?: boolean
}
type ElementProps = Omit<FormHTMLAttributes<HTMLFormElement>, keyof Props>

const TEXT_AREA_NAME = 'admin_memo_new_text'
const SUBMIT_LABEL = '送信'

export const RightFixedNote: VFC<Props & ElementProps> = ({
  title,
  items,
  width = 270,
  textareaLabel,
  onClickEdit,
  onSubmit,
  className = '',
  decorators,
  loading = false,
  submitting = false,
  ...props
}) => {
  const theme = useTheme()

  const submitLabel = useMemo(
    () => decorators?.submitLabel?.(SUBMIT_LABEL) || SUBMIT_LABEL,
    [decorators],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = new FormData(e.currentTarget)
      const newText = (formData.get(TEXT_AREA_NAME) || '') as string

      onSubmit(e, newText)
    },
    [onSubmit],
  )

  const textareaId = useId()
  const classNames = useClassNames()

  return (
    <WrapperForm
      {...props}
      themes={theme}
      $width={width}
      onSubmit={handleSubmit}
      className={`${className} ${classNames.wrapper}`}
    >
      <Section>
        <SectionHeading themes={theme} className={classNames.title}>
          {title}
        </SectionHeading>

        {loading ? (
          <Center padding={8}>
            <Loader />
          </Center>
        ) : (
          <>
            {items &&
              items.map((item) => (
                <RightFixedNoteItem
                  {...item}
                  key={item.id}
                  onClickEdit={onClickEdit}
                  submitting={submitting}
                />
              ))}

            {textareaLabel && (
              <label htmlFor={textareaId}>
                <TextareaLabelText themes={theme}>{textareaLabel}</TextareaLabelText>
              </label>
            )}
            <StyledTextarea
              id={textareaId}
              name={TEXT_AREA_NAME}
              themes={theme}
              aria-label={innerText(textareaLabel || title)}
              className={classNames.textarea}
              disabled={submitting}
            />

            <SubmitButton type="submit" className={classNames.submitButton} loading={submitting}>
              {submitLabel}
            </SubmitButton>
          </>
        )}
      </Section>
    </WrapperForm>
  )
}

const WrapperForm = styled.form<{ themes: Theme; $width: number }>`
  ${({ themes, $width }) => {
    const { spacingByChar, color, shadow } = themes

    return css`
      width: ${$width}px;
      padding: ${spacingByChar(1)};
      background-color: ${color.COLUMN};
      box-shadow: ${shadow.LAYER2};
      overflow: hidden scroll;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
    `
  }}
`

const SectionHeading = styled(Heading).attrs(() => ({
  type: 'sectionTitle',
}))<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    display: block;
    margin-bottom: ${spacingByChar(1)};
  `}
`

const TextareaLabelText = styled(Text).attrs(() => ({
  tag: 'span',
  styleType: 'subBlockTitle',
}))<{ themes: Theme }>`
  display: inline-block;
  margin-bottom: ${({ themes }) => themes.spacingByChar(1)};
`

const StyledTextarea = styled(Textarea)<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    box-sizing: border-box;
    margin-bottom: ${spacingByChar(1)};
  `}
`

const SubmitButton = styled(Button)`
  display: block;
  float: right;
`
