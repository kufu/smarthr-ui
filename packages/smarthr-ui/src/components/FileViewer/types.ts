export type FileForViewer = {
  url: string
  contentType: string
  alt?: string
}

export type ViewerProps = {
  file: FileForViewer
  scale: number
  rotation: number
  width: number
  onLoad: () => void
}
