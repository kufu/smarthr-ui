A Reel component.

内包するコンテンツを水平方向に並べ、要素の幅を越えた時にスクロールバーを出すコンポーネントです。[Every Layout の Reel](https://every-layout.dev/layouts/reel/) を参考にしています。

<details>
<summary>how to import</summary>

```tsx
import { Reel } from 'smarthr-ui'
```

</details>

## Accessibility

`<Reel>` 内のコンテンツに<kbd>Tab</kbd>でフォーカスできる要素がない場合、キーボードでスクロールができなくなります。
<kbd>Tab</kbd>でフォーカスできる要素がない場合は `<Reel>` に `tabIndex={0}` を付与してください。
