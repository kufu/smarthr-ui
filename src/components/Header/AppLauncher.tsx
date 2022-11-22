import React, { ComponentProps, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Cluster, Stack } from '../Layout'
import { Theme, useTheme } from '../../hooks/useTheme'
import { TextLink } from '../TextLink'
import { Heading } from '../Heading'
import { FaExternalLinkAlt } from 'react-icons/fa'

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

export const AppLauncher: React.FC<Props & ElementProps> = ({ apps, urlToShowAll }) => {
  const { base, roumu, jinmane, renkei, plus } = apps
  const themes = useTheme()
  return (
    <Wrapper themes={themes}>
      {base && (
        <Stack gap={0.5}>
          <Heading type="subBlockTitle">基本機能</Heading>
          <Stack as="ul" gap={0.5}>
            {base.map((item, index) => (
              <li key={index}>
                <TextLink href={item.url} target={item.target} suffix={<FaExternalLinkAlt />}>
                  {item.label}
                </TextLink>
              </li>
            ))}
          </Stack>
        </Stack>
      )}
      <Cluster gap={1.5}>
        {roumu && (
          <Stack gap={0.5}>
            <Heading type="subBlockTitle">人事労務</Heading>
            <Stack as="ul" gap={0.5}>
              {roumu.map((item, index) => (
                <li key={index}>
                  <TextLink href={item.url} target={item.target} suffix={<FaExternalLinkAlt />}>
                    {item.label}
                  </TextLink>
                </li>
              ))}
            </Stack>
          </Stack>
        )}
        {jinmane && (
          <Stack gap={0.5}>
            <Heading type="subBlockTitle">人材マネジメント</Heading>
            <Stack as="ul" gap={0.5}>
              {jinmane.map((item, index) => (
                <li key={index}>
                  <TextLink href={item.url} target={item.target} suffix={<FaExternalLinkAlt />}>
                    {item.label}
                  </TextLink>
                </li>
              ))}
            </Stack>
          </Stack>
        )}
      </Cluster>
      {renkei && (
        <Stack gap={0.5}>
          <Heading type="subBlockTitle">連携</Heading>
          <Stack as="ul" gap={0.5}>
            {renkei.map((item, index) => (
              <li key={index}>
                <TextLink href={item.url} target={item.target} suffix={<FaExternalLinkAlt />}>
                  {item.label}
                </TextLink>
              </li>
            ))}
          </Stack>
        </Stack>
      )}
      {plus && (
        <Stack gap={0.5}>
          <Heading type="subBlockTitle">SmartHR Plus</Heading>
          <Stack as="ul" gap={0.5}>
            {plus.map((item, index) => (
              <li key={index}>
                <TextLink href={item.url} target={item.target} suffix={<FaExternalLinkAlt />}>
                  {item.label}
                </TextLink>
              </li>
            ))}
          </Stack>
        </Stack>
      )}
      <TextLink href={urlToShowAll} suffix={<FaExternalLinkAlt />} style={{ width: 'fit-content' }}>
        {urlToShowAll}
      </TextLink>
    </Wrapper>
  )
}

const Wrapper = styled(Stack)<{ themes: Theme }>(
  ({ themes: { space } }) => css`
    padding: ${space(1)};
  `,
)
