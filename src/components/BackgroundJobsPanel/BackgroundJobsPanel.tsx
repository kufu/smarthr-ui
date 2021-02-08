import React, { FC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useId } from '../../hooks/useId'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Base } from '../Base'
import { SecondaryButton } from '../Button'
import { ResetButton } from '../Button/ResetButton'
import { FaMinusIcon, FaTimesIcon, FaWindowMaximizeIcon } from '../Icon'
import { JobIcon } from './JobIcon'
import { OmittableJobText } from './OmittableJobText'

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
  className?: string
}

export const BackgroundJobsPanel: FC<Props> = ({
  title,
  jobs,
  onClickCancelJob,
  onClickExpansion,
  onClickClose,
  className,
  ...props
}) => {
  const themes = useTheme()
  const isExpansionControlled = props.isExpanded !== undefined

  const [isExpanded, setIsExpanded] = useState(isExpansionControlled ? !!props.isExpanded : true)
  useEffect(() => {
    if (isExpansionControlled) {
      setIsExpanded(!!props.isExpanded)
    }
  }, [isExpansionControlled, props.isExpanded])

  const jobListId = useId()

  return (
    <Container themes={themes} className={className}>
      <Header>
        <Title themes={themes}>{title}</Title>
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
          >
            {isExpanded ? <FaMinusIcon size={13} /> : <FaWindowMaximizeIcon size={13} />}
          </SecondaryButton>
          <SecondaryButton type="button" size="s" square onClick={onClickClose}>
            <FaTimesIcon size={13} aria-label="Close" />
          </SecondaryButton>
        </HeaderButtonLayout>
      </Header>
      <JobList themes={themes} isExpanded={isExpanded} id={jobListId}>
        {jobs.map((job) => {
          const handleClickCancelJob = onClickCancelJob ? () => onClickCancelJob(job.id) : undefined
          return (
            <Job key={job.id} themes={themes}>
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
const Title = styled.div<{ themes: Theme }>(({ themes }) => {
  const { font, pxToRem, space } = themes.size
  return css`
    font-size: ${pxToRem(font.TALL)};
    padding: ${pxToRem(space.XS)};
  `
})
const HeaderButtonLayout = styled.div<{ themes: Theme }>(({ themes }) => {
  const { pxToRem, space } = themes.size
  return css`
    flex-shrink: 0;
    margin-left: auto;
    padding-right: ${pxToRem(space.XS)};
    button:not(:first-child) {
      margin-left: ${pxToRem(space.XXS)};
    }
  `
})
const JobList = styled.ul<{ isExpanded: boolean; themes: Theme }>(({ isExpanded, themes }) => {
  const { pxToRem, space } = themes.size
  return css`
    margin: 0;
    list-style: none;
    padding: ${pxToRem(space.XS)};
    border-top: ${themes.frame.border.default};
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
})
const Job = styled.li<{ themes: Theme }>(({ themes }) => {
  const { pxToRem, space } = themes.size
  return css`
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    line-height: normal;
    :not(:first-child) {
      margin-top: ${pxToRem(space.XS)};
    }
  `
})
const JobIconWrapper = styled.div`
  flex-shrink: 0;
  line-height: 0;
`
const JobName = styled(OmittableJobText)<{ themes: Theme }>(({ themes }) => {
  const { font, pxToRem, space } = themes.size
  return css`
    margin-left: ${pxToRem(space.XXS)};
    font-size: ${pxToRem(font.TALL)};
  `
})
const JobDesc = styled(OmittableJobText)<{ themes: Theme }>(({ themes }) => {
  const { font, pxToRem, space } = themes.size
  return css`
    margin-left: ${pxToRem(space.XXS)};
    font-size: ${pxToRem(font.SHORT)};
  `
})
const CancelButton = styled(ResetButton)<{ themes: Theme }>(({ themes }) => {
  const { font, pxToRem, space } = themes.size
  return css`
    flex-shrink: 0;
    margin-left: ${pxToRem(space.XXS)};
    font-size: ${pxToRem(font.SHORT)};
    color: ${themes.palette.TEXT_LINK};
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  `
})
