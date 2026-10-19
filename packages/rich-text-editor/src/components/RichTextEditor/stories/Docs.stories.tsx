import { useCallback, useId, useRef, useState } from 'react'
import {
  Button,
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
  FaMinusIcon,
  FaQuoteLeftIcon,
  FaStrikethroughIcon,
  FaTableIcon,
  FaUnderlineIcon,
  FormControl,
  Heading,
  Stack,
  Text,
} from 'smarthr-ui'

import { RichTextEditor } from '../RichTextEditor/RichTextEditor'
import { RichTextViewer } from '../RichTextViewer/RichTextViewer'

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
  'backgroundColor',
  'fontSize',
  'lineHeight',
  'textAlign',
  'image',
  'youtube',
  'table',
] as const

const meta = {
  title: 'Editor/Docs',
  tags: ['!dev'],
  parameters: {
    chromatic: { disableSnapshot: true },
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
                  <code>RichTextEditor</code>（<code>defaultValue</code> / <code>value</code> +{' '}
                  <code>outputFormat</code>）
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>保存済みの内容を表示だけしたい（編集不要）</td>
                <td style={tdStyle}>
                  <code>RichTextViewer</code>
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
            features は「編集中に新しく適用できる書式」の指定です。value / defaultValue に features
            以外の書式が含まれていても、その書式は保持されたまま表示・出力されます。
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
                  <FaMinusIcon />
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
                <td style={tdStyle}>Cmd+K</td>
                <td style={tdStyle}>URL入力で自動リンク</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>color</code>
                </td>
                <td style={tdStyle}>
                  文字色
                  <br />
                  <Text size="S" color="TEXT_GREY">
                    表のセル内でカーソルだけを置いている場合と複数セルを選択している場合はセル全体に適用する
                  </Text>
                </td>
                <td style={tdStyle}>カラーピッカーボタン</td>
                <td style={tdStyle}>なし</td>
                <td style={tdStyle}>なし</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>backgroundColor</code>
                </td>
                <td style={tdStyle}>
                  背景色（ハイライト）
                  <br />
                  <Text size="S" color="TEXT_GREY">
                    表のセル内でカーソルだけを置いている場合と複数セルを選択している場合はセル全体に適用する
                  </Text>
                </td>
                <td style={tdStyle}>背景色ピッカーボタン</td>
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
                  <code>lineHeight</code>
                </td>
                <td style={tdStyle}>行送り（1〜2）</td>
                <td style={tdStyle}>行送り選択ドロップダウン</td>
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
                <td style={tdStyle}>
                  画像挿入
                  <br />
                  <Text size="S" color="TEXT_GREY">
                    選ぶと操作バー（代替テキスト・サイズ・配置・削除）を画像の上に出す
                  </Text>
                </td>
                <td style={tdStyle}>
                  <FaImageIcon />
                </td>
                <td style={tdStyle}>Alt+Enter / Shift+F10（選択中に操作バーへ移る）</td>
                <td style={tdStyle}>なし</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>youtube</code>
                </td>
                <td style={tdStyle}>
                  YouTube埋め込み
                  <br />
                  <Text size="S" color="TEXT_GREY">
                    選ぶと操作バー（配置・サイズ・削除）を動画の上に出す。四隅のハンドルでもサイズを変えられる（16:9
                    固定）。編集中は動画プレーヤーを Tab の移動先から外す
                  </Text>
                </td>
                <td style={tdStyle}>
                  <FaCirclePlayIcon />
                </td>
                <td style={tdStyle}>Alt+Enter / Shift+F10（選択中に操作バーへ移る）</td>
                <td style={tdStyle}>なし</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <code>table</code>
                </td>
                <td style={tdStyle}>
                  テーブル
                  <br />
                  <Text size="S" color="TEXT_GREY">
                    ツールバーは挿入のみ。表・行・列・セルのハンドルを表の周囲に出し、挿入・削除・結合・ヘッダー切り替え・色の変更はそこから行う
                  </Text>
                </td>
                <td style={tdStyle}>
                  <FaTableIcon /> テーブル挿入
                </td>
                <td style={tdStyle}>
                  Tab / Shift+Tab（セル移動）
                  <br />
                  Alt+Shift+T / C / R（表・列・行の操作メニュー）
                  <br />
                  Alt+Enter / Shift+F10（セルの操作メニュー）
                </td>
                <td style={tdStyle}>なし</td>
              </tr>
            </tbody>
          </table>
        </Stack>

        <Stack gap={0.5}>
          <Text styleType="blockTitle">キーボード操作</Text>
          <Text color="TEXT_GREY">
            書式に紐づかない操作のキーボードショートカットです。Cmd は Windows / Linux では Ctrl
            に読み替えてください。
          </Text>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>操作</th>
                <th style={thStyle}>ショートカット</th>
                <th style={thStyle}>説明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>元に戻す</td>
                <td style={tdStyle}>Cmd+Z</td>
                <td style={tdStyle}>ツールバーの「元に戻す」と同じ</td>
              </tr>
              <tr>
                <td style={tdStyle}>やり直す</td>
                <td style={tdStyle}>Cmd+Shift+Z / Cmd+Y</td>
                <td style={tdStyle}>ツールバーの「やり直す」と同じ</td>
              </tr>
              <tr>
                <td style={tdStyle}>ツールバーへ移動</td>
                <td style={tdStyle}>Alt+F10</td>
                <td style={tdStyle}>
                  本文からツールバーへフォーカスを移します。移動先は直前に操作したボタン（ツールバーを未操作なら先頭のボタン）です。ツールバー内は左右矢印キー・Home・End
                  で移動し、Escape で本文へ戻ります。
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>リスト項目をネスト</td>
                <td style={tdStyle}>Tab</td>
                <td style={tdStyle}>
                  先頭の項目ではネストする先が無いため効かず、フォーカスが次の要素へ移ります。
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>リスト項目のネストを解除</td>
                <td style={tdStyle}>Shift+Tab</td>
                <td style={tdStyle}>
                  ネストしていないときはリストを解除せず、フォーカスをツールバーへ移します。
                </td>
              </tr>
            </tbody>
          </table>
        </Stack>

        <Stack gap={0.5}>
          <Text styleType="blockTitle">画像の扱い</Text>
          <Text color="TEXT_GREY">
            画像のアップロード先は <code>onImageUpload</code> で利用者が実装します。失敗した場合は{' '}
            <code>onImageUploadError</code> が呼ばれます。
            <br />
            <code>onImageUpload</code> が返す <code>src</code> は http(s) の URL か <code>/</code>{' '}
            から始まるパスにしてください。保存後に表示できない <code>blob:</code> や{' '}
            <code>data:</code>、相対パスは失敗として扱います。
            <br />
            エディタが確かめるのはブラウザが申告する MIME type
            だけで、ファイルサイズも制限しません。ファイルの形式やサイズはサーバ側で必ず検証してください。
            <br />
            <code>acceptedMimeTypes</code> に <code>image/*</code> を指定すると SVG
            も受け付けます。SVG
            はスクリプトを含められるため、受け付ける場合はサーバ側で無害化するか、別のオリジンから配信してください。
            <br />
            SmartHR UI は保存先を持たないため、不要になった画像の削除もエディタは行いません。
            <br />
            編集中の削除をもとにファイルを消すと、undo
            で戻したときやリロードしたときに復元できないデータ欠損になります。
            <br />
            不要になった画像の回収は、保存確定時に旧文書と新文書の差分をサーバ側で取って行ってください。
          </Text>
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
      'link', 'color', 'backgroundColor', 'fontSize', 'lineHeight', 'textAlign',
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
          propで有効にする書式を選択できます。指定しない書式はツールバーに表示されず、ショートカットキー・Markdown入力も無効になり、ペースト時には取り除かれます。
          既に入力値に含まれている書式は取り除かれず、そのまま保持されます。
        </Text>
        <FormControl label="本文" helpMessage="ツールバーで書式を設定してください。">
          <RichTextEditor
            features={ALL_FEATURES}
            placeholder="ここに本文を入力してください"
            onChange={(json) => setValue(json)}
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

export const WithoutFormControl: Story = {
  name: 'FormControl を使わない場合（aria-label / aria-labelledby / id）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `// 見えるラベルを置けない場合
<RichTextEditor aria-label="本文" />

// 画面上の見出しなどを名前にする場合
<Heading type="blockTitle" id={headingId}>コメント</Heading>
<RichTextEditor aria-labelledby={headingId} />

// 自前の label と紐付ける場合（label にも id が必要）
<label id={labelId} htmlFor={editorId}>本文</label>
<RichTextEditor id={editorId} />`,
      },
    },
  },
  render: () => {
    const headingId = useId()
    const labelId = useId()
    const editorId = useId()

    return (
      <Stack gap={1.5}>
        <Text color="TEXT_GREY">
          原則は FormControl で包んでください。表のセルの中など FormControl
          を置けない場所では、aria-label・aria-labelledby で本文に名前を付けられます。id
          を指定すると、自前の label 要素の htmlFor と紐付けられます。このとき label にも id
          を付けてください（本文は label 要素で紐付けられないため、label の id
          を名前として参照します）。説明文は aria-describedby で紐付けます。
        </Text>
        <RichTextEditor placeholder="aria-label で名前を付けた例" aria-label="本文" />
        <Stack gap={0.5}>
          <Heading type="blockTitle" id={headingId}>
            コメント
          </Heading>
          <RichTextEditor placeholder="見出しを名前にした例" aria-labelledby={headingId} />
        </Stack>
        <Stack gap={0.5}>
          <label id={labelId} htmlFor={editorId}>
            本文（自前の label）
          </label>
          <RichTextEditor id={editorId} placeholder="自前の label と紐付けた例" />
        </Stack>
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
        code: `const ref = useRef<RichTextEditorController>(null)
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
        <FormControl errorMessages={error || undefined} label="本文">
          <RichTextEditor
            ref={ref}
            error={!!error}
            features={ALL_FEATURES}
            placeholder="何か入力してから保存してください"
            onChange={(json) => {
              setValue(json)
              if (error) setError('')
            }}
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
  name: 'HTMLデータとの連携（format: html + outputFormat）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `// 初期値だけ渡す（非制御）
<FormControl label="本文">
  <RichTextEditor
    defaultValue={{ format: 'html', content: existingHtml }}
    outputFormat="html"
    onChange={(html) => save(html)}
  />
</FormControl>

// 制御モード。入力は形式を明示するため { format, content }、出力は文字列で受け取る
<RichTextEditor
  value={{ format: 'html', content: html }}
  outputFormat="html"
  onChange={setHtml}
/>

// HTML で保存していたデータを JSON へ移行する（outputFormat は既定の json）
<RichTextEditor
  defaultValue={{ format: 'html', content: existingHtml }}
  onChange={(json) => save(json)}
/>`,
      },
    },
  },
  render: () => {
    const [output, setOutput] = useState('')
    return (
      <Stack gap={1.5}>
        <Text color="TEXT_GREY">
          HTMLのデータは defaultValue / value に <code>{`{ format: 'html', content }`}</code>{' '}
          で渡します。出力の形式は outputFormat で決まり、入力の形式とは別に選べます（HTML
          で読み込んで JSON で受け取ることもできます）。
        </Text>
        <FormControl label="HTML入力 → HTML出力">
          <RichTextEditor
            defaultValue={{
              format: 'html',
              content:
                '<h2>既存のHTML</h2><p>このデータは<strong>HTML形式</strong>で保存されていました。</p><ul><li>項目1</li><li>項目2</li></ul>',
            }}
            features={ALL_FEATURES}
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
  name: '表示専用（RichTextViewer）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `// JSON形式
<RichTextViewer content={savedJsonData} />

// HTML形式
<RichTextViewer content={{ format: 'html', content: savedHtml }} />`,
      },
    },
  },
  render: () => (
    <Stack gap={1.5}>
      <Text color="TEXT_GREY">
        保存済みの内容を表示するだけなら RichTextViewer を使います。editor instance
        を起動せず、ツールバーや画像アップロードの処理も読み込みません。JSON でも HTML
        でも渡せます。
      </Text>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
        <RichTextViewer
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
                  { type: 'text', marks: [{ type: 'bold' }], text: 'RichTextViewer' },
                  { type: 'text', text: 'による表示です。編集はできません。' },
                ],
              },
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: '文字色の例: ' },
                  {
                    type: 'text',
                    marks: [{ type: 'textStyle', attrs: { color: '#9e3b4e' } }],
                    text: '赤いテキスト',
                  },
                  { type: 'text', text: 'と' },
                  {
                    type: 'text',
                    marks: [{ type: 'textStyle', attrs: { color: '#0465a9' } }],
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
  name: '外部からの操作（ref）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `const ref = useRef<RichTextEditorController>(null)

<RichTextEditor ref={ref} features={[...]} />

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
          を渡すと、外部のボタンからよく使う書式を適用したり、フォーカスや内容のクリアを行ったりできます。標準のツールバーを置き換える用途は想定していません（選択中の書式を読み取る手段がありません）。
          <br />
          ref から適用・解除できる書式は、<code>
            features
          </code> に含まれるものだけです。見出しは <code>headingLevels</code>{' '}
          に含まれるレベルだけです。
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
          <FormControl label="外部のボタンからの操作">
            <RichTextEditor
              ref={ref}
              features={ALL_FEATURES}
              placeholder="上のボタンで書式を操作できます"
            />
          </FormControl>
        </Stack>
      </Stack>
    )
  },
}

export const FixedHeight: Story = {
  name: '高さ固定（height）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `<RichTextEditor height={200} />`,
      },
    },
  },
  render: () => (
    <Stack gap={1.5}>
      <Text color="TEXT_GREY">
        height propでエディタ領域の高さを固定できます。 内容が溢れた場合はスクロールします。
        数値はpxとして扱われ、文字列はそのままCSSの値になります。
      </Text>
      <FormControl label="高さ200px固定">
        <RichTextEditor
          features={ALL_FEATURES}
          placeholder="高さ200pxで固定。内容が溢れたらスクロールします"
          showCharacterCount
          height={200}
        />
      </FormControl>
      <FormControl label="幅400px・高さ150px">
        <RichTextEditor
          features={ALL_FEATURES}
          placeholder="width と height を併用"
          width={400}
          height={150}
        />
      </FormControl>
    </Stack>
  ),
}

export const Resizable: Story = {
  name: '縦リサイズ（resizable）',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        code: `<RichTextEditor resizable height={200} />`,
      },
    },
  },
  render: () => (
    <Stack gap={1.5}>
      <Text color="TEXT_GREY">
        resizable propで、右下のハンドルからエディタ領域の高さを変えられます。
        ツールバーと文字数エリアの高さは変わりません。
        readOnly・disabledのときはハンドルを表示しません。
      </Text>
      <FormControl label="文字数カウントあり">
        <RichTextEditor
          features={ALL_FEATURES}
          resizable
          placeholder="右下のハンドルで高さを変えられます"
          showCharacterCount
          height={200}
        />
      </FormControl>
      <FormControl label="文字数カウントなし">
        <RichTextEditor
          features={ALL_FEATURES}
          resizable
          placeholder="文字数カウントが無くてもハンドルは右下に出ます"
          height={200}
        />
      </FormControl>
    </Stack>
  ),
}

export const ToolbarDisplay: Story = {
  name: 'ツールバーの表示',
  render: () => (
    <Stack gap={1.5}>
      <Text color="TEXT_GREY">
        ツールバーは折り返さずに横スクロールします。高さは常に1段分で、ウィンドウ幅やエディタの置かれた場所によって構成が変わることはありません。
        <br />
        項目が幅に収まらないときだけ、右端に折り返しトグルが現れます。押すと折り返して全項目を並べ、もう一度押すと横スクロールに戻ります。収まっているときは押しても変わるものが無いためトグルを出しません。
        <br />
        モバイル表示（
        <code>EnvironmentProvider</code> を置いたうえで画面幅が 751px
        以下）ではツールチップを表示しません。ホバーが無い環境のためで、各ボタンには{' '}
        <code>aria-label</code> が付いているため支援技術には引き続きラベルが伝わります。
        <br />
        <code>hideToolbar</code>{' '}
        でツールバーを隠すと、画像・動画・表の上に出るメニューも表示しません。ツールバーからの挿入と表の行・列の操作はできなくなりますが、
        <code>features</code>{' '}
        で許可したものは貼り付けやドロップで入り、ドラッグでのサイズ変更と書式のショートカットも使えます。ツールバーやメニューへ移るキー操作（Alt+F10・Alt+Enter
        など）と、リンクを編集する Cmd+K は効きません。
      </Text>
      <FormControl label="ブラウザの幅を狭めると折り返しトグルが現れます">
        <RichTextEditor
          features={ALL_FEATURES}
          placeholder="ブラウザの幅を狭めてツールバーの変化を確認できます"
        />
      </FormControl>
    </Stack>
  ),
}
