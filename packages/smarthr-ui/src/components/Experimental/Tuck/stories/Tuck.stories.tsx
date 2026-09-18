import { type FC, type PropsWithChildren, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { Chip } from '../../../Chip'
import { DialogCloser, DialogContent, DialogTrigger, DialogWrapper } from '../../../Dialog'
import { DropdownMenuButton } from '../../../Dropdown'
import { Cluster, Sidebar, Stack } from '../../../Layout'
import { TabItem } from '../../../TabBar'
import { Tuck } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

const SKILLS = [
  'TypeScript',
  'React',
  'Next.js',
  'Ruby on Rails',
  'Go',
  'PostgreSQL',
  'アクセシビリティ',
  'デザインシステム',
  'Figma',
  'AWS',
  'Terraform',
  'GraphQL',
  'テスト設計',
  'パフォーマンスチューニング',
  'ユーザーインタビュー',
]

// HINT: 幅による挙動を確かめられるよう、右下のハンドルで幅を変えられる枠
const ResizableBox: FC<PropsWithChildren<{ width?: string }>> = ({ width = '480px', children }) => (
  <div
    className="shr-border-shorthand shr-box-border shr-max-w-full shr-resize-x shr-overflow-hidden shr-p-1"
    style={{ width }}
  >
    {children}
  </div>
)

export default {
  title: 'Experimental/Tuck',
  component: Tuck,
  render: (args) => (
    <ResizableBox>
      {/* eslint-disable-next-line smarthr/best-practice-for-layouts -- Tuck は子要素を複数のアイテムとして Cluster に並べるため */}
      <Cluster>
        <Tuck {...args}>
          {SKILLS.map((skill) => (
            <Chip key={skill}>{skill}</Chip>
          ))}
        </Tuck>
      </Cluster>
    </ResizableBox>
  ),
  args: {
    renderTucked: (items) => <Chip color="blue">+{items.length}</Chip>,
  },
  argTypes: {
    renderTucked: { control: false },
    maxLines: { control: { type: 'number', min: 1 } },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Tuck>

export const Playground: StoryObj<typeof Tuck> = {
  args: {
    maxLines: 1,
    collapse: 'partial',
  },
}

const DynamicChildrenDemo: FC = () => {
  const [skills, setSkills] = useState(SKILLS.slice(0, 5))
  const [longFirst, setLongFirst] = useState(false)

  return (
    <Stack>
      <Cluster>
        <Button
          disabled={skills.length === SKILLS.length}
          size="S"
          onClick={() => setSkills(SKILLS.slice(0, skills.length + 1))}
        >
          追加
        </Button>
        <Button
          disabled={skills.length === 0}
          size="S"
          onClick={() => setSkills(SKILLS.slice(0, skills.length - 1))}
        >
          末尾を削除
        </Button>
        <Button size="S" onClick={() => setSkills([...skills].reverse())}>
          並びを反転
        </Button>
        <Button size="S" onClick={() => setLongFirst(!longFirst)}>
          先頭のラベルを{longFirst ? '戻す' : '長くする'}
        </Button>
      </Cluster>
      <ResizableBox>
        {/* eslint-disable-next-line smarthr/best-practice-for-layouts -- Tuck は子要素を複数のアイテムとして Cluster に並べるため */}
        <Cluster>
          <Tuck renderTucked={(items) => <Chip color="blue">+{items.length}</Chip>}>
            {skills.map((skill, i) => (
              <Chip key={skill}>
                {i === 0 && longFirst ? `${skill}（とても長いラベルに変わりました）` : skill}
              </Chip>
            ))}
          </Tuck>
        </Cluster>
      </ResizableBox>
    </Stack>
  )
}

export const DynamicChildren: StoryObj<typeof Tuck> = {
  name: 'children の中身が変わる',
  render: () => <DynamicChildrenDemo />,
}

export const ButtonsIntoDropdown: StoryObj<typeof Tuck> = {
  name: 'Button 群を DropdownMenuButton にまとめる',
  render: () => (
    <ResizableBox>
      {/* eslint-disable-next-line smarthr/best-practice-for-layouts -- Tuck は子要素を複数のアイテムとして Cluster に並べるため */}
      <Cluster>
        <Tuck
          collapse="all"
          renderTucked={(items) => <DropdownMenuButton trigger="操作">{items}</DropdownMenuButton>}
        >
          <Button onClick={action('複製')}>複製</Button>
          <Button onClick={action('CSVダウンロード')}>CSVダウンロード</Button>
          <Button onClick={action('アーカイブ')}>アーカイブ</Button>
          <Button variant="danger" onClick={action('削除')}>
            削除
          </Button>
        </Tuck>
      </Cluster>
    </ResizableBox>
  ),
}

export const ChipsIntoDialog: StoryObj<typeof Tuck> = {
  name: 'Chip を2行まで表示し、残りは Dialog に逃がす',
  render: () => (
    <ResizableBox>
      {/* eslint-disable-next-line smarthr/best-practice-for-layouts -- Tuck は子要素を複数のアイテムとして Cluster に並べるため */}
      <Cluster align="center">
        <Tuck
          maxLines={2}
          renderTucked={(items) => (
            <DialogWrapper>
              <DialogTrigger>
                <Button size="S">他{items.length}件</Button>
              </DialogTrigger>
              <DialogContent ariaLabel="すべてのスキル">
                <Stack className="shr-p-1.5">
                  <Cluster>
                    {SKILLS.map((skill) => (
                      <Chip key={skill}>{skill}</Chip>
                    ))}
                  </Cluster>
                  <DialogCloser>
                    <Button>閉じる</Button>
                  </DialogCloser>
                </Stack>
              </DialogContent>
            </DialogWrapper>
          )}
        >
          {SKILLS.map((skill) => (
            <Chip key={skill}>{skill}</Chip>
          ))}
        </Tuck>
      </Cluster>
    </ResizableBox>
  ),
}

const TABS = [
  { id: 'basic', label: '基本情報' },
  { id: 'contact', label: '連絡先' },
  { id: 'employment', label: '雇用契約' },
  { id: 'salary', label: '給与' },
  { id: 'insurance', label: '社会保険' },
  { id: 'family', label: '家族情報' },
  { id: 'history', label: '異動履歴' },
  { id: 'documents', label: '書類' },
]

// HINT: TabBar へ組み込む前の挙動確認用。トリガーが tablist の外に出せないため、役割（role）は付けていない
const TabsDemo: FC = () => {
  const [selectedId, setSelectedId] = useState(TABS[6].id)

  return (
    <ResizableBox>
      {/* eslint-disable-next-line smarthr/best-practice-for-layouts -- Tuck は子要素を複数のアイテムとして Cluster に並べるため */}
      <Cluster gap={0} align="center">
        <Tuck
          // HINT: TabItem は role="tab" と id を持つためメニューにそのまま置けない。渡した要素の props から組み立て直す
          renderTucked={(items) => (
            <DropdownMenuButton trigger="もっと見る">
              {items.map((item) => (
                <Button key={item.props.id} onClick={() => setSelectedId(item.props.id)}>
                  {item.props.children}
                </Button>
              ))}
            </DropdownMenuButton>
          )}
        >
          {TABS.map((tab) => (
            <TabItem
              key={tab.id}
              id={tab.id}
              selected={tab.id === selectedId}
              onClick={() => setSelectedId(tab.id)}
            >
              {tab.label}
            </TabItem>
          ))}
        </Tuck>
      </Cluster>
    </ResizableBox>
  )
}

export const TabsIntoDropdown: StoryObj<typeof Tuck> = {
  name: 'タブを DropdownMenuButton にまとめる',
  render: () => <TabsDemo />,
}

export const InSidebar: StoryObj<typeof Tuck> = {
  name: 'Sidebar の中で使う（折り返すより先にまとめる）',
  render: () => (
    <ResizableBox width="720px">
      {/* HINT: 見出しを中身の幅の側、Tuck を含む Cluster を伸び縮みする側にすると、
          Sidebar が折り返すより先に Cluster の中でまとまる */}
      <Sidebar align="center">
        <p className="shr-m-0 shr-text-xl shr-font-bold">従業員詳細</p>
        <Cluster justify="end">
          <Tuck
            collapse="all"
            renderTucked={(items) => (
              <DropdownMenuButton trigger="操作">{items}</DropdownMenuButton>
            )}
          >
            <Button onClick={action('複製')}>複製</Button>
            <Button onClick={action('CSVダウンロード')}>CSVダウンロード</Button>
            <Button onClick={action('アーカイブ')}>アーカイブ</Button>
          </Tuck>
        </Cluster>
      </Sidebar>
    </ResizableBox>
  ),
}

export const InSidebarMain: StoryObj<typeof Tuck> = {
  name: 'Sidebar の main 側で使う',
  render: () => (
    <ResizableBox width="720px">
      <Sidebar right align="center">
        {/* eslint-disable-next-line smarthr/best-practice-for-layouts -- Tuck は子要素を複数のアイテムとして Cluster に並べるため */}
        <Cluster>
          <Tuck renderTucked={(items) => <Chip color="blue">+{items.length}</Chip>}>
            {SKILLS.map((skill) => (
              <Chip key={skill}>{skill}</Chip>
            ))}
          </Tuck>
        </Cluster>
        <Button onClick={action('編集')}>編集</Button>
      </Sidebar>
    </ResizableBox>
  ),
}
