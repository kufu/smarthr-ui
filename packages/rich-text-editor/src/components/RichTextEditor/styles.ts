/**
 * RichTextEditor と RichTextViewer で共通のコンテンツスタイル定義
 *
 * Tailwind JIT はソースコード上のリテラル文字列をスキャンして CSS を生成するため、
 * クラス名を動的に組み立ててはならない。両方のバリエーションを静的に保持する。
 */

/** RichTextEditor 用: ProseMirror 内の要素向けスタイル */
export const editorContentClasses = [
  // lists
  '[&_.ProseMirror_ul]:shr-rte-my-0.5 [&_.ProseMirror_ul]:shr-rte-list-disc [&_.ProseMirror_ul]:shr-rte-pl-1.5',
  '[&_.ProseMirror_ol]:shr-rte-my-0.5 [&_.ProseMirror_ol]:shr-rte-list-decimal [&_.ProseMirror_ol]:shr-rte-pl-1.5',
  '[&_.ProseMirror_li_p]:shr-rte-my-0',
  // blockquote
  '[&_.ProseMirror_blockquote]:shr-rte-my-0.5 [&_.ProseMirror_blockquote]:shr-rte-ml-0 [&_.ProseMirror_blockquote]:shr-rte-mr-0 [&_.ProseMirror_blockquote]:shr-rte-border-0 [&_.ProseMirror_blockquote]:shr-rte-border-l-[3px] [&_.ProseMirror_blockquote]:shr-rte-border-solid [&_.ProseMirror_blockquote]:shr-rte-border-l-grey [&_.ProseMirror_blockquote]:shr-rte-pl-0.5',
  // headings (デザイントークン準拠: XXL→XL→L→M)
  // h1: XXL(32px) / normal / black
  '[&_.ProseMirror_h1]:shr-rte-my-0.5 [&_.ProseMirror_h1]:shr-rte-text-2xl [&_.ProseMirror_h1]:shr-rte-font-normal [&_.ProseMirror_h1]:shr-rte-leading-tight',
  // h2: XL(24px) / normal / black
  '[&_.ProseMirror_h2]:shr-rte-my-0.5 [&_.ProseMirror_h2]:shr-rte-text-xl [&_.ProseMirror_h2]:shr-rte-font-normal [&_.ProseMirror_h2]:shr-rte-leading-tight',
  // h3: L(19.2px) / normal / black
  '[&_.ProseMirror_h3]:shr-rte-my-0.5 [&_.ProseMirror_h3]:shr-rte-text-lg [&_.ProseMirror_h3]:shr-rte-font-normal [&_.ProseMirror_h3]:shr-rte-leading-tight',
  // h4: M(16px) / bold / black
  '[&_.ProseMirror_h4]:shr-rte-my-0.5 [&_.ProseMirror_h4]:shr-rte-text-base [&_.ProseMirror_h4]:shr-rte-font-bold [&_.ProseMirror_h4]:shr-rte-leading-tight [&_.ProseMirror_h4]:shr-rte-text-black',
  // code
  '[&_.ProseMirror_:not(pre)>code]:shr-rte-rounded-m [&_.ProseMirror_:not(pre)>code]:shr-rte-bg-white-darken [&_.ProseMirror_:not(pre)>code]:shr-rte-px-0.25 [&_.ProseMirror_:not(pre)>code]:shr-rte-py-[0.125rem] [&_.ProseMirror_:not(pre)>code]:shr-rte-text-sm',
  '[&_.ProseMirror_pre]:shr-rte-my-0.5 [&_.ProseMirror_pre]:shr-rte-overflow-x-auto [&_.ProseMirror_pre]:shr-rte-rounded-m [&_.ProseMirror_pre]:shr-rte-bg-white-darken [&_.ProseMirror_pre]:shr-rte-p-0.75 [&_.ProseMirror_pre]:shr-rte-text-sm',
  // horizontal rule
  '[&_.ProseMirror_hr]:shr-rte-my-1 [&_.ProseMirror_hr]:shr-rte-border-t-shorthand',
  // link
  '[&_.ProseMirror_a]:shr-rte-text-main [&_.ProseMirror_a]:shr-rte-underline',
  // image
  // display:block にしないと inline 画像の行ボックスにディセンダ分の隙間ができ、
  // リサイズハンドル(wrapper基準で bottom:0 配置)の下側が画像下端より下にズレる。
  // RichTextViewer 側(staticContentClasses)も block で揃えている。
  '[&_.ProseMirror_img]:shr-rte-my-0.5 [&_.ProseMirror_img]:shr-rte-block [&_.ProseMirror_img]:shr-rte-max-w-full',
  '[&_.ProseMirror_img.ProseMirror-selectednode]:shr-rte-outline [&_.ProseMirror_img.ProseMirror-selectednode]:shr-rte-outline-2 [&_.ProseMirror_img.ProseMirror-selectednode]:shr-rte-outline-offset-2',
  // 読み込みに失敗した画像（CustomImage の onerror が data-image-error を付ける）
  // 幅・高さが未指定の壊れた画像は箱が潰れてクリックできなくなるため、最小サイズを確保する。
  // 枠線と背景は「ここに画像があるが表示できない」ことを示すためのもの。
  '[&_.ProseMirror_img[data-image-error]]:shr-rte-min-h-[3em] [&_.ProseMirror_img[data-image-error]]:shr-rte-min-w-[3em] [&_.ProseMirror_img[data-image-error]]:shr-rte-border [&_.ProseMirror_img[data-image-error]]:shr-rte-border-dashed [&_.ProseMirror_img[data-image-error]]:shr-rte-border-grey [&_.ProseMirror_img[data-image-error]]:shr-rte-bg-white-darken [&_.ProseMirror_img[data-image-error]]:shr-rte-p-0.25 [&_.ProseMirror_img[data-image-error]]:shr-rte-text-sm [&_.ProseMirror_img[data-image-error]]:shr-rte-text-grey',
  // image resize container
  '[&_.ProseMirror_[data-resize-container]]:shr-rte-w-fit [&_.ProseMirror_[data-resize-container]]:shr-rte-max-w-full [&_.ProseMirror_[data-resize-container]]:shr-rte-my-0.5',
  '[&_.ProseMirror_[data-resize-container]_img]:shr-rte-my-0',
  '[&_.ProseMirror_[data-resize-container].ProseMirror-selectednode_img]:shr-rte-outline [&_.ProseMirror_[data-resize-container].ProseMirror-selectednode_img]:shr-rte-outline-2 [&_.ProseMirror_[data-resize-container].ProseMirror-selectednode_img]:shr-rte-outline-offset-2',
  // image resize handles
  '[&_.ProseMirror_[data-resize-handle]]:shr-rte-size-[10px] [&_.ProseMirror_[data-resize-handle]]:shr-rte-rounded-full [&_.ProseMirror_[data-resize-handle]]:shr-rte-bg-main [&_.ProseMirror_[data-resize-handle]]:shr-rte-border [&_.ProseMirror_[data-resize-handle]]:shr-rte-border-solid [&_.ProseMirror_[data-resize-handle]]:shr-rte-border-white [&_.ProseMirror_[data-resize-handle]]:shr-rte-shadow-layer-1 [&_.ProseMirror_[data-resize-handle]]:shr-rte-opacity-0 [&_.ProseMirror_[data-resize-handle]]:shr-rte-transition-opacity [&_.ProseMirror_[data-resize-handle]]:shr-rte-z-1 [&_.ProseMirror_[data-resize-handle]]:shr-rte-m-[-5px]',
  '[&_.ProseMirror_[data-resize-wrapper]:hover_[data-resize-handle]]:shr-rte-opacity-100',
  '[&_.ProseMirror_[data-resize-container][data-resize-state=true]_[data-resize-handle]]:shr-rte-opacity-100',
  '[&_.ProseMirror[contenteditable=false]_[data-resize-handle]]:shr-rte-hidden',
  // image upload placeholder（アップロード中。Decoration の widget span）
  // 円形CSSスピナー（Loader size="S" 相当の24px）。上辺だけ透明にして回転させる。
  '[&_.ProseMirror_.smarthr-ui-RichTextEditor-imageUploadPlaceholder]:shr-rte-my-0.5 [&_.ProseMirror_.smarthr-ui-RichTextEditor-imageUploadPlaceholder]:shr-rte-inline-block [&_.ProseMirror_.smarthr-ui-RichTextEditor-imageUploadPlaceholder]:shr-rte-size-2 [&_.ProseMirror_.smarthr-ui-RichTextEditor-imageUploadPlaceholder]:shr-rte-rounded-full [&_.ProseMirror_.smarthr-ui-RichTextEditor-imageUploadPlaceholder]:shr-rte-border-2 [&_.ProseMirror_.smarthr-ui-RichTextEditor-imageUploadPlaceholder]:shr-rte-border-solid [&_.ProseMirror_.smarthr-ui-RichTextEditor-imageUploadPlaceholder]:shr-rte-border-main [&_.ProseMirror_.smarthr-ui-RichTextEditor-imageUploadPlaceholder]:shr-rte-border-t-transparent [&_.ProseMirror_.smarthr-ui-RichTextEditor-imageUploadPlaceholder]:shr-rte-align-middle [&_.ProseMirror_.smarthr-ui-RichTextEditor-imageUploadPlaceholder]:shr-rte-animate-[spin_0.8s_linear_infinite] motion-reduce:[&_.ProseMirror_.smarthr-ui-RichTextEditor-imageUploadPlaceholder]:shr-rte-animate-none',
  // youtube iframe
  '[&_.ProseMirror_iframe]:shr-rte-my-0.5 [&_.ProseMirror_iframe]:shr-rte-max-w-full [&_.ProseMirror_iframe]:shr-rte-rounded-m',
  '[&_.ProseMirror_div[data-youtube-video]]:shr-rte-my-0.5 [&_.ProseMirror_div[data-youtube-video]]:shr-rte-inline-block [&_.ProseMirror_div[data-youtube-video]]:shr-rte-rounded-m',
  '[&_.ProseMirror_div[data-youtube-video].ProseMirror-selectednode]:shr-rte-outline [&_.ProseMirror_div[data-youtube-video].ProseMirror-selectednode]:shr-rte-outline-2 [&_.ProseMirror_div[data-youtube-video].ProseMirror-selectednode]:shr-rte-outline-offset-2',
  // table (resizable: tableWrapper で囲まれる)
  // テーブルは内容幅にしてNotion風レイアウトを実現。column-resizingはtable-fixedで動作する。
  // tableWrapperの右と下に +列/+行 バー(24px)用の余白を確保。テーブル幅がそれを超えると
  // tableWrapper内で横スクロールが発生する。
  '[&_.ProseMirror_.tableWrapper]:shr-rte-outline-none [&_.ProseMirror_.tableWrapper]:shr-rte-shadow-none [&_.ProseMirror_.tableWrapper]:shr-rte-mt-2 [&_.ProseMirror_.tableWrapper]:shr-rte-mb-2 [&_.ProseMirror_.tableWrapper]:shr-rte-ml-1.5 [&_.ProseMirror_.tableWrapper]:shr-rte-w-fit [&_.ProseMirror_.tableWrapper]:shr-rte-max-w-[calc(100%-3.25rem)] [&_.ProseMirror_.tableWrapper]:shr-rte-overflow-x-auto',
  // 余白は上下それぞれ片側の操作UI（下の行追加バー・上の列ハンドル）分しか見込んでおらず、
  // 表が続くと margin の相殺で両者が同じ帯に重なる。全ての表を広げず、隣り合うときだけ広げる
  '[&_.ProseMirror_.tableWrapper+.tableWrapper]:shr-rte-mt-4',
  // 表の間にギャップカーソルが置かれると、要素が挟まって上のセレクタが外れる
  '[&_.ProseMirror_.tableWrapper+.ProseMirror-gapcursor+.tableWrapper]:shr-rte-mt-4',
  '[&_.ProseMirror_table]:shr-rte-w-auto [&_.ProseMirror_table]:shr-rte-table-fixed [&_.ProseMirror_table]:shr-rte-border-collapse [&_.ProseMirror_table]:shr-rte-overflow-hidden',
  // 右の padding だけ広いのは、セル操作ボタン(24px幅)がセルの右端をまたいで配置され
  // 内側へ13px食い込むため。左右対称にすると本文がボタンの下に潜る。
  // Viewer 側(下部)も同値にしないと、編集時と表示時で文字の折り返し位置がずれる。
  '[&_.ProseMirror_td]:shr-rte-border-shorthand [&_.ProseMirror_td]:shr-rte-p-0.5 [&_.ProseMirror_td]:shr-rte-pr-1 [&_.ProseMirror_td]:shr-rte-align-top [&_.ProseMirror_td]:shr-rte-min-w-[6em] [&_.ProseMirror_td]:shr-rte-relative [&_.ProseMirror_td]:shr-rte-box-border',
  '[&_.ProseMirror_th]:shr-rte-border-shorthand [&_.ProseMirror_th]:shr-rte-p-0.5 [&_.ProseMirror_th]:shr-rte-pr-1 [&_.ProseMirror_th]:shr-rte-align-top [&_.ProseMirror_th]:shr-rte-min-w-[6em] [&_.ProseMirror_th]:shr-rte-bg-head [&_.ProseMirror_th]:shr-rte-text-left [&_.ProseMirror_th]:shr-rte-font-bold [&_.ProseMirror_th]:shr-rte-relative [&_.ProseMirror_th]:shr-rte-box-border',
  // selectedCell: 疑似要素オーバーレイ
  '[&_.ProseMirror_td.selectedCell::after]:shr-rte-content-[""] [&_.ProseMirror_td.selectedCell::after]:shr-rte-absolute [&_.ProseMirror_td.selectedCell::after]:shr-rte-inset-0 [&_.ProseMirror_td.selectedCell::after]:shr-rte-bg-main/10 [&_.ProseMirror_td.selectedCell::after]:shr-rte-pointer-events-none [&_.ProseMirror_td.selectedCell::after]:shr-rte-z-1',
  '[&_.ProseMirror_th.selectedCell::after]:shr-rte-content-[""] [&_.ProseMirror_th.selectedCell::after]:shr-rte-absolute [&_.ProseMirror_th.selectedCell::after]:shr-rte-inset-0 [&_.ProseMirror_th.selectedCell::after]:shr-rte-bg-main/10 [&_.ProseMirror_th.selectedCell::after]:shr-rte-pointer-events-none [&_.ProseMirror_th.selectedCell::after]:shr-rte-z-1',
  // column resize handle
  '[&_.ProseMirror_.column-resize-handle]:shr-rte-absolute [&_.ProseMirror_.column-resize-handle]:shr-rte-top-0 [&_.ProseMirror_.column-resize-handle]:shr-rte-right-[-2px] [&_.ProseMirror_.column-resize-handle]:shr-rte-bottom-[-2px] [&_.ProseMirror_.column-resize-handle]:shr-rte-w-[4px] [&_.ProseMirror_.column-resize-handle]:shr-rte-bg-main [&_.ProseMirror_.column-resize-handle]:shr-rte-pointer-events-none [&_.ProseMirror_.column-resize-handle]:shr-rte-z-overlap',
  // resize cursor (resize-cursor クラスは .ProseMirror 自身に付与される)
  '[&_.ProseMirror.resize-cursor]:shr-rte-cursor-col-resize',
  '[&_.ProseMirror_td_p]:shr-rte-my-0',
  '[&_.ProseMirror_th_p]:shr-rte-my-0',
  // paragraph
  // 本文の行送りはデザイントークンの RELAXED(1.75) をデフォルトにする。
  // li / blockquote / table セルの中身も p なのでまとめて 1.75 になる（見出し・コードは別指定）。
  '[&_.ProseMirror_p]:shr-rte-my-0 [&_.ProseMirror_p]:shr-rte-leading-loose',
  // VoiceOver対策: ブロック要素末尾にゼロ幅スペースを追加し、読み上げ時の単語結合を防ぐ
  // https://tiptap.dev/docs/guides/accessibility
  // 空のブロックは trailingBreak の後ろに2行目ができて高さが倍になるため除外する。
  // li・blockquote は中身の p に付くので対象にしない（付けると1行分伸びる）。
  // Tailwind はソースを文字列のまま読むため、'\\200B' と書くとバックスラッシュ2つの
  // クラスとして生成され、実行時のクラス名と一致しない。String.raw で両者を揃える。
  String.raw`[&_.ProseMirror_p:not(:has(>br.ProseMirror-trailingBreak:only-child))::after]:shr-rte-content-['\200B']`,
  String.raw`[&_.ProseMirror_h1:not(:has(>br.ProseMirror-trailingBreak:only-child))::after]:shr-rte-content-['\200B']`,
  String.raw`[&_.ProseMirror_h2:not(:has(>br.ProseMirror-trailingBreak:only-child))::after]:shr-rte-content-['\200B']`,
  String.raw`[&_.ProseMirror_h3:not(:has(>br.ProseMirror-trailingBreak:only-child))::after]:shr-rte-content-['\200B']`,
  String.raw`[&_.ProseMirror_h4:not(:has(>br.ProseMirror-trailingBreak:only-child))::after]:shr-rte-content-['\200B']`,
] as const

