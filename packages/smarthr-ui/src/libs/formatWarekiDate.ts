export const formatWarekiDate = (date: Date | null, locale: string) => {
  if (!date) {
    return null
  }

  return date.toLocaleDateString(`${locale}-u-ca-japanese`, {
    dateStyle: 'long',
  })
}
