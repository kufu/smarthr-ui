import React, { ComponentProps, VFC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useId } from '../../hooks/useId'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Base } from '../Base'
import { SecondaryButton } from '../Button'
import { ResetButton } from '../Button/ResetButton'
import { FaMinusIcon, FaTimesIcon, FaWindowMaximizeIcon } from '../Icon'
import { JobIcon } from './JobIcon'
import { OmittableJobText } from './OmittableJobText'
import { useClassNames } from './useClassNames'

type JobId = string | number
export type Status = 'processing' | 'downloading' | 'warning' | 'error' | 'done'

export type JobProps = {
  id: JobId
  status: Status
  name: string
  description: string
  isCancelable?: boolean
}

type Props = {
  title: string
  jobs: JobProps[]
  isExpanded?: boolean
  onClickCancelJob?: (jobId: JobId) => void
  onClickExpansion?: (isExpanded: boolean) => void
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
          <SecondaryButton
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
            {isExpanded ? <FaMinusIcon size={13} /> : <FaWindowMaximizeIcon size={13} />}
          </SecondaryButton>
          <SecondaryButton
            type="button"
            size="s"
            square
            onClick={onClickClose}
            className={classNames.closeButton}
          >
            <FaTimesIcon size={13} aria-label="Close" />
          </SecondaryButton>
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
              <JobName themes={themes}>{job.name}</JobName>
              <JobDesc themes={themes}>{job.description}</JobDesc>
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

const Container = styled(Base)<{ themes: Theme }>(({ themes }) => {
  return css`
    display: inline-flex;
    flex-direction: column;
    min-width: 420px;
    max-width: 600px;
    color: ${themes.palette.TEXT_BLACK};
  `
})
const Header = styled.div`
  display: flex;
  align-items: center;
`
const Title = styled.div<{ themes: Theme }>(({ themes: { size, spacingByChar } }) => {
  const { font, pxToRem } = size
  return css`
    font-size: ${pxToRem(font.TALL)};
    padding: ${spacingByChar(1)};
  `
})
const HeaderButtonLayout = styled.div<{ themes: Theme }>(({ themes: { spacingByChar } }) => {
  return css`
    flex-shrink: 0;
    margin-left: auto;
    padding-right: ${spacingByChar(1)};
    button:not(:first-child) {
      margin-left: ${spacingByChar(0.5)};
    }
  `
})
const JobList = styled.ul<{ isExpanded: boolean; themes: Theme }>(
  ({ isExpanded, themes: { frame, spacingByChar } }) => {
    return css`
      margin: 0;
      list-style: none;
      padding: ${spacingByChar(1)};
      border-top: ${frame.border.default};
      ${!isExpanded &&
      css`
        height: 0;
        visibility: hidden;
        overflow: hidden;
        padding-top: 0;
        padding-bottom: 0;
        border: none;
      `}
    `
  },
)
const Job = styled.li<{ themes: Theme }>(({ themes: { spacingByChar } }) => {
  return css`
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    line-height: normal;
    :not(:first-child) {
      margin-top: ${spacingByChar(1)};
    }
  `
})
const JobIconWrapper = styled.div`
  flex-shrink: 0;
  line-height: 0;
`
const JobName = styled(OmittableJobText)<{ themes: Theme }>(
  ({ themes: { size, spacingByChar } }) => {
    const { font, pxToRem } = size
    return css`
      margin-left: ${spacingByChar(0.5)};
      font-size: ${pxToRem(font.TALL)};
    `
  },
)
const JobDesc = styled(OmittableJobText)<{ themes: Theme }>(
  ({ themes: { size, spacingByChar } }) => {
    const { font, pxToRem } = size
    return css`
      margin-left: ${spacingByChar(0.5)};
      font-size: ${pxToRem(font.SHORT)};
    `
  },
)
const CancelButton = styled(ResetButton)<{ themes: Theme }>(
  ({ themes: { color, size, spacingByChar } }) => {
    const { font, pxToRem } = size
    return css`
      flex-shrink: 0;
      margin-left: ${spacingByChar(0.5)};
      font-size: ${pxToRem(font.SHORT)};
      color: ${color.TEXT_LINK};
      cursor: pointer;
      :hover {
        text-decoration: underline;
      }
    `
  },
)
