import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

import type { EditorView } from '@tiptap/pm/view'

const syncPlayerTabIndex = (view: EditorView) => {
  view.dom
    .querySelectorAll('div[data-youtube-video] iframe, div[data-video] video')
    .forEach((player) => {
      if (view.editable) {
        player.setAttribute('tabindex', '-1')
      } else {
        player.removeAttribute('tabindex')
      }
    })
}

// YouTube の iframe の中で起きたイベントは本文まで届かないので、video だけを見る
const isInPlayer = (event: Event) =>
  event.target instanceof Element && event.target.closest('video') !== null

/**
 * 本文の動画プレーヤーを、エディタの操作から切り離す。
 *
 * 編集中に Tab が動画プレーヤーの中を順にたどると、本文の後ろの操作バーや次の入力欄へ届かない。
 * 出力の HTML には残さないよう、属性ではなく描画後の DOM に付ける。
 *
 * 再生中のプレーヤーで押したキーと、プレーヤーの中で始めたドラッグはプレーヤーに任せる。
 * エディタが受け取ると、選んでいる動画が Space で文字に置き換わり、矢印キーで選択が外れ、
 * シークバーを動かすと動画ごと動かすドラッグが始まる。
 */
export const PlayerIsolation = Extension.create({
  name: 'playerIsolation',

  addProseMirrorPlugins() {
    let pressedInPlayer = false

    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            keydown: (_view, event) => isInPlayer(event),
            keypress: (_view, event) => isInPlayer(event),
            pointerdown: (_view, event) => {
              pressedInPlayer = isInPlayer(event)

              return false
            },
            // ドラッグの対象は video ではなく動画の枠や選んでいる範囲になり、target では判定できない
            dragstart: (_view, event) => {
              if (!pressedInPlayer) return false

              event.preventDefault()

              return true
            },
          },
        },
        view: (editorView) => {
          let editable = editorView.editable
          // Tiptap はプラグインの後に nodeViews を設定して本文を描き直す。文書と編集可否だけを見ると、
          // 描き直しで作られた iframe に付かないまま残る
          let { nodeViews } = editorView.props
          syncPlayerTabIndex(editorView)

          return {
            update: (view, prevState) => {
              if (
                view.state.doc !== prevState.doc ||
                view.editable !== editable ||
                view.props.nodeViews !== nodeViews
              ) {
                editable = view.editable
                nodeViews = view.props.nodeViews
                syncPlayerTabIndex(view)
              }
            },
          }
        },
      }),
    ]
  },
})
