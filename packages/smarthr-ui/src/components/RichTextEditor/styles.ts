/**
 * RichTextEditor と RichTextViewer で共通のコンテンツスタイル定義
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
  // image
  '[&_.ProseMirror_img]:shr-my-0.5 [&_.ProseMirror_img]:shr-max-w-full',
  '[&_.ProseMirror_img.ProseMirror-selectednode]:shr-outline [&_.ProseMirror_img.ProseMirror-selectednode]:shr-outline-2 [&_.ProseMirror_img.ProseMirror-selectednode]:shr-outline-offset-2 [&_.ProseMirror_img.ProseMirror-selectednode]:shr-outline-main',
  // image resize container
  '[&_.ProseMirror_[data-resize-container]]:shr-w-fit [&_.ProseMirror_[data-resize-container]]:shr-max-w-full [&_.ProseMirror_[data-resize-container]]:shr-my-0.5',
  '[&_.ProseMirror_[data-resize-container]_img]:shr-my-0',
  '[&_.ProseMirror_[data-resize-container].ProseMirror-selectednode_img]:shr-outline [&_.ProseMirror_[data-resize-container].ProseMirror-selectednode_img]:shr-outline-2 [&_.ProseMirror_[data-resize-container].ProseMirror-selectednode_img]:shr-outline-offset-2 [&_.ProseMirror_[data-resize-container].ProseMirror-selectednode_img]:shr-outline-main',
  // image resize handles
  '[&_.ProseMirror_[data-resize-handle]]:shr-size-[10px] [&_.ProseMirror_[data-resize-handle]]:shr-rounded-full [&_.ProseMirror_[data-resize-handle]]:shr-bg-main [&_.ProseMirror_[data-resize-handle]]:shr-border [&_.ProseMirror_[data-resize-handle]]:shr-border-solid [&_.ProseMirror_[data-resize-handle]]:shr-border-white [&_.ProseMirror_[data-resize-handle]]:shr-shadow-sm [&_.ProseMirror_[data-resize-handle]]:shr-opacity-0 [&_.ProseMirror_[data-resize-handle]]:shr-transition-opacity [&_.ProseMirror_[data-resize-handle]]:shr-z-1 [&_.ProseMirror_[data-resize-handle]]:shr-m-[-5px]',
  '[&_.ProseMirror_[data-resize-wrapper]:hover_[data-resize-handle]]:shr-opacity-100',
  '[&_.ProseMirror_[data-resize-container][data-resize-state=true]_[data-resize-handle]]:shr-opacity-100',
  // youtube iframe
  '[&_.ProseMirror_iframe]:shr-my-0.5 [&_.ProseMirror_iframe]:shr-max-w-full [&_.ProseMirror_iframe]:shr-rounded-m',
  '[&_.ProseMirror_div[data-youtube-video]]:shr-my-0.5 [&_.ProseMirror_div[data-youtube-video]]:shr-inline-block [&_.ProseMirror_div[data-youtube-video]]:shr-rounded-m',
  '[&_.ProseMirror_div[data-youtube-video].ProseMirror-selectednode]:shr-outline [&_.ProseMirror_div[data-youtube-video].ProseMirror-selectednode]:shr-outline-2 [&_.ProseMirror_div[data-youtube-video].ProseMirror-selectednode]:shr-outline-offset-2 [&_.ProseMirror_div[data-youtube-video].ProseMirror-selectednode]:shr-outline-main [&_.ProseMirror_div[data-youtube-video].ProseMirror-selectednode]:shr-rounded-m',
  // table (resizable: tableWrapper で囲まれる)
  // テーブルは内容幅にしてNotion風レイアウトを実現。column-resizingはtable-fixedで動作する。
  // tableWrapperの右と下に +列/+行 バー(24px)用の余白を確保。テーブル幅がそれを超えると
  // tableWrapper内で横スクロールが発生する。
  '[&_.ProseMirror_.tableWrapper]:shr-mt-0.5 [&_.ProseMirror_.tableWrapper]:shr-mb-2 [&_.ProseMirror_.tableWrapper]:shr-w-fit [&_.ProseMirror_.tableWrapper]:shr-max-w-[calc(100%-1.75rem)] [&_.ProseMirror_.tableWrapper]:shr-overflow-x-auto',
  '[&_.ProseMirror_table]:shr-w-auto [&_.ProseMirror_table]:shr-table-fixed [&_.ProseMirror_table]:shr-border-collapse [&_.ProseMirror_table]:shr-overflow-hidden',
  '[&_.ProseMirror_td]:shr-border-shorthand [&_.ProseMirror_td]:shr-p-0.5 [&_.ProseMirror_td]:shr-align-top [&_.ProseMirror_td]:shr-min-w-[6em] [&_.ProseMirror_td]:shr-relative [&_.ProseMirror_td]:shr-box-border',
  '[&_.ProseMirror_th]:shr-border-shorthand [&_.ProseMirror_th]:shr-p-0.5 [&_.ProseMirror_th]:shr-align-top [&_.ProseMirror_th]:shr-min-w-[6em] [&_.ProseMirror_th]:shr-bg-head [&_.ProseMirror_th]:shr-text-left [&_.ProseMirror_th]:shr-font-bold [&_.ProseMirror_th]:shr-relative [&_.ProseMirror_th]:shr-box-border',
  // selectedCell: 疑似要素オーバーレイ
  '[&_.ProseMirror_td.selectedCell::after]:shr-content-[""] [&_.ProseMirror_td.selectedCell::after]:shr-absolute [&_.ProseMirror_td.selectedCell::after]:shr-inset-0 [&_.ProseMirror_td.selectedCell::after]:shr-bg-main/10 [&_.ProseMirror_td.selectedCell::after]:shr-pointer-events-none [&_.ProseMirror_td.selectedCell::after]:shr-z-1',
  '[&_.ProseMirror_th.selectedCell::after]:shr-content-[""] [&_.ProseMirror_th.selectedCell::after]:shr-absolute [&_.ProseMirror_th.selectedCell::after]:shr-inset-0 [&_.ProseMirror_th.selectedCell::after]:shr-bg-main/10 [&_.ProseMirror_th.selectedCell::after]:shr-pointer-events-none [&_.ProseMirror_th.selectedCell::after]:shr-z-1',
  // column resize handle
  '[&_.ProseMirror_.column-resize-handle]:shr-absolute [&_.ProseMirror_.column-resize-handle]:shr-top-0 [&_.ProseMirror_.column-resize-handle]:shr-right-[-2px] [&_.ProseMirror_.column-resize-handle]:shr-bottom-[-2px] [&_.ProseMirror_.column-resize-handle]:shr-w-[4px] [&_.ProseMirror_.column-resize-handle]:shr-bg-main [&_.ProseMirror_.column-resize-handle]:shr-pointer-events-none [&_.ProseMirror_.column-resize-handle]:shr-z-overlap',
  // resize cursor (resize-cursor クラスは .ProseMirror 自身に付与される)
  '[&_.ProseMirror.resize-cursor]:shr-cursor-col-resize',
  '[&_.ProseMirror_td_p]:shr-my-0',
  '[&_.ProseMirror_th_p]:shr-my-0',
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

/** RichTextViewer 用: 直下の要素向けスタイル */
export const staticContentClasses = [
  // lists
  '[&_ul]:shr-list-disc [&_ul]:shr-pl-1.5',
  '[&_ol]:shr-list-decimal [&_ol]:shr-pl-1.5',
  '[&_li]:shr-my-0.25',
  '[&_li_p]:shr-my-0',
  // blockquote
  '[&_blockquote]:shr-ml-0 [&_blockquote]:shr-mr-0 [&_blockquote]:shr-border-0 [&_blockquote]:shr-border-l-[3px] [&_blockquote]:shr-border-solid [&_blockquote]:shr-border-l-grey [&_blockquote]:shr-pl-0.5',
  // headings (デザイントークン準拠: XXL→XL→L→M)
  '[&_h1]:shr-text-2xl [&_h1]:shr-font-normal [&_h1]:shr-leading-tight',
  '[&_h2]:shr-text-xl [&_h2]:shr-font-normal [&_h2]:shr-leading-tight',
  '[&_h3]:shr-text-lg [&_h3]:shr-font-normal [&_h3]:shr-leading-tight',
  '[&_h4]:shr-text-base [&_h4]:shr-font-bold [&_h4]:shr-leading-tight [&_h4]:shr-text-black',
  // code
  '[&_code]:shr-rounded-m [&_code]:shr-bg-white-darken [&_code]:shr-px-0.25 [&_code]:shr-py-[0.125rem] [&_code]:shr-text-sm',
  '[&_pre]:shr-overflow-x-auto [&_pre]:shr-rounded-m [&_pre]:shr-bg-white-darken [&_pre]:shr-p-0.75 [&_pre]:shr-text-sm',
  // horizontal rule
  '[&_hr]:shr-border-t-shorthand',
  // link
  '[&_a]:shr-text-main [&_a]:shr-underline',
  // image
  '[&_img]:shr-block [&_img]:shr-max-w-full',
  // youtube iframe
  '[&_iframe]:shr-max-w-full [&_iframe]:shr-rounded-m',
  // table (renderWrapper: true で <div class="tableWrapper"> が出力されるので、その内側に table)
  // テーブル自身に inline style で width が付くため、wrapper 側で横スクロールを担保する
  '[&_.tableWrapper]:shr-max-w-full [&_.tableWrapper]:shr-overflow-x-auto',
  '[&_table]:shr-border-collapse',
  '[&_td]:shr-border-shorthand [&_td]:shr-p-0.5 [&_td]:shr-align-top',
  '[&_th]:shr-border-shorthand [&_th]:shr-p-0.5 [&_th]:shr-align-top [&_th]:shr-bg-head [&_th]:shr-text-left [&_th]:shr-font-bold',
  '[&_td_p]:shr-my-0',
  '[&_th_p]:shr-my-0',
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
