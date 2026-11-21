import { type FormEvent, useMemo, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { ControlledActionDialog } from '../../../Dialog'
import { FormControl } from '../../../FormGroup'
import { Cluster, Stack } from '../../../Layout'
import { StatusLabel } from '../../../StatusLabel'
import { Text } from '../../../Text'
import { MultiCombobox, SingleCombobox } from '../client'

import type { ComboboxItem } from '../client'
import type { Meta, StoryObj } from '@storybook/react-vite'

const SURNAMES = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤']
const GIVEN_NAMES = ['太郎', '花子', '一郎', '美咲', '健太', 'さくら', '大輔', '愛', '翔', '結衣']
const DEPARTMENTS = ['営業部', '開発部', '人事部', '経理部', '総務部']

const makeItems = (count: number): Array<ComboboxItem<number>> =>
  Array.from({ length: count }, (_, i) => {
    const name = `${SURNAMES[i % 10]} ${GIVEN_NAMES[Math.floor(i / 10) % 10]}`
    const department = DEPARTMENTS[Math.floor(i / 100) % DEPARTMENTS.length]

    return {
      value: `emp-${i + 1}`,
      label: `${name}（${department}・${i + 1}）`,
      data: i + 1,
      disabled: i === 3,
    }
  })

const ITEMS = makeItems(300)

const SUB_DEPARTMENTS = [
  '第一開発課',
  '第二開発課 / プラットフォームグループ / 基盤チーム / 認証・認可ユニット',
  '採用課',
  '給与計算課 / 年末調整プロジェクト',
  'ファシリティ課',
]

const EMPLOYEES: Array<ComboboxItem<number>> = Array.from({ length: 200 }, (_, i) => {
  const name = `${SURNAMES[i % 10]} ${GIVEN_NAMES[Math.floor(i / 10) % 10]}`
  const department = DEPARTMENTS[i % DEPARTMENTS.length]
  const sub = SUB_DEPARTMENTS[i % SUB_DEPARTMENTS.length]
  const second = i % 3 === 0 ? `、${DEPARTMENTS[(i + 2) % DEPARTMENTS.length]}` : ''

  return {
    value: `employee-${i + 1}`,
    label: name,
    description: `No. ${i + 1}・${department} / ${sub}${second}`,
  }
})
const API_ITEMS = makeItems(1000)
const API_PAGE_SIZE = 20

const DIVISIONS = ['第一事業本部', '第二事業本部', '管理本部']
const DEPARTMENT_NAMES = ['開発部', '人事部', '経理部', '営業部']
const SECTIONS = ['第一開発課', '第二開発課', '採用課', '労務課', '法人営業課']
const GROUPS = ['基盤グループ', 'アプリケーショングループ', '品質保証グループ', 'データグループ']

const DEPARTMENT_PATHS: Array<ComboboxItem<number>> = [
  ...Array.from({ length: 60 }, (_, i) => ({
    value: `dept-${i + 1}`,
    label: [
      'サンプル株式会社',
      DIVISIONS[i % 3],
      DEPARTMENT_NAMES[Math.floor(i / 3) % 4],
      SECTIONS[Math.floor(i / 12) % 5],
      GROUPS[i % 4],
    ].join(' / '),
    description: `部署コード: D-${String(i + 1).padStart(4, '0')} / 所属人数: ${(i * 7) % 40} 人`,
  })),
  {
    value: 'dept-unbroken',
    label: 'SamplePlatformInfrastructureReliabilityEngineeringTeamAlphaBravoCharlie',
  },
]

const withoutDescription = (items: Array<ComboboxItem<number>>) =>
  items.map(({ description: _, ...rest }) => rest)

const DEPARTMENT_PATHS_LABEL_ONLY = withoutDescription(DEPARTMENT_PATHS)

const formatItems = (items: ComboboxItem<number> | Array<ComboboxItem<number>> | null) =>
  JSON.stringify(
    Array.isArray(items) ? items.map((item) => item.value) : (items?.value ?? null),
    null,
    1,
  )

const meta = {
  title: 'Experimental/Combobox',
  component: SingleCombobox,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SingleCombobox>

export default meta

export const Sync: StoryObj = {
  name: '同期（300件）',
  render: () => (
    <Stack gap={1.5}>
      <FormControl label="担当者">
        <SingleCombobox name="single1" items={ITEMS} />
      </FormControl>
      <FormControl label="参加者">
        <MultiCombobox name="multi2" items={ITEMS} defaultSelectedItems={[ITEMS[120], ITEMS[7]]} />
      </FormControl>
      <FormControl label="幅を指定" helpMessage="width=400">
        <SingleCombobox name="single3" defaultSelectedItem={ITEMS[42]} width={400} items={ITEMS} />
      </FormControl>
      <FormControl label="無効">
        <SingleCombobox name="single4" disabled defaultSelectedItem={ITEMS[1]} items={ITEMS} />
      </FormControl>
      <FormControl errorMessages="選択してください" autoBindErrorInput label="エラー">
        <MultiCombobox name="multi5" items={ITEMS} />
      </FormControl>
    </Stack>
  ),
}

export const MaxVisibleItems: StoryObj = {
  name: '選択済みを +N にまとめる',
  render: () => (
    <Stack gap={1.5}>
      <FormControl label="上限なし（既定）">
        <MultiCombobox name="maxVisible1" items={ITEMS} defaultSelectedItems={ITEMS.slice(0, 8)} />
      </FormControl>
      <FormControl label="maxVisibleItems=2">
        <MultiCombobox
          name="maxVisible2"
          items={ITEMS}
          defaultSelectedItems={ITEMS.slice(0, 8)}
          maxVisibleItems={2}
        />
      </FormControl>
    </Stack>
  ),
}

export const WithDescription: StoryObj = {
  name: '説明付き（description）',
  render: () => (
    <Stack gap={1.5}>
      <p>description は検索の対象外。「No. 12」で検索しても当たらず、名前で検索する。</p>
      <FormControl label="承認者">
        <SingleCombobox name="approver" defaultSelectedItem={EMPLOYEES[1]} items={EMPLOYEES} />
      </FormControl>
      <FormControl label="通知先">
        <MultiCombobox
          name="notify[]"
          items={EMPLOYEES}
          defaultSelectedItems={[EMPLOYEES[0], EMPLOYEES[6]]}
        />
      </FormControl>
      <FormControl label="通知先（ドロワー）">
        <MultiCombobox name="notifyDrawer[]" variant="drawer" items={EMPLOYEES} />
      </FormControl>
    </Stack>
  ),
}

export const LongLabels: StoryObj = {
  name: '長いラベル（幅200px）',
  render: () => (
    <Stack gap={1.5}>
      <p>一覧では折り返し、トリガでは末尾を省略する。最後の項目は区切りの無い長い英字。</p>
      <FormControl label="所属部署">
        <SingleCombobox
          name="department"
          defaultSelectedItem={DEPARTMENT_PATHS_LABEL_ONLY[13]}
          width={200}
          items={DEPARTMENT_PATHS_LABEL_ONLY}
        />
      </FormControl>
      <FormControl label="対象部署">
        <MultiCombobox
          name="departments[]"
          width={200}
          items={DEPARTMENT_PATHS_LABEL_ONLY}
          defaultSelectedItems={[
            DEPARTMENT_PATHS_LABEL_ONLY[0],
            DEPARTMENT_PATHS_LABEL_ONLY[60],
            DEPARTMENT_PATHS_LABEL_ONLY[25],
          ]}
        />
      </FormControl>
      <FormControl label="対象部署（説明付き・dropdownWidth=360）">
        <MultiCombobox
          name="departmentsWithDescription[]"
          width={200}
          dropdownWidth={360}
          items={DEPARTMENT_PATHS}
          defaultSelectedItems={[DEPARTMENT_PATHS[4]]}
        />
      </FormControl>
      <FormControl label="所属部署（ドロワー）">
        <SingleCombobox
          name="departmentDrawer"
          defaultSelectedItem={DEPARTMENT_PATHS[60]}
          variant="drawer"
          width={200}
          items={DEPARTMENT_PATHS}
        />
      </FormControl>
      <FormControl label="対象部署（ドロワー）">
        <MultiCombobox
          name="departmentsDrawer[]"
          variant="drawer"
          width={200}
          items={DEPARTMENT_PATHS}
          defaultSelectedItems={[DEPARTMENT_PATHS[0], DEPARTMENT_PATHS[60], DEPARTMENT_PATHS[25]]}
        />
      </FormControl>
    </Stack>
  ),
}

export const ControlledAndUncontrolled: StoryObj = {
  name: '制御と非制御',
  render: () => {
    const [single, setSingle] = useState<ComboboxItem<number> | null>(ITEMS[10])
    const [multi, setMulti] = useState<Array<ComboboxItem<number>>>([ITEMS[0], ITEMS[200]])
    const [lastSingle, setLastSingle] = useState<ComboboxItem<number> | null>(null)
    const [lastMulti, setLastMulti] = useState<Array<ComboboxItem<number>>>([])

    return (
      <Cluster gap={3} align="flex-start">
        {}
        <Stack>
          <Text weight="bold">制御（selectedItem / selectedItems）</Text>
          <FormControl label="担当者（制御）">
            <SingleCombobox
              name="single6"
              selectedItem={single}
              onChangeSelected={setSingle}
              items={ITEMS}
            />
          </FormControl>
          <FormControl label="参加者（制御）">
            <MultiCombobox
              name="multi7"
              selectedItems={multi}
              onChangeSelected={setMulti}
              items={ITEMS}
            />
          </FormControl>
          <pre>{`selectedItem: ${formatItems(single)}\nselectedItems: ${formatItems(multi)}`}</pre>
          <Cluster>
            <Button
              size="S"
              onClick={() => {
                setSingle(ITEMS[10])
                setMulti([ITEMS[0], ITEMS[200]])
              }}
            >
              外部 state を初期値に戻す
            </Button>
            <Button size="S" onClick={() => setSingle(ITEMS[299])}>
              外部から ITEMS[299] を選ぶ
            </Button>
          </Cluster>
        </Stack>
        <form>
          <Stack>
            <Text weight="bold">非制御（defaultSelectedItem / defaultSelectedItems）</Text>
            <FormControl label="担当者（非制御）">
              <SingleCombobox
                name="single8"
                defaultSelectedItem={ITEMS[10]}
                onChangeSelected={setLastSingle}
                items={ITEMS}
              />
            </FormControl>
            <FormControl label="参加者（非制御）">
              <MultiCombobox
                name="multi9"
                onChangeSelected={setLastMulti}
                items={ITEMS}
                defaultSelectedItems={[ITEMS[0], ITEMS[200]]}
              />
            </FormControl>
            <pre>{`最後の onChangeSelected\nsingle: ${formatItems(lastSingle)}\nmulti: ${formatItems(lastMulti)}`}</pre>
            <div>
              <Button type="reset" size="S">
                form を reset
              </Button>
            </div>
          </Stack>
        </form>
      </Cluster>
    )
  },
}

export const Async: StoryObj = {
  name: '非同期（loadItems）',
  render: () => {
    const [logs, setLogs] = useState<string[]>([])
    const loadItems = useMemo(() => {
      const log = (message: string) => {
        action('loadItems')(message)
        setLogs((current) =>
          [`${new Date().toLocaleTimeString()} ${message}`, ...current].slice(0, 12),
        )
      }

      return async (query: string, { signal }: { signal: AbortSignal }) => {
        log(`request "${query}"`)
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, 600)

          signal.addEventListener(
            'abort',
            () => {
              clearTimeout(timer)
              log(`aborted "${query}"`)
              reject(signal.reason)
            },
            { once: true },
          )
        })

        const hits =
          query === '' ? API_ITEMS : API_ITEMS.filter((item) => String(item.label).includes(query))
        const fetched = hits.slice(0, API_PAGE_SIZE + 1)
        const result = {
          items: fetched.slice(0, API_PAGE_SIZE),
          hasMore: fetched.length > API_PAGE_SIZE,
        }

        log(`resolved "${query}" ${result.items.length}件 hasMore=${result.hasMore}`)

        return result
      }
    }, [])

    return (
      <Stack gap={1.5}>
        <p>
          API は最大20件を返し、続きがあれば hasMore
          を返す（600ms）。「佐藤」のような広い検索では案内が出て、「佐藤
          花」のような狭い検索では出ない。初期値の ITEMS[500]
          は空文字の結果に含まれないが、先頭に出る。
        </p>
        <FormControl label="担当者（API）">
          <SingleCombobox
            name="single10"
            defaultSelectedItem={API_ITEMS[500]}
            loadItems={loadItems}
          />
        </FormControl>
        <FormControl label="参加者（API）">
          <MultiCombobox
            name="multi11"
            loadItems={loadItems}
            defaultSelectedItems={[API_ITEMS[500], API_ITEMS[999]]}
          />
        </FormControl>
        <pre>{logs.join('\n')}</pre>
      </Stack>
    )
  },
}

