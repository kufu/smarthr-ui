# FlashMessageList

## Usage

1. Wrap the location where you want the messages to show with `FlashMessageListProvider`.

```tsx
import { FlashMessageListProvider } from 'smarthr-ui'
```

```tsx
<FlashMessageListProvider>
  <MyApp />
</FlashMessageListProvider>
```

2. Add message by `useFlashMessageList` hook.

```tsx
import { useFlashMessageList } from 'smarthr-ui'

const MyComponent = () => {
  const { enqueueMessage } = useFlashMessageList()

  const handleClick = () => {
    enqueueMessage({
      type: 'success',
      text: `success`,
    })
  }

  return <button onClick={handleClick}>Add message</button>
}
```
