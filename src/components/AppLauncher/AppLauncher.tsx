import React, { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Cluster, Stack } from '../Layout'
import { Theme, useTheme } from '../../hooks/useTheme'
import { TextLink } from '../TextLink'
import { Heading } from '../Heading'
import { useClassNames } from './useClassNames'

type Props = {
  apps: {
    [key: string]: Array<{
      label: string
      url: string
      target?: string
    }>
  }
  urlToShowAll: string
}

type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

export const AppLauncher: React.FC<Props & ElementProps> = ({ apps, urlToShowAll, ...props }) => {
  const className = useClassNames()
  const { base, roumu, jinmane, renkei, plus } = apps
  const themes = useTheme()
  return (
    <Wrapper {...props} className={className.wrapper}>
      <UpperWrapper themes={themes}>
        {base && (
          <Stack gap={0.5} className={className.category}>
            <Heading type="subSubBlockTitle">基本機能</Heading>
            <Cluster as="ul" gap={1}>
              {base.map((item, index) => (
                <li key={index}>
                  <TextLink href={item.url} target={item.target} className={className.link}>
                    {item.label}
                  </TextLink>
                </li>
              ))}
            </Cluster>
          </Stack>
        )}
        <Cluster gap={1.5}>
          {roumu && (
            <Stack gap={0.5} className={className.category}>
              <Heading type="subSubBlockTitle">人事労務</Heading>
              <Stack as="ul" gap={0.5}>
                {roumu.map((item, index) => (
                  <li key={index}>
                    <TextLink href={item.url} target={item.target} className={className.link}>
                      {item.label}
                    </TextLink>
                  </li>
                ))}
              </Stack>
            </Stack>
          )}
          {jinmane && (
            <Stack gap={0.5} className={className.category}>
              <Heading type="subSubBlockTitle">人材マネジメント</Heading>
              <Stack as="ul" gap={0.5}>
                {jinmane.map((item, index) => (
                  <li key={index}>
                    <TextLink href={item.url} target={item.target} className={className.link}>
                      {item.label}
                    </TextLink>
                  </li>
                ))}
              </Stack>
            </Stack>
          )}
          {renkei && (
            <Stack gap={0.5} className={className.category}>
              <Heading type="subSubBlockTitle">連携</Heading>
              <Stack as="ul" gap={0.5}>
                {renkei.map((item, index) => (
                  <li key={index}>
                    <TextLink href={item.url} target={item.target} className={className.link}>
                      {item.label}
                    </TextLink>
                  </li>
                ))}
              </Stack>
            </Stack>
          )}
          {plus && (
            <Stack gap={0.5} className={className.category}>
              <Heading type="subSubBlockTitle">SmartHR Plus</Heading>
              <Stack as="ul" gap={0.5}>
                {plus.map((item, index) => (
                  <li key={index}>
                    <TextLink href={item.url} target={item.target} className={className.link}>
                      {item.label}
                    </TextLink>
                  </li>
                ))}
              </Stack>
            </Stack>
          )}
        </Cluster>
      </UpperWrapper>
      <Border themes={themes} />

      <LowerWrapper themes={themes}>
        <TextLink href={urlToShowAll} style={{ width: 'fit-content' }}>
          {urlToShowAll}
        </TextLink>
      </LowerWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div``

const Border = styled.div<{ themes: Theme }>(
  ({ themes: { border } }) => css`
    border-bottom: ${border.shorthand};
  `,
)
const UpperWrapper = styled(Stack)<{ themes: Theme }>(
  ({ themes: { space } }) => css`
    padding: ${space(0.5)} ${space(1)} ${space(1)} ${space(1)};
  `,
)

const LowerWrapper = styled(Stack)<{ themes: Theme }>(
  ({ themes: { space } }) => css`
    padding: ${space(0.75)} ${space(1)} ${space(0.5)} ${space(1)};
  `,
)
