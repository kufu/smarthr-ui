import { useCallback, useRef, useState } from 'react'

import { Button } from '../../Button'
import { FormControl } from '../../FormControl'
import {
  FaAlignLeftIcon,
  FaBoldIcon,
  FaCirclePlayIcon,
  FaCodeIcon,
  FaFileCodeIcon,
  FaImageIcon,
  FaItalicIcon,
  FaLinkIcon,
  FaListOlIcon,
  FaListUlIcon,
  FaQuoteLeftIcon,
  FaRulerHorizontalIcon,
  FaStrikethroughIcon,
  FaTableIcon,
  FaUnderlineIcon,
} from '../../Icon'
import { Stack } from '../../Layout'
import { Text } from '../../Text'
import { RichTextContent } from '../RichTextContent/RichTextContent'
import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { RichTextEditorController, RichTextJSON } from '../types'
import type { Meta, StoryObj } from '@storybook/react-vite'

const ALL_FEATURES = [
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  'heading',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'horizontalRule',
  'link',
  'color',
  'fontSize',
  'textAlign',
  'image',
  'youtube',
  'table',
] as const

const meta = {
  title: 'Components/RichTextEditor/Docs',
  tags: ['!dev'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  name: '概要・コンポーネントの選び方',
  parameters: {
    docs: {
      source: { code: null },
    },
  },
  render: () => {
    const tableStyle = { borderCollapse: 'collapse' as const, fontSize: 14, width: '100%' }
    const thStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' as const }
    const tdStyle = { border: '1px solid #ddd', padding: '8px' }

    return (
      <Stack gap={1.5}>
        <Stack gap={0.5}>
          <Text styleType="blockTitle">コンポーネントの選び方</Text>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>やりたいこと</th>
                <th style={thStyle}>コンポーネント</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>JSON形式で入出力するリッチテキスト編集</td>
                <td style={tdStyle}>
                  <code>RichTextEditor</code>
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>既存のHTMLデータを編集したい / HTML出力がほしい</td>
                <td style={tdStyle}>
                  <code>RichTextEditor</code>（<code>content</code> + <code>outputFormat</code>）
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>保存済みの内容を表示だけしたい（編集不要）</td>
                <td style={tdStyle}>
                  <code>RichTextContent</code>
                </td>
              </tr>
            </tbody>
          </table>
        </Stack>

        <Stack gap={0.5}>
          <Text styleType="blockTitle">features 一覧</Text>
          <Text color="TEXT_GREY">
            features propで有効にする書式を選択できます。undo / redo は常に表示されます。
            <br />
            Enter で段落分割（&lt;p&gt;）、Shift+Enter / Cmd+Enter
            で同じ段落内の改行（&lt;br&gt;）です。
          </Text>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>feature</th>
                <th style={thStyle}>説明</th>
                <th style={thStyle}>ツールバー</th>
                <th style={thStyle}>ショートカット</th>
                <th style={thStyle}>Markdown入力</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>
                  <code>bold</code>
                </td>
                <td style={tdStyle}>太字</td>
                <td style={tdStyle}>
                  <FaBoldIcon />
                </td>
                <td style={tdStyle}>Cmd+B</td>
                <td style={tdStyle}>
                  <code>**text**</code>
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>italic</code>
                </td>
                <td style={tdStyle}>斜体</td>
                <td style={tdStyle}>
                  <FaItalicIcon />
                </td>
                <td style={tdStyle}>Cmd+I</td>
                <td style={tdStyle}>
                  <code>*text*</code>
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>underline</code>
                </td>
                <td style={tdStyle}>下線</td>
                <td style={tdStyle}>
                  <FaUnderlineIcon />
                </td>
                <td style={tdStyle}>Cmd+U</td>
                <td style={tdStyle}>なし</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>strike</code>
                </td>
                <td style={tdStyle}>打ち消し線</td>
                <td style={tdStyle}>
                  <FaStrikethroughIcon />
                </td>
                <td style={tdStyle}>Cmd+Shift+S</td>
                <td style={tdStyle}>
                  <code>~~text~~</code>
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>code</code>
                </td>
                <td style={tdStyle}>インラインコード</td>
                <td style={tdStyle}>
                  <FaCodeIcon />
                </td>
                <td style={tdStyle}>Cmd+E</td>
                <td style={tdStyle}>
                  <code>`text`</code>
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>heading</code>
                </td>
                <td style={tdStyle}>見出し（H1-H4）</td>
                <td style={tdStyle}>見出しレベル選択ドロップダウン</td>
                <td style={tdStyle}>Cmd+Alt+1〜4</td>
                <td style={tdStyle}>
                  <code># </code> <code>## </code> <code>### </code> <code>#### </code>
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>bulletList</code>
                </td>
                <td style={tdStyle}>箇条書きリスト</td>
                <td style={tdStyle}>
                  <FaListUlIcon />
                </td>
                <td style={tdStyle}>Cmd+Shift+8</td>
                <td style={tdStyle}>
                  <code>- </code> or <code>* </code>
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>orderedList</code>
                </td>
                <td style={tdStyle}>番号付きリスト</td>
                <td style={tdStyle}>
                  <FaListOlIcon />
                </td>
                <td style={tdStyle}>Cmd+Shift+7</td>
                <td style={tdStyle}>
                  <code>1. </code>
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>blockquote</code>
                </td>
                <td style={tdStyle}>引用</td>
                <td style={tdStyle}>
                  <FaQuoteLeftIcon />
                </td>
                <td style={tdStyle}>Cmd+Shift+B</td>
                <td style={tdStyle}>
                  <code>{'> '}</code>
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>codeBlock</code>
                </td>
                <td style={tdStyle}>コードブロック</td>
                <td style={tdStyle}>
                  <FaFileCodeIcon />
                </td>
                <td style={tdStyle}>Cmd+Alt+C</td>
                <td style={tdStyle}>
                  <code>```</code>
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>horizontalRule</code>
                </td>
                <td style={tdStyle}>水平線</td>
                <td style={tdStyle}>
                  <FaRulerHorizontalIcon />
                </td>
                <td style={tdStyle}>なし</td>
                <td style={tdStyle}>
                  <code>---</code>
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>link</code>
                </td>
                <td style={tdStyle}>リンク</td>
                <td style={tdStyle}>
                  <FaLinkIcon />
                </td>
                <td style={tdStyle}>なし</td>
                <td style={tdStyle}>URL入力で自動リンク</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>color</code>
                </td>
                <td style={tdStyle}>文字色</td>
                <td style={tdStyle}>カラーピッカーボタン</td>
                <td style={tdStyle}>なし</td>
                <td style={tdStyle}>なし</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>fontSize</code>
                </td>
                <td style={tdStyle}>フォントサイズ（12px〜72px）</td>
                <td style={tdStyle}>サイズ選択ドロップダウン</td>
                <td style={tdStyle}>なし</td>
                <td style={tdStyle}>なし</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>textAlign</code>
                </td>
                <td style={tdStyle}>テキスト配置（左/中央/右/両端）</td>
                <td style={tdStyle}>
                  <FaAlignLeftIcon /> 配置ドロップダウン
                </td>
                <td style={tdStyle}>Cmd+Shift+L / E / R / J</td>
                <td style={tdStyle}>なし</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>image</code>
                </td>
                <td style={tdStyle}>画像挿入</td>
                <td style={tdStyle}>
                  <FaImageIcon />
                </td>
                <td style={tdStyle}>なし</td>
                <td style={tdStyle}>なし</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>youtube</code>
                </td>
                <td style={tdStyle}>YouTube埋め込み</td>
                <td style={tdStyle}>
                  <FaCirclePlayIcon />
                </td>
                <td style={tdStyle}>なし</td>
                <td style={tdStyle}>なし</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>table</code>
                </td>
                <td style={tdStyle}>テーブル</td>
                <td style={tdStyle}>
                  <FaTableIcon /> テーブル操作ドロップダウン
                </td>
                <td style={tdStyle}>Tab / Shift+Tab（セル移動）</td>
                <td style={tdStyle}>なし</td>
              </tr>
            </tbody>
          </table>
        </Stack>
      </Stack>
    )
  },
}

export const BasicUsage: Story = {
  name: '基本的な使い方（FormControl + RichTextEditor）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `const [value, setValue] = useState<RichTextJSON>()

<FormControl label="本文">
  <RichTextEditor
    features={[
      'bold', 'italic', 'underline', 'strike', 'code',
      'heading', 'bulletList', 'orderedList',
      'blockquote', 'codeBlock', 'horizontalRule',
      'link', 'color', 'fontSize', 'textAlign',
      'image', 'youtube', 'table',
    ]}
    onChange={(json) => setValue(json)}
    placeholder="ここに本文を入力してください"
  />
</FormControl>`,
      },
    },
  },
  render: () => {
    const [value, setValue] = useState<RichTextJSON | undefined>()
    return (
      <Stack gap={1.5}>
        <Text color="TEXT_GREY">
          FormControlで包むと、ラベル・エラーメッセージ・ヘルプメッセージが自動で接続されます。
          features
          propで有効にする書式を選択できます。指定しない書式はツールバーに表示されず、ショートカットキーも無効になります。
        </Text>
        <FormControl label="本文" helpMessage="ツールバーで書式を設定してください。">
          <RichTextEditor
            features={ALL_FEATURES}
            onChange={(json) => setValue(json)}
            placeholder="ここに本文を入力してください"
          />
        </FormControl>
        {value && (
          <details>
            <summary>onChange で受け取った JSON</summary>
            <pre style={{ fontSize: 12 }}>{JSON.stringify(value, null, 2)}</pre>
          </details>
        )}
      </Stack>
    )
  },
}

export const Validation: Story = {
  name: 'バリデーション（空判定）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `const ref = useRef<ComponentRef<typeof RichTextEditor>>(null)
const [value, setValue] = useState<RichTextJSON>()

const handleSave = () => {
  if (ref.current?.isEmpty()) {
    setError('入力してください')
    return
  }
  save(value)
}

<FormControl label="本文" errorMessages={error}>
  <RichTextEditor
    ref={ref}
    error={!!error}
    onChange={(json) => setValue(json)}
  />
</FormControl>
<Button onClick={handleSave}>保存</Button>`,
      },
    },
  },
  render: () => {
    const ref = useRef<RichTextEditorController>(null)
    const [_value, setValue] = useState<RichTextJSON | undefined>()
    const [error, setError] = useState('')
    const [saved, setSaved] = useState(false)

    const handleSave = useCallback(() => {
      setSaved(false)
      if (ref.current?.isEmpty()) {
        setError('入力してください')
        return
      }
      setError('')
      setSaved(true)
    }, [])

    return (
      <Stack gap={1.5}>
        <Text color="TEXT_GREY">
          ref の isEmpty() でエディタが空かどうかを判定できます。JSON
          では空でも構造データが返るため、isEmpty() を使ってください。
        </Text>
        <FormControl label="本文" errorMessages={error || undefined}>
          <RichTextEditor
            ref={ref}
            error={!!error}
            features={ALL_FEATURES}
            onChange={(json) => {
              setValue(json)
              if (error) setError('')
            }}
            placeholder="何か入力してから保存してください"
          />
        </FormControl>
        <div>
          <Button variant="primary" onClick={handleSave}>
            保存
          </Button>
        </div>
        {saved && <Text color="TEXT_GREY">保存しました</Text>}
      </Stack>
    )
  },
}

export const HTMLIntegration: Story = {
  name: 'HTMLデータとの連携（content + outputFormat）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `<FormControl label="本文">
  <RichTextEditor
    content={{ format: 'html', content: existingHtml }}
    outputFormat="html"
    onChange={(html) => save(html)}
  />
</FormControl>`,
      },
    },
  },
  render: () => {
    const [output, setOutput] = useState('')
    return (
      <Stack gap={1.5}>
        <Text color="TEXT_GREY">
          既存のHTMLデータを編集し、HTML形式で取得する場合は content で初期データ、outputFormat
          で出力形式を指定します。
        </Text>
        <FormControl label="HTML入力 → HTML出力">
          <RichTextEditor
            features={ALL_FEATURES}
            content={{
              format: 'html',
              content:
                '<h2>既存のHTML</h2><p>このデータは<strong>HTML形式</strong>で保存されていました。</p><ul><li>項目1</li><li>項目2</li></ul>',
            }}
            outputFormat="html"
            onChange={(value) => setOutput(value)}
          />
        </FormControl>
        {output && (
          <details>
            <summary>onChange で受け取った HTML</summary>
            <pre style={{ fontSize: 12 }}>{output}</pre>
          </details>
        )}
      </Stack>
    )
  },
}

export const StaticDisplay: Story = {
  name: '表示専用（RichTextContent）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `// JSON形式
<RichTextContent content={savedJsonData} />

// HTML形式
<RichTextContent content={{ format: 'html', content: savedHtml }} />`,
      },
    },
  },
  render: () => (
    <Stack gap={1.5}>
      <Text color="TEXT_GREY">
        保存済みの内容を表示するだけなら RichTextContent を使います。editor instance
        を起動しないため軽量です。JSON でも HTML でも渡せます。
      </Text>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
        <RichTextContent
          content={{
            type: 'doc',
            content: [
              {
                type: 'heading',
                attrs: { level: 2 },
                content: [{ type: 'text', text: 'プレビュー例' }],
              },
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'これは' },
                  { type: 'text', marks: [{ type: 'bold' }], text: 'RichTextContent' },
                  { type: 'text', text: 'による表示です。編集はできません。' },
                ],
              },
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: '文字色の例: ' },
                  {
                    type: 'text',
                    marks: [{ type: 'textStyle', attrs: { color: '#e01e5a' } }],
                    text: '赤いテキスト',
                  },
                  { type: 'text', text: 'と' },
                  {
                    type: 'text',
                    marks: [{ type: 'textStyle', attrs: { color: '#0077c7' } }],
                    text: '青いテキスト',
                  },
                ],
              },
              {
                type: 'paragraph',
                attrs: { textAlign: 'center' },
                content: [{ type: 'text', text: '中央揃えのテキスト' }],
              },
              {
                type: 'paragraph',
                attrs: { textAlign: 'right' },
                content: [{ type: 'text', text: '右揃えのテキスト' }],
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'editor instance を起動しない' }],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'image',
                attrs: {
                  src: 'https://placehold.co/400x200/e2e8f0/64748b?text=Sample+Image',
                  alt: 'サンプル画像',
                },
              },
              {
                type: 'youtube',
                attrs: {
                  src: 'https://www.youtube-nocookie.com/embed/ZFwv6s7kXCQ',
                  width: 480,
                  height: 270,
                },
              },
            ],
          }}
        />
      </div>
    </Stack>
  ),
}

export const HeadingLevels: Story = {
  name: '見出しレベルの制限（headingLevels）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `// H1をオプトアウト（ページにh1がある場合など）
<RichTextEditor
  features={[..., 'heading']}
  headingLevels={[2, 3, 4]}
/>

// デフォルトは [1, 2, 3, 4]
<RichTextEditor features={[..., 'heading']} />`,
      },
    },
  },
  render: () => (
    <Stack gap={1.5}>
      <Text color="TEXT_GREY">
        headingLevels propで使用可能な見出しレベルを制限できます。
        ページ自体にh1がある場合など、エディタ内でh1を使わせたくないケースで有用です。 デフォルトは
        [1, 2, 3, 4] で、全レベルが有効です。
      </Text>
      <FormControl label="H2〜H4のみ（headingLevels={[2, 3, 4]}）">
        <RichTextEditor
          features={['bold', 'italic', 'heading', 'bulletList', 'orderedList', 'link']}
          headingLevels={[2, 3, 4]}
          placeholder="見出しドロップダウンからH1が除外されます"
        />
      </FormControl>
    </Stack>
  ),
}

export const RefControl: Story = {
  name: '外部からの操作（ref + hideToolbar）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `const ref = useRef<ComponentRef<typeof RichTextEditor>>(null)

<RichTextEditor ref={ref} features={[...]} hideToolbar />

<button onClick={() => ref.current?.toggleBold()}>太字</button>
<button onClick={() => ref.current?.clear()}>クリア</button>`,
      },
    },
  },
  render: () => {
    const ref = useRef<RichTextEditorController>(null)
    return (
      <Stack gap={1.5}>
        <Text color="TEXT_GREY">
          ref
          を渡すと、外部のボタンからエディタを操作できます。ツールバーを非表示にして独自UIを構築するケースに有用です。
        </Text>
        <Stack gap={0.5}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="S" onClick={() => ref.current?.toggleBold()}>
              太字
            </Button>
            <Button size="S" onClick={() => ref.current?.toggleItalic()}>
              斜体
            </Button>
            <Button size="S" onClick={() => ref.current?.setHeading(2)}>
              H2
            </Button>
            <Button size="S" onClick={() => ref.current?.clear()}>
              クリア
            </Button>
          </div>
          <FormControl label="ツールバー非表示 + 外部操作">
            <RichTextEditor
              ref={ref}
              features={ALL_FEATURES}
              hideToolbar
              placeholder="上のボタンで書式を操作できます"
            />
          </FormControl>
        </Stack>
      </Stack>
    )
  },
}

export const FixedHeight: Story = {
  name: '高さ固定（editorClassName）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `<RichTextEditor
  editorClassName="[&_.ProseMirror]:shr-h-[200px]"
/>`,
      },
    },
  },
  render: () => (
    <Stack gap={1.5}>
      <Text color="TEXT_GREY">
        editorClassName propで ProseMirror の高さを固定できます。
        内容が溢れた場合はスクロールします。
      </Text>
      <FormControl label="高さ200px固定">
        <RichTextEditor
          features={ALL_FEATURES}
          editorClassName="[&_.ProseMirror]:shr-h-[200px]"
          placeholder="高さ200pxで固定。内容が溢れたらスクロールします"
          showCharacterCount
        />
      </FormControl>
    </Stack>
  ),
}
