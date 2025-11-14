# intlについて

smarthr-uiの多言語化基盤です。 `react-intl` をベースにしています。

## 使い方

### 翻訳した文言を使いたいとき

`useIntl` hooksを使う場合

```tsx
import { useIntl } from 'smarthr-ui'

const Component = () => {
  const { localize } = useIntl()
  return <span>{localize({ id: 'smarthr-ui/common/language', defaultText: '日本語' })}</span>
}
```

`Localizer` componentを使う場合

```tsx
import { Localizer } from 'smarthr-ui'

const Component = () => {
  return <Localizer id="smarthr-ui/common/language" defaultText="日本語" />
}
```
