/**
 * RichTextEditor と RichTextContent で共通のコンテンツスタイル定義
 *
 * Tailwind JIT はソースコード上のリテラル文字列をスキャンして CSS を生成するため、
 * クラス名を動的に組み立ててはならない。両方のバリエーションを静的に保持する。
 */

/** RichTextEditor 用: ProseMirror 内の要素向けスタイル */
export const editorContentClasses = [
  // lists
  '[&_.ProseMirror_ul]:shr-my-0.5 [&_.ProseMirror_ul]:shr-list-disc [&_.ProseMirror_ul]:shr-pl-1.5',
  '[&_.ProseMirror_ol]:shr-my-0.5 [&_.ProseMirror_ol]:shr-list-decimal [&_.ProseMirror_ol]:shr-pl-1.5',
  '[&_.ProseMirror_li]:shr-my-0.25',
  '[&_.ProseMirror_li_p]:shr-my-0',
  // blockquote
  '[&_.ProseMirror_blockquote]:shr-my-0.5 [&_.ProseMirror_blockquote]:shr-ml-0 [&_.ProseMirror_blockquote]:shr-mr-0 [&_.ProseMirror_blockquote]:shr-border-0 [&_.ProseMirror_blockquote]:shr-border-l-[3px] [&_.ProseMirror_blockquote]:shr-border-solid [&_.ProseMirror_blockquote]:shr-border-l-grey [&_.ProseMirror_blockquote]:shr-pl-0.5',
  // headings (デザイントークン準拠: XXL→XL→L→M)
  // h1: XXL(32px) / normal / black
  '[&_.ProseMirror_h1]:shr-my-0.5 [&_.ProseMirror_h1]:shr-text-2xl [&_.ProseMirror_h1]:shr-font-normal [&_.ProseMirror_h1]:shr-leading-tight',
  // h2: XL(24px) / normal / black
  '[&_.ProseMirror_h2]:shr-my-0.5 [&_.ProseMirror_h2]:shr-text-xl [&_.ProseMirror_h2]:shr-font-normal [&_.ProseMirror_h2]:shr-leading-tight',
  // h3: L(19.2px) / normal / black
  '[&_.ProseMirror_h3]:shr-my-0.5 [&_.ProseMirror_h3]:shr-text-lg [&_.ProseMirror_h3]:shr-font-normal [&_.ProseMirror_h3]:shr-leading-tight',
  // h4: M(16px) / bold / black
  '[&_.ProseMirror_h4]:shr-my-0.5 [&_.ProseMirror_h4]:shr-text-base [&_.ProseMirror_h4]:shr-font-bold [&_.ProseMirror_h4]:shr-leading-tight [&_.ProseMirror_h4]:shr-text-black',
  // code
  '[&_.ProseMirror_code]:shr-rounded-m [&_.ProseMirror_code]:shr-bg-white-darken [&_.ProseMirror_code]:shr-px-0.25 [&_.ProseMirror_code]:shr-py-[0.125rem] [&_.ProseMirror_code]:shr-text-sm',
  '[&_.ProseMirror_pre]:shr-my-0.5 [&_.ProseMirror_pre]:shr-overflow-x-auto [&_.ProseMirror_pre]:shr-rounded-m [&_.ProseMirror_pre]:shr-bg-white-darken [&_.ProseMirror_pre]:shr-p-0.75 [&_.ProseMirror_pre]:shr-text-sm',
  // horizontal rule
  '[&_.ProseMirror_hr]:shr-my-1 [&_.ProseMirror_hr]:shr-border-t-shorthand',
  // link
  '[&_.ProseMirror_a]:shr-text-main [&_.ProseMirror_a]:shr-underline',
  // paragraph
  '[&_.ProseMirror_p]:shr-my-0',
  // VoiceOver対策: ブロック要素末尾にゼロ幅スペースを追加し、読み上げ時の単語結合を防ぐ
  '[&_.ProseMirror_p]::after:shr-content-[\\200B]',
  '[&_.ProseMirror_h1]::after:shr-content-[\\200B]',
  '[&_.ProseMirror_h2]::after:shr-content-[\\200B]',
  '[&_.ProseMirror_h3]::after:shr-content-[\\200B]',
  '[&_.ProseMirror_h4]::after:shr-content-[\\200B]',
  '[&_.ProseMirror_li]::after:shr-content-[\\200B]',
  '[&_.ProseMirror_blockquote]::after:shr-content-[\\200B]',
] as const

/** RichTextContent 用: 直下の要素向けスタイル */
export const staticContentClasses = [
  // lists
  '[&_ul]:shr-my-0.5 [&_ul]:shr-list-disc [&_ul]:shr-pl-1.5',
  '[&_ol]:shr-my-0.5 [&_ol]:shr-list-decimal [&_ol]:shr-pl-1.5',
  '[&_li]:shr-my-0.25',
  '[&_li_p]:shr-my-0',
  // blockquote
  '[&_blockquote]:shr-my-0.5 [&_blockquote]:shr-ml-0 [&_blockquote]:shr-mr-0 [&_blockquote]:shr-border-0 [&_blockquote]:shr-border-l-[3px] [&_blockquote]:shr-border-solid [&_blockquote]:shr-border-l-grey [&_blockquote]:shr-pl-0.5',
  // headings (デザイントークン準拠: XXL→XL→L→M)
  '[&_h1]:shr-my-0.5 [&_h1]:shr-text-2xl [&_h1]:shr-font-normal [&_h1]:shr-leading-tight',
  '[&_h2]:shr-my-0.5 [&_h2]:shr-text-xl [&_h2]:shr-font-normal [&_h2]:shr-leading-tight',
  '[&_h3]:shr-my-0.5 [&_h3]:shr-text-lg [&_h3]:shr-font-normal [&_h3]:shr-leading-tight',
  '[&_h4]:shr-my-0.5 [&_h4]:shr-text-base [&_h4]:shr-font-bold [&_h4]:shr-leading-tight [&_h4]:shr-text-black',
  // code
  '[&_code]:shr-rounded-m [&_code]:shr-bg-white-darken [&_code]:shr-px-0.25 [&_code]:shr-py-[0.125rem] [&_code]:shr-text-sm',
  '[&_pre]:shr-my-0.5 [&_pre]:shr-overflow-x-auto [&_pre]:shr-rounded-m [&_pre]:shr-bg-white-darken [&_pre]:shr-p-0.75 [&_pre]:shr-text-sm',
  // horizontal rule
  '[&_hr]:shr-my-1 [&_hr]:shr-border-t-shorthand',
  // link
  '[&_a]:shr-text-main [&_a]:shr-underline',
  // paragraph
  '[&_p]:shr-my-0',
  // VoiceOver対策: ブロック要素末尾にゼロ幅スペースを追加し、読み上げ時の単語結合を防ぐ
  '[&_p]::after:shr-content-[\\200B]',
  '[&_h1]::after:shr-content-[\\200B]',
  '[&_h2]::after:shr-content-[\\200B]',
  '[&_h3]::after:shr-content-[\\200B]',
  '[&_h4]::after:shr-content-[\\200B]',
  '[&_li]::after:shr-content-[\\200B]',
  '[&_blockquote]::after:shr-content-[\\200B]',
] as const
