// HINT: react-pdfが読み込むpdfjs-distは通常ビルドで、新しいAPIが存在する前提で書かれている。
// legacyビルドはcore-jsでpolyfillされているが、react-pdfがメインスレッドで読み込むのは通常ビルドのため、
// 未対応の環境ではsmarthr-ui側でpolyfillを適用する。
// react-pdfはpdfjs-distのバージョンを固定しているため、react-pdfを更新する際は使われているAPIを確認し直すこと

type MapLike = {
  has: (key: unknown) => boolean
  get: (key: unknown) => unknown
  set: (key: unknown, value: unknown) => unknown
}

const hasMethod = (target: object, name: PropertyKey) =>
  typeof (target as Record<PropertyKey, unknown>)[name] === 'function'

const defineMethod = (target: object, name: PropertyKey, value: unknown) => {
  // HINT: ネイティブのメソッドと同じく、for...inなどで列挙されないようにする
  Object.defineProperty(target, name, { value, writable: true, configurable: true })
}

// HINT: 配列やMapなど、組み込みのiteratorが共通で継承しているprototype。Iterator.prototypeと同じもの
const ITERATOR_PROTOTYPE: object = Object.getPrototypeOf(
  Object.getPrototypeOf([][Symbol.iterator]()),
)

const ITERATOR_HELPERS = {
  filter(this: Iterator<unknown>, predicate: (value: unknown, index: number) => unknown) {
    let index = 0
    const helper = Object.create(ITERATOR_PROTOTYPE)

    helper.next = () => {
      let result = this.next()

      while (!result.done && !predicate(result.value, index++)) {
        result = this.next()
      }

      return result
    }

    return helper
  },
  find(this: Iterator<unknown>, predicate: (value: unknown, index: number) => unknown) {
    let index = 0

    for (let result = this.next(); !result.done; result = this.next()) {
      if (predicate(result.value, index++)) {
        this.return?.()

        return result.value
      }
    }

    return undefined
  },
  some(this: Iterator<unknown>, predicate: (value: unknown, index: number) => unknown) {
    let index = 0

    for (let result = this.next(); !result.done; result = this.next()) {
      if (predicate(result.value, index++)) {
        this.return?.()

        return true
      }
    }

    return false
  },
  toArray(this: Iterator<unknown>) {
    const values: unknown[] = []

    for (let result = this.next(); !result.done; result = this.next()) {
      values.push(result.value)
    }

    return values
  },
}

const MAP_UPSERT_METHODS = {
  getOrInsert(this: MapLike, key: unknown, value: unknown) {
    if (!this.has(key)) {
      this.set(key, value)
    }

    return this.get(key)
  },
  getOrInsertComputed(this: MapLike, key: unknown, callback: (key: unknown) => unknown) {
    if (!this.has(key)) {
      this.set(key, callback(key))
    }

    return this.get(key)
  },
}

function readableStreamValues(this: ReadableStream, options?: { preventCancel?: boolean }) {
  const reader = this.getReader()

  return {
    next: () =>
      reader.read().then((result) => {
        if (result.done) {
          reader.releaseLock()
        }

        return result
      }),
    return: (value?: unknown) => {
      const cancelled = options?.preventCancel ? Promise.resolve() : reader.cancel(value)
      reader.releaseLock()

      return cancelled.then(() => ({ done: true, value }))
    },
    [Symbol.asyncIterator]() {
      return this
    },
  }
}

/**
 * pdfjs-distの通常ビルドが前提とするAPIのうち、実行環境に無いものをメインスレッドにpolyfillする。
 * pdfjs-distはモジュール評価時にもこれらのAPIを参照するため、react-pdfをimportする前に呼び出すこと
 *
 * @returns web workerにlegacyビルドを読み込む必要があるか
 */
