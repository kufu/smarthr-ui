import { Panel } from '../../Panel'
import { Scroller } from '../Scroller'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Scroller',
  component: Scroller,
  render: (args) => (
    <Scroller {...args} style={{ height: '200px' }}>
      <Panel padding={1.5}>
        <p>スクロール可能なコンテンツです。</p>
        <p>この領域は縦方向にスクロールできます。</p>
        <p>コンテンツが領域を超える場合、スクロールバーが表示されます。</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit.</p>
        <p>Excepteur sint occaecat cupidatat non proident sunt in culpa.</p>
        <p>Qui officia deserunt mollit anim id est laborum.</p>
        <p>コンテンツの最終行です。</p>
      </Panel>
    </Scroller>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Scroller>

export const Playground: StoryObj<typeof Scroller> = {}

export const DirectionVertical: StoryObj<typeof Scroller> = {
  name: 'direction (vertical)',
  render: (args) => (
    <Scroller {...args} style={{ height: '200px' }}>
      <Panel padding={1.5}>
        <p>スクロール可能なコンテンツです。</p>
        <p>この領域は縦方向にスクロールできます。</p>
        <p>コンテンツが領域を超える場合、スクロールバーが表示されます。</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit.</p>
        <p>Excepteur sint occaecat cupidatat non proident sunt in culpa.</p>
        <p>Qui officia deserunt mollit anim id est laborum.</p>
        <p>コンテンツの最終行です。</p>
      </Panel>
    </Scroller>
  ),
  args: {
    direction: 'vertical',
    styleType: 'auto',
  },
}

export const DirectionHorizontal: StoryObj<typeof Scroller> = {
  name: 'direction (horizontal)',
  render: (args) => (
    <Scroller {...args} style={{ width: '300px' }}>
      <Panel padding={1.5}>
        <div style={{ width: '800px' }}>
          <p>横方向にスクロール可能なコンテンツです。この領域は横方向にスクロールできます。</p>
        </div>
      </Panel>
    </Scroller>
  ),
  args: {
    direction: 'horizontal',
    styleType: 'auto',
  },
}

export const DirectionBoth: StoryObj<typeof Scroller> = {
  name: 'direction (both)',
  render: (args) => (
    <Scroller {...args} style={{ height: '200px', width: '300px' }}>
      <Panel padding={1.5}>
        <div style={{ width: '800px' }}>
          <p>縦横両方向にスクロール可能なコンテンツです。</p>
          <p>この領域は縦横両方向にスクロールできます。</p>
          <p>コンテンツが領域を超える場合、両方向にスクロールバーが表示されます。</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit.</p>
          <p>Excepteur sint occaecat cupidatat non proident sunt in culpa.</p>
          <p>Qui officia deserunt mollit anim id est laborum.</p>
          <p>コンテンツの最終行です。</p>
        </div>
      </Panel>
    </Scroller>
  ),
  args: {
    direction: 'both',
    styleType: 'auto',
  },
}

export const StyleTypeScroll: StoryObj<typeof Scroller> = {
  name: 'styleType (scroll)',
  render: (args) => (
    <Scroller {...args} style={{ height: '200px' }}>
      <Panel padding={1.5}>
        <p>
          styleType: scroll を指定すると、コンテンツが少なくてもスクロールバーが常に表示されます。
        </p>
        <p>この例では、コンテンツが領域に収まっていますが、スクロールバーが表示されます。</p>
      </Panel>
    </Scroller>
  ),
  args: {
    styleType: 'scroll',
  },
}

export const WithoutScroll: StoryObj<typeof Scroller> = {
  name: 'スクロールなし',
  render: (args) => (
    <Scroller {...args} style={{ height: '200px' }}>
      <Panel padding={1.5}>
        <p>スクロールが不要なコンテンツです。</p>
        <p>コンテンツが領域内に収まっているため、スクロールバーは表示されません。</p>
      </Panel>
    </Scroller>
  ),
}
