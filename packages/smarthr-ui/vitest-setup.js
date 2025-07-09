import '@testing-library/jest-dom/vitest'

// DataTransferのモックを追加
global.DataTransfer = class DataTransfer {
  constructor() {
    this._items = []
    this._files = []
    this._dropEffect = 'none'
    this._effectAllowed = 'uninitialized'
    this._types = []
    this._data = new Map()
  }

  get items() {
    return {
      add: (data, type) => {
        this._items.push({ data, type })
        this._types.push(type)
        if (data instanceof File) {
          this._files.push(data)
        }
        return this._items.length - 1
      },
      clear: () => {
        this._items = []
        this._files = []
        this._types = []
        this._data.clear()
      },
      remove: (index) => {
        if (index >= 0 && index < this._items.length) {
          const item = this._items[index]
          this._items.splice(index, 1)
          this._types.splice(index, 1)
          if (item.data instanceof File) {
            const fileIndex = this._files.indexOf(item.data)
            if (fileIndex > -1) {
              this._files.splice(fileIndex, 1)
            }
          }
        }
      },
      get length() {
        return this._items.length
      }
    }
  }

  get files() {
    return this._files
  }

  get types() {
    return [...this._types]
  }

  get dropEffect() {
    return this._dropEffect
  }

  set dropEffect(value) {
    if (['none', 'copy', 'link', 'move'].includes(value)) {
      this._dropEffect = value
    }
  }

  get effectAllowed() {
    return this._effectAllowed
  }

  set effectAllowed(value) {
    if (['none', 'copy', 'copyLink', 'copyMove', 'link', 'linkMove', 'move', 'all', 'uninitialized'].includes(value)) {
      this._effectAllowed = value
    }
  }

  clearData(format) {
    if (format) {
      this._data.delete(format)
      const index = this._types.indexOf(format)
      if (index > -1) {
        this._types.splice(index, 1)
      }
    } else {
      this._data.clear()
      this._types.length = 0
    }
  }

  getData(format) {
    return this._data.get(format) || ''
  }

  setData(format, data) {
    this._data.set(format, data)
    if (!this._types.includes(format)) {
      this._types.push(format)
    }
  }

  setDragImage(element, x, y) {
    // モックでは何もしない
  }
}
