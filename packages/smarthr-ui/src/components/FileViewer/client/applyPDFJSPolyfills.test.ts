import { applyPDFJSPolyfills } from './applyPDFJSPolyfills'

type Methods = Record<PropertyKey, (...rest: unknown[]) => unknown>

const ITERATOR_PROTOTYPE: object = Object.getPrototypeOf(
  Object.getPrototypeOf([][Symbol.iterator]()),
)

// applyPDFJSPolyfillsが参照・定義する可能性のあるAPI
const TARGETS: Array<[object, PropertyKey]> = [
  [Promise, 'withResolvers'],
  [Promise, 'try'],
  [URL, 'parse'],
  [Response.prototype, 'bytes'],
  [globalThis, 'Iterator'],
  [ITERATOR_PROTOTYPE, 'filter'],
  [ITERATOR_PROTOTYPE, 'find'],
  [ITERATOR_PROTOTYPE, 'some'],
  [ITERATOR_PROTOTYPE, 'toArray'],
  [Map.prototype, 'getOrInsert'],
  [Map.prototype, 'getOrInsertComputed'],
  [WeakMap.prototype, 'getOrInsert'],
  [WeakMap.prototype, 'getOrInsertComputed'],
  [ReadableStream.prototype, 'values'],
  [ReadableStream.prototype, Symbol.asyncIterator],
  [Math, 'sumPrecise'],
  [Uint8Array, 'fromBase64'],
]

const call = (target: object, name: PropertyKey, ...rest: unknown[]) =>
  (target as Methods)[name](...rest)

const remove = (target: object, name: PropertyKey) => {
  Reflect.deleteProperty(target, name)

  // HINT: 継承元に定義されているAPIはdeleteでは消せないため、undefinedで上書きして未定義の環境を再現する
  if (typeof (target as Methods)[name] !== 'undefined') {
    Object.defineProperty(target, name, { value: undefined, configurable: true, writable: true })
  }
}

