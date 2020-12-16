import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Icon } from '../Icon'

storiesOf('[TBD] Downloader', module).add('all', () => {
  const themes = useTheme()
  return (
    <Wrapper>
      <Title>To Be Developed</Title>
      <Description>This component will develop in the near future.</Description>
      <Link
        themes={themes}
        href="https://smarthr.invisionapp.com/share/ADUDJ8BW74C#/386514188_downloaders"
        target="_blank"
      >
        <LinkText>Design of Downloader (InVision)</LinkText>
        <LinkIcon name="fa-external-link-alt" size={14} />
      </Link>
    </Wrapper>
  )
})

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 24px;
  border-radius: 6px;
  box-shadow: rgba(51, 51, 51, 0.3) 1px 1px 4px 0;
  color: #333;
  font-size: 14px;
  text-align: center;
  line-height: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Title = styled.h1`
  display: block;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
`

const Description = styled.div`
  margin-bottom: 16px;
`

const Link = styled.a<{ themes: Theme }>`
  color: ${({ themes }) => themes.palette.TEXT_LINK};
`
const LinkText = styled.span`
  vertical-align: middle;
`

const LinkIcon = styled(Icon)`
  margin-left: 4px;
  vertical-align: middle;
`