/** RichTextViewer 用: 直下の要素向けスタイル */
export const staticContentClasses = [
  // lists
  '[&_ul]:shr-rte-list-disc [&_ul]:shr-rte-pl-1.5',
  '[&_ol]:shr-rte-list-decimal [&_ol]:shr-rte-pl-1.5',
  '[&_li_p]:shr-rte-my-0',
  // blockquote
  '[&_blockquote]:shr-rte-ml-0 [&_blockquote]:shr-rte-mr-0 [&_blockquote]:shr-rte-border-0 [&_blockquote]:shr-rte-border-l-[3px] [&_blockquote]:shr-rte-border-solid [&_blockquote]:shr-rte-border-l-grey [&_blockquote]:shr-rte-pl-0.5',
  // headings (デザイントークン準拠: XXL→XL→L→M)
  '[&_h1]:shr-rte-text-2xl [&_h1]:shr-rte-font-normal [&_h1]:shr-rte-leading-tight',
  '[&_h2]:shr-rte-text-xl [&_h2]:shr-rte-font-normal [&_h2]:shr-rte-leading-tight',
  '[&_h3]:shr-rte-text-lg [&_h3]:shr-rte-font-normal [&_h3]:shr-rte-leading-tight',
  '[&_h4]:shr-rte-text-base [&_h4]:shr-rte-font-bold [&_h4]:shr-rte-leading-tight [&_h4]:shr-rte-text-black',
  // code
  '[&_:not(pre)>code]:shr-rte-rounded-m [&_:not(pre)>code]:shr-rte-bg-white-darken [&_:not(pre)>code]:shr-rte-px-0.25 [&_:not(pre)>code]:shr-rte-py-[0.125rem] [&_:not(pre)>code]:shr-rte-text-sm',
  '[&_pre]:shr-rte-overflow-x-auto [&_pre]:shr-rte-rounded-m [&_pre]:shr-rte-bg-white-darken [&_pre]:shr-rte-p-0.75 [&_pre]:shr-rte-text-sm',
  // horizontal rule
  '[&_hr]:shr-rte-border-t-shorthand',
  // link
  '[&_a]:shr-rte-text-main [&_a]:shr-rte-underline',
  // image
  '[&_img]:shr-rte-block [&_img]:shr-rte-max-w-full',
  // youtube iframe
  '[&_iframe]:shr-rte-max-w-full [&_iframe]:shr-rte-rounded-m',
  // table (renderWrapper: true で <div class="tableWrapper"> が出力されるので、その内側に table)
  // テーブル自身に inline style で width が付くため、wrapper 側で横スクロールを担保する
  '[&_.tableWrapper]:shr-rte-max-w-full [&_.tableWrapper]:shr-rte-overflow-x-auto',
  '[&_table]:shr-rte-table-fixed [&_table]:shr-rte-border-collapse',
  '[&_td]:shr-rte-border-shorthand [&_td]:shr-rte-p-0.5 [&_td]:shr-rte-pr-1 [&_td]:shr-rte-align-top [&_td]:shr-rte-min-w-[6em] [&_td]:shr-rte-box-border',
  '[&_th]:shr-rte-border-shorthand [&_th]:shr-rte-p-0.5 [&_th]:shr-rte-pr-1 [&_th]:shr-rte-align-top [&_th]:shr-rte-min-w-[6em] [&_th]:shr-rte-box-border [&_th]:shr-rte-bg-head [&_th]:shr-rte-text-left [&_th]:shr-rte-font-bold',
  // 編集時の trailingBreak が保存されない空段落にも、1行分の高さを確保する。
  '[&_td_p]:shr-rte-my-0 [&_td_p]:shr-rte-min-h-[1.75em]',
  '[&_th_p]:shr-rte-my-0 [&_th_p]:shr-rte-min-h-[1.75em]',
  // paragraph
  // エディタ側(editorContentClasses)と行送りを揃える: 本文は RELAXED(1.75)
  '[&_p]:shr-rte-my-0 [&_p]:shr-rte-leading-loose',
  // VoiceOver対策: エディタ側と同じ。空のブロックは高さ0から1行分に伸びるため除外する
  String.raw`[&_p:not(:empty)::after]:shr-rte-content-['\200B']`,
  String.raw`[&_h1:not(:empty)::after]:shr-rte-content-['\200B']`,
  String.raw`[&_h2:not(:empty)::after]:shr-rte-content-['\200B']`,
  String.raw`[&_h3:not(:empty)::after]:shr-rte-content-['\200B']`,
  String.raw`[&_h4:not(:empty)::after]:shr-rte-content-['\200B']`,
] as const