describe('applyPDFJSPolyfills', () => {
  let originalDescriptors: Array<[object, PropertyKey, PropertyDescriptor | undefined]>

  beforeEach(() => {
    originalDescriptors = TARGETS.map(([target, name]) => [
      target,
      name,
      Object.getOwnPropertyDescriptor(target, name),
    ])

    // HINT: テスト環境のNode.jsのバージョンによって存在するAPIが異なるため、すべて存在する状態から始める
    TARGETS.forEach(([target, name]) => {
      if (typeof (target as Methods)[name] !== 'function') {
        Object.defineProperty(target, name, {
          value: function stub() {},
          configurable: true,
          writable: true,
        })
      }
    })
  })

  afterEach(() => {
    originalDescriptors.forEach(([target, name, descriptor]) => {
      if (descriptor) {
        Object.defineProperty(target, name, descriptor)
      } else {
        Reflect.deleteProperty(target, name)
      }
    })
  })

  test('すべてのAPIが存在する環境では、polyfillを適用せず通常ビルドのworkerを使う', () => {
    const before = TARGETS.map(([target, name]) => (target as Methods)[name])

    expect(applyPDFJSPolyfills()).toBe(false)
    expect(TARGETS.map(([target, name]) => (target as Methods)[name])).toEqual(before)
  })

  test.each<[string, object, PropertyKey, () => Promise<void> | void]>([
    [
      'Promise.withResolvers',
      Promise,
      'withResolvers',
      async () => {
        const { promise, resolve } = call(Promise, 'withResolvers') as {
          promise: Promise<unknown>
          resolve: (value: unknown) => void
        }
        resolve(1)

        await expect(promise).resolves.toBe(1)
      },
    ],
    [
      'Promise.try',
      Promise,
      'try',
      async () => {
        await expect(call(Promise, 'try', (a: number, b: number) => a + b, 1, 2)).resolves.toBe(3)
        await expect(
          call(Promise, 'try', () => {
            throw new Error('sync error')
          }),
        ).rejects.toThrow('sync error')
      },
    ],
    [
      'URL.parse',
      URL,
      'parse',
      () => {
        expect((call(URL, 'parse', 'https://example.com/sample.pdf') as URL).href).toBe(
          'https://example.com/sample.pdf',
        )
        expect((call(URL, 'parse', '/sample.pdf', 'https://example.com/dir/') as URL).href).toBe(
          'https://example.com/sample.pdf',
        )
        expect(call(URL, 'parse', 'invalid url')).toBeNull()
      },
    ],
    [
      'Response.prototype.bytes',
      Response.prototype,
      'bytes',
      async () => {
        await expect(call(new Response('abc'), 'bytes')).resolves.toEqual(
          new Uint8Array([97, 98, 99]),
        )
      },
    ],
    [
      'Iterator',
      globalThis,
      'Iterator',
      () => {
        expect(
          (globalThis as unknown as { Iterator: { prototype: object } }).Iterator.prototype,
        ).toBe(ITERATOR_PROTOTYPE)
      },
    ],
    [
      'Iterator.prototype.filter',
      ITERATOR_PROTOTYPE,
      'filter',
      () => {
        const filtered = call(new Set([1, 2, 3, 4]).values(), 'filter', (v: number) => v !== 2)
        const refiltered = call(filtered as object, 'filter', (v: number) => v !== 4)

        expect([...(refiltered as Iterable<number>)]).toEqual([1, 3])
      },
    ],
    [
      'Iterator.prototype.find',
      ITERATOR_PROTOTYPE,
      'find',
      () => {
        expect(call(new Set([1, 2, 3]).values(), 'find', (v: number) => v > 1)).toBe(2)
        expect(call(new Set([1, 2, 3]).values(), 'find', (v: number) => v > 3)).toBeUndefined()
      },
    ],
    [
      'Iterator.prototype.some',
      ITERATOR_PROTOTYPE,
      'some',
      () => {
        expect(call(new Set([1, 2, 3]).values(), 'some', (v: number) => v > 2)).toBe(true)
        expect(call(new Set([1, 2, 3]).values(), 'some', (v: number) => v > 3)).toBe(false)
      },
    ],
    [
      'Iterator.prototype.toArray',
      ITERATOR_PROTOTYPE,
      'toArray',
      () => {
        expect(call(new Map([['a', 1]]).keys(), 'toArray')).toEqual(['a'])
      },
    ],
    [
      'Map.prototype.getOrInsert',
      Map.prototype,
      'getOrInsert',
      () => {
        const map = new Map([['a', 1]])

        expect(call(map, 'getOrInsert', 'a', 2)).toBe(1)
        expect(call(map, 'getOrInsert', 'b', 2)).toBe(2)
        expect(map.get('b')).toBe(2)
      },
    ],
    [
      'Map.prototype.getOrInsertComputed',
      Map.prototype,
      'getOrInsertComputed',
      () => {
        const map = new Map([['a', 1]])
        const callback = vi.fn(() => 2)

        expect(call(map, 'getOrInsertComputed', 'a', callback)).toBe(1)
        expect(callback).not.toHaveBeenCalled()
        expect(call(map, 'getOrInsertComputed', 'b', callback)).toBe(2)
        expect(callback).toHaveBeenCalledWith('b')
        expect(map.get('b')).toBe(2)
      },
    ],
    [
      'WeakMap.prototype.getOrInsert',
      WeakMap.prototype,
      'getOrInsert',
      () => {
        const key = {}
        const map = new WeakMap([[key, 1]])

        expect(call(map, 'getOrInsert', key, 2)).toBe(1)
        expect(call(map, 'getOrInsert', {}, 2)).toBe(2)
      },
    ],
    [
      'WeakMap.prototype.getOrInsertComputed',
      WeakMap.prototype,
      'getOrInsertComputed',
      () => {
        const key = {}
        const map = new WeakMap<object, number>()

        expect(call(map, 'getOrInsertComputed', key, () => 2)).toBe(2)
        expect(map.get(key)).toBe(2)
      },
    ],
  ])(
    '%sが無い環境では、polyfillを適用してlegacyビルドのworkerを使う',
    async (_, target, name, verify) => {
      remove(target, name)

      expect(applyPDFJSPolyfills()).toBe(true)
      // HINT: ネイティブのメソッドと同じく列挙されないこと
      expect(Object.getOwnPropertyDescriptor(target, name)?.enumerable).toBe(false)
      await verify()
    },
  )

  test('ReadableStreamをfor await...ofで読み込めない環境では、polyfillを適用するがworkerは切り替えない', async () => {
    remove(ReadableStream.prototype, 'values')
    remove(ReadableStream.prototype, Symbol.asyncIterator)

    expect(applyPDFJSPolyfills()).toBe(false)

    const values: number[] = []
    const stream = new ReadableStream<number>({
      start(controller) {
        controller.enqueue(1)
        controller.enqueue(2)
        controller.close()
      },
    })

    for await (const value of stream as unknown as AsyncIterable<number>) {
      values.push(value)
    }

    expect(values).toEqual([1, 2])

    // 途中で抜けた場合はstreamをcancelする
    const cancel = vi.fn()
    const infiniteStream = new ReadableStream<number>({
      pull(controller) {
        controller.enqueue(1)
      },
      cancel,
    })

    for await (const _value of infiniteStream as unknown as AsyncIterable<number>) {
      break
    }

    expect(cancel).toHaveBeenCalled()
    expect(infiniteStream.locked).toBe(false)
  })

  test.each<[string, object, PropertyKey]>([
    ['Math.sumPrecise', Math, 'sumPrecise'],
    ['Uint8Array.fromBase64', Uint8Array, 'fromBase64'],
  ])('%sが無い環境では、polyfillは適用せずにlegacyビルドのworkerを使う', (_, target, name) => {
    remove(target, name)

    expect(applyPDFJSPolyfills()).toBe(true)
    expect((target as Methods)[name]).toBeUndefined()
  })
})
