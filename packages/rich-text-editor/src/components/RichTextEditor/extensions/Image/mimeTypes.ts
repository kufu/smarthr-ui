export const DEFAULT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

/**
 * ファイルの MIME type が許可リストに一致するかを判定する。
 *
 * file input の accept 属性と同じく `image/*` 形式のワイルドカードを受け付ける。
 * 完全一致だけで判定すると、ファイル選択ダイアログでは選べるのにドラッグ&ドロップと
 * 貼り付けだけ無視される、という経路ごとの食い違いが起きる。
 */
export const matchesMimeType = (fileType: string, acceptedMimeTypes: string[]): boolean =>
  acceptedMimeTypes.some((accepted) =>
    accepted.endsWith('/*') ? fileType.startsWith(accepted.slice(0, -1)) : fileType === accepted,
  )
