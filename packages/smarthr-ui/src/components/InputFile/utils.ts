/**
 * 画像またはPDFかどうかを判定
 */
export const isImageOrPdf = (
  contentType: string,
): contentType is `image/${string}` | 'application/pdf' =>
  contentType.startsWith('image/') || contentType === 'application/pdf'

/**
 * Fileオブジェクトからダウンロードを実行（Blob URL を一時生成）
 */
export const downloadFile = (file: File): void => {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
  URL.revokeObjectURL(url)
}
