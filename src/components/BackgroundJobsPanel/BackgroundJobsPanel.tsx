import React, { ComponentProps, ReactNode, VFC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { useId } from '../../hooks/useId'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Base } from '../Base'
import { Button, UnstyledButton } from '../Button'
import { FaMinusIcon, FaTimesIcon, FaWindowMaximizeIcon } from '../Icon'

import { JobIcon } from './JobIcon'
import { OmittableJobText } from './OmittableJobText'
import { useClassNames } from './useClassNames'

type JobId = string | number
export type Status = 'processing' | 'downloading' | 'warning' | 'error' | 'done'

export type JobProps = {
  /** ジョブの ID */
  id: JobId
  /** ジョブのステータス */
  status: Status
  /** ジョブ名 */
  name: ReactNode
  /** ジョブの説明 */
  description: ReactNode
  /** ジョブがキャンセル可能かどうか */
  isCancelable?: boolean
}

type Props = {
  /** パネルのタイトル */
  title: string
  /** バックグラウンドジョブデータの配列 */
  jobs: JobProps[]
  /** パネルを広げるかどうか */
  isExpanded?: boolean
  /** ジョブのキャンセルボタンクリックのハンドラ */
  onClickCancelJob?: (jobId: JobId) => void
  /** パネルの開閉ボタンクリックのハンドラ */
  onClickExpansion?: (isExpanded: boolean) => void
  /** パネルの閉じるボタンクリックのハンドラ */
  onClickClose?: () => void
}

type ElementProps = Omit<ComponentProps<typeof Base>, keyof Props | 'children'>

export const BackgroundJobsPanel: VFC<Props & ElementProps> = ({
  title,
  jobs,
  onClickCancelJob,
  onClickExpansion,
  onClickClose,
  className = '',
  ...props
}) => {
  const themes = useTheme()
  const { backgroundJobsPanel: classNames } = useClassNames()
  const isExpansionControlled = props.isExpanded !== undefined

  const [isExpanded, setIsExpanded] = useState(isExpansionControlled ? !!props.isExpanded : true)
  useEffect(() => {
    if (isExpansionControlled) {
      setIsExpanded(!!props.isExpanded)
    }
  }, [isExpansionControlled, props.isExpanded])

  const jobListId = useId()

  return (
    <Container themes={themes} className={`${className} ${classNames.wrapper}`}>
      <Header>
        <Title themes={themes} className={classNames.title}>
          {title}
        </Title>
        <HeaderButtonLayout themes={themes}>
          <Button
            type="button"
            size="s"
            square
            onClick={() => {
              onClickExpansion && onClickExpansion(!isExpanded)
              if (!isExpansionControlled) {
                setIsExpanded(!isExpanded)
              }
            }}
            aria-expanded={isExpanded}
            aria-controls={jobListId}
            className={classNames.toggleButton}
          >
            {isExpanded ? (
              <FaMinusIcon alt="折りたたむ" />
            ) : (
              <FaWindowMaximizeIcon alt="展開する" />
            )}
          </Button>
          <Button
            type="button"
            size="s"
            square
            onClick={onClickClose}
            className={classNames.closeButton}
          >
            <FaTimesIcon alt="閉じる" />
          </Button>
        </HeaderButtonLayout>
      </Header>
      <JobList themes={themes} isExpanded={isExpanded} id={jobListId} className={classNames.list}>
        {jobs.map((job) => {
          const handleClickCancelJob = onClickCancelJob ? () => onClickCancelJob(job.id) : undefined
          return (
            <Job key={job.id} themes={themes} className={classNames.listItem}>
              <JobIconWrapper>
                <JobIcon status={job.status} />
              </JobIconWrapper>
              <JobNameText themes={themes}>{job.name}</JobNameText>
              <JobDescText themes={themes}>{job.description}</JobDescText>
              {job.isCancelable && (
                <CancelButton type="button" onClick={handleClickCancelJob} themes={themes}>
                  キャンセル
                </CancelButton>
              )}
            </Job>
          )
        })}
      </JobList>
    </Container>
  )
}

const Container = styled(Base)<{ themes: Theme }>(({ themes }) => css`
    display: inline-flex;
    flex-direction: column;
    min-width: 420px;
    max-width: 600px;
    color: ${themes.color.TEXT_BLACK};
  `)
const Header = styled.div`
  display: flex;
  align-items: center;
`
const Title = styled.div<{ themes: Theme }>(({ themes: { fontSize, spacingByChar } }) => css`
    font-size: ${fontSize.M};
    padding: ${spacingByChar(1)};
  `)
const HeaderButtonLayout = styled.div<{ themes: Theme }>(({ themes: { spacingByChar } }) => css`
    flex-shrink: 0;
    margin-left: auto;
    padding-right: ${spacingByChar(1)};
    button:not(:first-child) {
      margin-left: ${spacingByChar(0.5)};
    }
  `)
const JobList = styled.ul<{ isExpanded: boolean; themes: Theme }>(
  ({ isExpanded, themes: { border, spacingByChar } }) => css`
      margin: 0;
      list-style: none;
      padding: ${spacingByChar(1)};
      border-top: ${border.shorthand};
      ${!isExpanded &&
      css`
        height: 0;
        visibility: hidden;
        overflow: hidden;
        padding-top: 0;
        padding-bottom: 0;
        border: none;
      `}
    `,
)
const Job = styled.li<{ themes: Theme }>(({ themes: { spacingByChar } }) => css`
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    line-height: normal;
    :not(:first-child) {
      margin-top: ${spacingByChar(1)};
    }
  `)
const JobIconWrapper = styled.div`
  flex-shrink: 0;
  line-height: 0;
`
const JobNameText = styled(OmittableJobText)<{ themes: Theme }>(
  ({ themes: { fontSize, spacingByChar } }) => css`
      margin-left: ${spacingByChar(0.5)};
      font-size: ${fontSize.M};
    `,
)
const JobDescText = styled(OmittableJobText)<{ themes: Theme }>(
  ({ themes: { fontSize, spacingByChar } }) => css`
      margin-left: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};
    `,
)
const CancelButton = styled(UnstyledButton)<{ themes: Theme }>(
  ({ themes: { color, fontSize, spacingByChar } }) => css`
      flex-shrink: 0;
      margin-left: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};
      color: ${color.TEXT_LINK};
      cursor: pointer;
      :hover {
        text-decoration: underline;
      }
    `,
)