export const Form: StoryObj = {
  name: 'form（name / required）',
  render: () => {
    const [submitted, setSubmitted] = useState('')
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const entries: string[] = []

      new FormData(e.currentTarget).forEach((value, key) => entries.push(`${key}=${String(value)}`))
      setSubmitted(entries.join('\n'))
    }

    return (
      <form onSubmit={handleSubmit}>
        <Stack gap={1.5}>
          <FormControl statusLabels={<StatusLabel type="red">必須</StatusLabel>} label="担当者">
            <SingleCombobox name="assignee" required items={ITEMS} />
          </FormControl>
          <FormControl statusLabels={<StatusLabel type="red">必須</StatusLabel>} label="参加者">
            <MultiCombobox
              name="members[]"
              required
              items={ITEMS}
              defaultSelectedItems={[ITEMS[5]]}
            />
          </FormControl>
          <FormControl label="任意">
            <SingleCombobox name="optional" items={ITEMS} />
          </FormControl>
          <Cluster>
            <Button type="submit" variant="primary">
              送信
            </Button>
            <Button type="reset">reset</Button>
          </Cluster>
          <pre>{submitted}</pre>
        </Stack>
      </form>
    )
  },
}

export const Drawer: StoryObj = {
  name: 'ドロワー（variant="drawer"）',
  render: () => (
    <Stack gap={1.5}>
      <FormControl label="担当者">
        <SingleCombobox
          name="single12"
          defaultSelectedItem={ITEMS[4]}
          variant="drawer"
          items={ITEMS}
        />
      </FormControl>
      <FormControl label="参加者">
        <MultiCombobox
          name="multi13"
          variant="drawer"
          items={ITEMS}
          defaultSelectedItems={[ITEMS[0], ITEMS[150], ITEMS[299]]}
        />
      </FormControl>
    </Stack>
  ),
}

export const InDialog: StoryObj = {
  name: 'Dialog の中',
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>ダイアログを開く</Button>
        <ControlledActionDialog
          isOpen={isOpen}
          onClickAction={(_, { close }) => close()}
          onClickClose={() => setIsOpen(false)}
          heading="メンバーを追加"
          actionButton="追加"
        >
          <Stack gap={1.5}>
            <p>
              ポップアップで Escape
              を押すとポップアップだけが閉じ、もう一度押すとダイアログが閉じる。
            </p>
            <FormControl label="担当者">
              <SingleCombobox name="single14" items={ITEMS} />
            </FormControl>
            <FormControl label="参加者">
              <MultiCombobox name="multi15" items={ITEMS} />
            </FormControl>
            <FormControl label="ドロワー版">
              <MultiCombobox name="multi16" variant="drawer" items={ITEMS} />
            </FormControl>
          </Stack>
        </ControlledActionDialog>
      </>
    )
  },
}
