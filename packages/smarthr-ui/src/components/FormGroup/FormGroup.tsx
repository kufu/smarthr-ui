import { type ComponentType, type FC, type RefObject, useEffect, useMemo } from 'react'

import { FaCircleExclamationIcon } from '../Icon'
import { Stack } from '../Layout'
import { Text } from '../Text'

import { CHILDREN_WRAPPER_INPUT_SELECTOR } from './constants'

import type { CommonProps, LabelComponentProps, ObjectLabelType } from './type'
import type { useDescribedByIds } from './useDescribedByIds'

// HINT: errorMessagesを含む各idはuseDescribedByIdsで、classNamesは各コンポーネントで
// 算出済みの値を受け取る
type Props = Omit<CommonProps, 'errorMessages' | 'className'> &
  Omit<ReturnType<typeof useDescribedByIds>, 'describedbyIds'> & {
    wrapperRef: RefObject<HTMLDivElement>
    /** グループのラベル名 */
    label: Omit<ObjectLabelType, 'id' | 'htmlFor'> &
      Required<Pick<ObjectLabelType, 'id' | 'htmlFor'>>
    as?: string | ComponentType<any>
    /** `true` のとき、文字色を `TEXT_DISABLED` にする */
    disabled?: boolean
    LabelComponent: FC<LabelComponentProps>
    classNames: {
      wrapper: string
      childrenWrapper: string
    }
  }
type LowerProps = Omit<Props, 'autoBindErrorInput'>

export const FormGroup: FC<Props> = ({ autoBindErrorInput = true, ...rest }) => {
  const Component = autoBindErrorInput ? AutoBindErrorFormGroup : ActualFormGroup

  return <Component {...rest} />
}

const AutoBindErrorFormGroup: FC<LowerProps> = ({ visibleErrorMessages, wrapperRef, ...rest }) => {
  useEffect(() => {
    if (!wrapperRef.current) {
      return
    }

    const input = wrapperRef.current.querySelector(CHILDREN_WRAPPER_INPUT_SELECTOR)

    if (input) {
      if (visibleErrorMessages) {
        input.setAttribute('aria-invalid', 'true')
      } else {
        input.removeAttribute('aria-invalid')
      }
    }
  }, [visibleErrorMessages, wrapperRef])

  return (
    <ActualFormGroup
      {...rest}
      wrapperRef={wrapperRef}
      visibleErrorMessages={visibleErrorMessages}
    />
  )
}

const ActualFormGroup: FC<LowerProps> = ({
  wrapperRef,
  label,
  subActionArea,
  innerMargin,
  statusLabels,
  helpMessage,
  exampleMessage,
  errorMessages,
  supplementaryMessage,
  as = 'div',
  children,
  classNames,
  LabelComponent,
  visibleErrorMessages,
  helpMessageId,
  exampleMessageId,
  supplementaryMessageId,
  errorMessagesId,
  ...rest
}) => {
  // HINT: statusLabelsは設定されない場合が大半、かつ設定されてもRequiredLabelでmemo化されているため
  // memo化がかなりの確率で有用
  const actualStatusLabels = useMemo(
    () => (statusLabels ? (Array.isArray(statusLabels) ? statusLabels : [statusLabels]) : []),
    [statusLabels],
  )

  return (
    <Stack
      {...rest}
      ref={wrapperRef}
      as={as}
      gap={innerMargin ?? 0.5}
      className={classNames.wrapper}
    >
      <LabelComponent
        managedHtmlFor={label.htmlFor}
        managedLabelId={label.id}
        unrecommendedHideLabel={label.unrecommendedHide}
        labelType={label.styleType}
        label={label.text}
        labelIcon={label.icon}
        statusLabels={actualStatusLabels}
        subActionArea={subActionArea}
      />
      {helpMessage && (
        <p className="smarthr-ui-FormControl-helpMessage" id={helpMessageId}>
          {helpMessage}
        </p>
      )}
      {exampleMessage && (
        <Text
          as="p"
          color="TEXT_GREY"
          italic
          id={exampleMessageId}
          className="smarthr-ui-FormControl-exampleMessage"
        >
          {exampleMessage}
        </Text>
      )}
      {visibleErrorMessages && (
        <div id={errorMessagesId} className="shr-list-none" role="alert">
          {errorMessages.map((message, index) => (
            <p key={index}>
              <Text
                className="smarthr-ui-FormControl-errorMessage"
                icon={
                  <FaCircleExclamationIcon className="smarthr-ui-FormControl-errorMessage-Icon shr-text-danger" />
                }
              >
                {message}
              </Text>
            </p>
          ))}
        </div>
      )}
      <div className={classNames.childrenWrapper}>{children}</div>
      {supplementaryMessage && (
        <Text
          as="p"
          size="S"
          color="TEXT_GREY"
          id={supplementaryMessageId}
          className="smarthr-ui-FormControl-supplementaryMessage"
        >
          {supplementaryMessage}
        </Text>
      )}
    </Stack>
  )
}