export const applyPDFJSPolyfills = (): boolean => {
  // HINT: web workerはwindowとグローバルが別でpolyfillが効かないため、
  // polyfillを適用した環境ではpolyfill済みのlegacyビルドを読み込む
  let useLegacyWorker = false

  // iOS 17.3以下ではPromise.withResolversが未定義
  if (!hasMethod(Promise, 'withResolvers')) {
    defineMethod(Promise, 'withResolvers', () => {
      let resolve
      let reject
      const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })

      return { promise, resolve, reject }
    })
    useLegacyWorker = true
  }

  // iOS 18.2未満ではPromise.tryが未定義
  // HINT: pdfjs-dist 6系から、自前のpolyfillが削除された
  if (!hasMethod(Promise, 'try')) {
    defineMethod(
      Promise,
      'try',
      (callback: (...rest: unknown[]) => unknown, ...rest: unknown[]) =>
        new Promise((resolve) => resolve(callback(...rest))),
    )
    useLegacyWorker = true
  }

  // iOS 18未満ではURL.parseが未定義
  // HINT: pdfjs-dist 5.0.375 から、getDocumentでのURL解決などにURL.parseが使われている
  if (!hasMethod(URL, 'parse')) {
    defineMethod(URL, 'parse', (url: string | URL, base?: string | URL) => {
      try {
        return new URL(url, base)
      } catch {
        return null
      }
    })
    useLegacyWorker = true
  }

  // iOS 18未満ではResponse.prototype.bytesが未定義
  // HINT: cMapやwasmをメインスレッドで取得する際に使われる
  if (!hasMethod(Response.prototype, 'bytes')) {
    defineMethod(Response.prototype, 'bytes', function (this: Response) {
      return this.arrayBuffer().then((buffer) => new Uint8Array(buffer))
    })
    useLegacyWorker = true
  }

  // iOS 18.4未満ではIteratorとそのヘルパーメソッドが未定義
  // HINT: pdfjs-distはモジュール評価時に Iterator.prototype.join を定義するため、Iteratorが無いとimportの時点で例外になる
  if (!hasMethod(globalThis, 'Iterator')) {
    // HINT: Iteratorは抽象クラスで、pdfjs-distは Iterator.prototype にしかアクセスしない
    const IteratorConstructor = function () {}
    IteratorConstructor.prototype = ITERATOR_PROTOTYPE
    defineMethod(globalThis, 'Iterator', IteratorConstructor)
    useLegacyWorker = true
  }

  Object.entries(ITERATOR_HELPERS).forEach(([name, method]) => {
    if (!hasMethod(ITERATOR_PROTOTYPE, name)) {
      defineMethod(ITERATOR_PROTOTYPE, name, method)
      useLegacyWorker = true
    }
  })

  // iOS 26.2未満ではMap・WeakMapのgetOrInsert・getOrInsertComputedが未定義
  // HINT: pdfjs-dist 6系から、ページの描画などで使われている
  ;[Map.prototype, WeakMap.prototype].forEach((prototype) => {
    Object.entries(MAP_UPSERT_METHODS).forEach(([name, method]) => {
      if (!hasMethod(prototype, name)) {
        defineMethod(prototype, name, method)
        useLegacyWorker = true
      }
    })
  })

  // iOS 27未満ではReadableStreamをfor await...ofで読み込めない
  // HINT: pdfjs-dist 6系から、getTextContentでのテキストの取得に使われている。
  // workerでの利用箇所は失敗時に別の処理へ切り替わり、legacyビルドでもpolyfillされていないため、workerの切り替えは不要
  if (!hasMethod(ReadableStream.prototype, Symbol.asyncIterator)) {
    defineMethod(ReadableStream.prototype, 'values', readableStreamValues)
    defineMethod(ReadableStream.prototype, Symbol.asyncIterator, readableStreamValues)
  }

  // HINT: 以下はFileViewerがメインスレッドで使う処理には含まれないためpolyfillしないが、通常ビルドのworkerで使われている
  // Math.sumPrecise: iOS 26.2未満・Chrome 147未満、Uint8Array.fromBase64: iOS 18.2未満・Chrome 140未満
  if (!hasMethod(Math, 'sumPrecise') || !hasMethod(Uint8Array, 'fromBase64')) {
    useLegacyWorker = true
  }

  return useLegacyWorker
}
