## このコンポーネントについて

props を埋めていくだけで良い感じに共通のヘッダー/ナビゲーションの UI が組み立てられるコンポーネントです。

## どのように使うのか

`types.ts` にある HeaderProps というのが最終的な props なのであり、これらを穴埋めしていくことになります。
`xxxAdditionalContent` 以外の props は積極的に埋めてください。

```ts
export type HeaderProps = ComponentProps<typeof Header> & {
  locale?: LocaleProps | null
  enableNew?: boolean
  appName?: ReactNode
  schoolUrl?: string | null
  helpPageUrl?: string | null
  userInfo?: UserInfoProps | null
  desktopAdditionalContent?: ReactNode
  navigations?: Navigation[] | null
  desktopNavigationAdditionalContent?: ReactNode
  releaseNote?: ReleaseNoteProps | null
  features?: Array<Launcher['feature']>
  mobileAdditionalContent?: ReactNode
}
```

下記に、少し特殊な動きをするものやパッと見分かりづらいであろうと思われる props だけ補足説明を書きます。

- `locale`
    - 多言語対応に wovn を使っている場合はこの props は不要です。
- `tenants`
    - デスクトップ表示時
        - Header コンポーネントと同じです。
    - モバイル表示時
        - ハンバーガーメニューが表示されている場合はメニューの中に、そうでない場合はデスクトップ表示時と同じ箇所 (ロゴの横) に表示されます。
        - もし既存の独自実装ハンバーガーメニュー内にテナント選択の UI があるなどの理由で「ハンバーガーメニューは表示しないがモバイル表示時にヘッダーにテナント選択の UI を表示したくない」という場合は、ウィンドウサイズが 751px 以下のときに tenants props に undefined を渡すようにしてください。
- `navigations`
    - ヘッダーの下にナビゲーションが表示されるようになります。
    - AppNavi コンポーネントの buttons props とほぼ同じ型のデータを取ります。
    - AppNavi コンポーネントの buttons にはなかった、ドロップダウン内でのナビゲーションのグルーピングができるようになっています。
        - storybook の「VRT Navigation Dropdown Group」を参考にしてください。
    - **navigations props に値が渡されているときのみ、モバイル表示時にハンバーガーメニューが表示されます。独自実装の ハンバーガーメニューが存在する場合は、navigations props を利用するタイミングで移行してください。**
- `desktopAdditionalContent`
    - ユーザー名をクリックしたときのドロップダウンの、「個人設定」の下に入れたいものがある場合に使います。
    - 見た目の共通化のため、乱用は避けてください
- `desktopNavigationAdditionalContent`
    - ナビゲーション内で右寄せ、かつリリースノートの左側に入れたい物がある場合に使います。
    - 見た目の共通化のため、乱用は避けてください
- `mobileAdditionalContent`
    - モバイル表示時に、メニュー内に何か追加で起きたいものがある場合に使います。
    - 見た目の共通化のため、乱用は避けてほしいですが、もし何かしらのパーツを配置する必要がある場合は、デザイナーと相談しながら実装してください。

## 多言語対応について

- wovn を使っているアプリの場合
    - 内部で表示されているテキストに関しては、すべて `woven-enabled="true"` がついています。
    - 外部から渡すテキストは全て `ReactNode` 型で受け取るようになっているので、`<span woven-enabled="true">ほげ</span>` みたいなものを渡すようにしてください。
- 辞書を持っているアプリの場合
    - コンポーネント側で辞書を持っているので、`locale` の props を埋めると内部的に持っているテキストは翻訳されます。
    - 外部から渡すテキストはアプリケーション側で翻訳されたものを渡すようにしてください。
