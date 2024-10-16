import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Stack } from '../Stack'

import { ColorBox } from './ComponentsForStories'

export default {
  title: 'Layouts（レイアウト）/Stack',
  component: Stack,
  render: (args) => (
    <Stack {...args}>
      <ColorBox />
      <ColorBox />
    </Stack>
  ),
  parameters: {
    withTheming: true,
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Stack>

export const Playground: StoryObj<typeof Stack> = {}

export const Inline: StoryObj<typeof Stack> = {
  args: {
    inline: true,
  },
}

export const Gap: StoryObj<typeof Stack> = {
  args: {
    gap: 'XL',
  },
}

export const Align: StoryObj<typeof Stack> = {
  args: {
    align: 'center',
  },
}

export const As: StoryObj<typeof Stack> = {
  args: {
    as: 'section',
  },
}

// export const All: StoryFn = () => (
//   <Cluster gap={2}>
//     <Content>
//       <Stack>
//         <Base padding={0.5}>
//           <Base padding={0.5}>各要素の間隔は 1rem が標準です。</Base>
//         </Base>
//         <Base padding={0.5}>
//           <Base padding={0.5}>gap を使って間隔を変えられます。</Base>
//         </Base>
//         <Base padding={0.5}>
//           <Stack>
//             <Base padding={0.5}>Stack で囲んだ直下の子孫要素に対してのみ、影響を与えます。</Base>

//             <Stack gap={0.5} as="section">
//               {/* TODO: eslint を修正したら外す */}
//               {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
//               <Heading type="blockTitle">入れ子にして別の値を指定できます。</Heading>
//               <BaseColumn>
//                 <Base padding={0.5}>同じ要素である必要もありません。</Base>
//               </BaseColumn>
//             </Stack></Base>
//           </Stack></Base>
//         </Base>
//       </Stack></Base>
//     </Content>
//     <SideAreaStack gap="XXS" className="[&_>_:not([hidden]):nth-child(2)]:shr-mb-auto">
//       <Base padding={0.5}>
//         <Base padding={0.5}>各要素の間隔は 1rem が標準です。</Base>
//       </Base>
//       <Base padding={0.5}>
//         <Base padding={0.5}>抽象トークンも渡せます。</Base>
//       </Base>
//       <Base padding={0.5}>
//         <Base padding={0.5}>
//           要素を離して表示したい場合は、
//           <code>[&_&gt;_:not([hidden]):nth-child(2)]:shr-mb-auto</code>
//           と書きます。
//         </Base>
//       </Base>
//       <Base padding={0.5}>
//         <Base padding={0.5}>この場合、Stack の高さは対峙する要素より高さが必要です。</Base>
//       </Base>
//     </SideAreaStack>
//   </Cluster>
// )

// const SideAreaStack = styled(Stack)`
//   flex: 1;
// `
// const Content = styled.div`
//   flex: 3;
//   min-height: 30vw;
// `
