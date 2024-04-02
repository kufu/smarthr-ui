import { StoryFn } from '@storybook/react'
import React from 'react'
import { IconBase } from 'react-icons'
import styled, { css } from 'styled-components'

import { BaseColumn } from '../Base'
import { Cluster, Stack } from '../Layout'
import { Text } from '../Text'

import * as DeprecatedIcons from './DeprecatedIcon'
import * as Icons from './Icon'
import { generateIcon } from './generateIcon'

const { FaAddressBookIcon, FaBullhornIcon, WarningIcon } = Icons
const { FaInfoCircleIcon } = DeprecatedIcons

export default {
  title: 'Media（メディア）/Icon',
  component: FaAddressBookIcon,
  parameters: {
    withTheming: true,
  },
}

export const All: StoryFn = () => {
  const iconNames = Object.keys(Icons)
  const deplicatedIconNames = Object.keys(DeprecatedIcons)

  return (
    <Stack gap={2}>
      <Cluster gap={0.75} as="dl">
        {Object.values(Icons).map((Icon, index) => (
          <ItemWrapper key={`${Icon.displayName}`}>
            <dt>{iconNames[index]?.replace(/Icon$/, '')}</dt>
            <dd>
              <Icon />
            </dd>
          </ItemWrapper>
        ))}
      </Cluster>
      <div>
        旧名称（非推奨）
        <Cluster gap={0.75} as="dl">
          {Object.values(DeprecatedIcons).map((Icon, index) => (
            <ItemWrapper key={`${Icon.displayName}`}>
              <dt>{deplicatedIconNames[index]?.replace(/Icon$/, '')}</dt>
              <dd>
                <Icon />
              </dd>
            </ItemWrapper>
          ))}
        </Cluster>
      </div>
    </Stack>
  )
}
export const AltText: StoryFn = () => (
  <div>
    <p>
      <span id="text">連絡帳</span>
    </p>
    <dl>
      <dt>visually hidden text</dt>
      <dd>
        <FaAddressBookIcon alt="連絡帳" />
      </dd>
      <dt>
        <code>aria-labelledby</code>
      </dt>
      <dd>
        <FaAddressBookIcon aria-labelledby="text" />
      </dd>
      <dt>
        <code>aria-label</code>
      </dt>
      <dd>
        <FaAddressBookIcon aria-label="連絡帳" />
      </dd>
      <dt>
        none ( <code>aria-hidden</code> )
      </dt>
      <dd>
        <FaAddressBookIcon />
      </dd>
    </dl>
  </div>
)

export const Color: StoryFn = () => (
  <Cluster>
    <FaAddressBookIcon color="MAIN" />
    <FaAddressBookIcon color="DANGER" />
    <FaAddressBookIcon color="TEXT_GREY" />
    <FaAddressBookIcon color="TEXT_DISABLED" />
  </Cluster>
)

export const Size: StoryFn = () => (
  <Cluster>
    <FaAddressBookIcon size="XXS" />
    <FaAddressBookIcon size="XS" />
    <FaAddressBookIcon size="S" />
    <FaAddressBookIcon size="M" />
    <FaAddressBookIcon size="L" />
    <FaAddressBookIcon size="XL" />
    <FaAddressBookIcon size="XXL" />
    <WarningIcon size="XXL" />
  </Cluster>
)

export const WithText: StoryFn = () => (
  <Stack align="flex-start">
    <FaAddressBookIcon text="連絡帳" />
    <FaAddressBookIcon text="連絡帳（逆位置）" right />
    <Text as="p">
      文中にも
      <FaBullhornIcon text="アイコン付きテキスト" />
      を使えます。
    </Text>
    <Text as="p" size="XL">
      <FaInfoCircleIcon text="文字サイズは親要素から継承されます。" />
    </Text>
  </Stack>
)

export const GenerateIcon: StoryFn = () => {
  const GitHubIcon = generateIcon((props) => (
    <svg {...props} viewBox="0 0 496 512">
      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
    </svg>
  ))

  const ConnectIcon = generateIcon((props) => (
    <IconBase {...props} viewBox="0 0 11 12">
      <path
        d="M8.77449 6.60826C7.75828 6.60899 6.87185 7.29623 6.62106 8.27778H4.54243C4.06288 8.27778 3.67413 7.8903 3.67413 7.41233C3.67413 6.93435 4.06288 6.54687 4.54243 6.54687H6.45609C7.54214 6.54687 8.42255 5.66934 8.42255 4.58686C8.42255 3.50437 7.54214 2.62684 6.45609 2.62684H4.37856C4.10135 1.54418 3.05899 0.836455 1.9467 0.975691C0.834409 1.11493 0 2.05759 0 3.17494C0 4.2923 0.834409 5.23496 1.9467 5.37419C3.05899 5.51343 4.10135 4.8057 4.37856 3.72305H6.45609C6.93473 3.72305 7.32274 4.10979 7.32274 4.58686C7.32274 5.06392 6.93473 5.45067 6.45609 5.45067H4.54243C3.4742 5.47584 2.62139 6.3462 2.62139 7.41123C2.62139 8.47626 3.4742 9.34662 4.54243 9.37179H6.62106C6.90655 10.4891 8.0038 11.2017 9.14461 11.0107C10.2854 10.8196 11.0887 9.78868 10.9921 8.6397C10.8955 7.49071 9.93129 6.60743 8.77449 6.60826V6.60826ZM2.22433 4.18348C1.6637 4.18348 1.20921 3.73049 1.20921 3.17169C1.20921 2.61289 1.6637 2.15989 2.22433 2.15989C2.78497 2.15989 3.23945 2.61289 3.23945 3.17169C3.23885 3.73024 2.78472 4.18288 2.22433 4.18348ZM8.77426 9.83548C8.36339 9.83592 7.99276 9.58945 7.83542 9.21113C7.67808 8.83281 7.76506 8.39727 8.05576 8.10784C8.34645 7.81842 8.78352 7.73219 9.16291 7.88943C9.5423 8.04666 9.78918 8.41634 9.78829 8.82587C9.78647 9.38314 9.33336 9.83427 8.77426 9.83548V9.83548Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </IconBase>
  ))

  return (
    <Stack>
      <p>
        <code>
          generateIcon で生成したアイコンは <code>alt</code> や <code>text</code> など、SmartHR UI
          が提供しているアイコンと同じ振る舞いを持ちます。
        </code>
      </p>
      <BaseColumn>
        <Cluster>
          <GitHubIcon />
          <ConnectIcon />
        </Cluster>
      </BaseColumn>
      <p>
        <GitHubIcon color="BRAND" text="これは FontAwesome の GitHub アイコンです。" />
        <br />
        <ConnectIcon color="TEXT_LINK" text="これは基本機能で使っている連携アイコンです。" />
      </p>
    </Stack>
  )
}

const ItemWrapper = styled(BaseColumn)`
  ${({ theme: { space } }) => css`
    flex-basis: 10em;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${space(0.5)};
  `}
`
