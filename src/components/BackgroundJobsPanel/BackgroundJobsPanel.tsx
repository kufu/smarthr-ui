import React, { FC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useId } from '../../hooks/useId'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Base } from '../Base'
import { SecondaryButton } from '../Button'
import { ResetButton } from '../Button/ResetButton'
import { Icon } from '../Icon'
import { JobIcon } from './JobIcon'
import { OmittableJobText } from './OmittableJobText'

type JobId = string | number
export type Status = 'processing' | 'downloading' | 'warning' | 'error' | 'done'

type Job = {
  id: JobId
  status: Status
  name: string
  description: string
  isCancelable?: boolean
}

type Props = {
  title: string
  jobs: Job[]
  isExpanded?: boolean
  onClickCancelJob?: (jobId: JobId) => void
  onClickExpansion?: (isExpanded: boolean) => void
  onClickClose?: () => void
  className?: string
}

export const BackgroundJobsPanel: FC<Props> = ({
  title,
  jobs,
  isExpanded,
  onClickCancelJob,
  onClickExpansion,
  onClickClose,
  className,
}) => {
  const themes = useTheme()
  const isExpansionControlled = isExpanded !== undefined

  const [shouldExpand, setShouldExpand] = useState(isExpansionControlled ? !!isExpanded : true)
  useEffect(() => {
    if (isExpansionControlled) {
      setShouldExpand(!!isExpanded)
    }
  }, [isExpansionControlled, isExpanded])

  const jobListId = useId()

  return (
    <Container themes={themes} className={className}>
      <Header>
        <Title themes={themes}>{title}</Title>
        <HeaderButtonLayout themes={themes}>
          <SecondaryButton
            size="s"
            square
            onClick={() => {
              onClickExpansion && onClickExpansion(!shouldExpand)
              if (!isExpansionControlled) {
                setShouldExpand(!shouldExpand)
              }
            }}
            aria-expanded={shouldExpand}
            aria-controls={jobListId}
          >
            <Icon name={shouldExpand ? 'fa-minus' : 'fa-window-maximize'} size={13} />
          </SecondaryButton>
          <SecondaryButton size="s" square onClick={onClickClose}>
            <Icon name="fa-times" size={13} aria-label="Close" />
          </SecondaryButton>
        </HeaderButtonLayout>
      </Header>
      <JobList themes={themes} isExpanded={shouldExpand} id={jobListId}>
        {jobs.map((job) => {
          return (
            <Job key={job.id} themes={themes}>
              <JobIconWrapper>
                <JobIcon status={job.status} />
              </JobIconWrapper>
              <JobName themes={themes}>{job.name}</JobName>
              <JobDesc themes={themes}>{job.description}</JobDesc>
              {job.isCancelable && onClickCancelJob && (
                <CancelButton onClick={() => onClickCancelJob(job.id)} themes={themes}>
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
    align-items: flex-start;
    flex-wrap: nowrap;
    line-height: 1rem;
    :not(:first-child) {
      margin-top: ${pxToRem(space.XS)};
    }
  `
})
const JobIconWrapper = styled.div`
  flex-shrink: 0;
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
