import type { ChangeEvent, ReactNode } from 'react'

type ComboboxItemBase<T> = {
  value: string
  disabled?: boolean
  data?: T
}

export type ComboboxItem<T> = ComboboxItemBase<T> &
  (
    | {
        label: string
        /**
         * 検索・アイテムの同一性判定・選択済みアイテムの表示に使う文字列。候補とMultiComboboxの選択済みチップにはlabelを表示する。
         * 省略時は `label` がそのまま使われる。
         *
         * `label` に含まれていても `labelText` に含まれない文字列は検索対象にならない。
         * アイテムの同一性は `value` とこの文字列（未指定時は `label`）で判定するため、
         * `items` と `selectedItem` / `selectedItems` を別々に生成する場合も同じ値を指定すること。
         * `SingleCombobox` では選択済みアイテムのinput表示テキストとしてもこの値が使われる。
         */
        labelText?: string
      }
    | {
        label: ReactNode
        /**
         * 検索・アイテムの同一性判定・選択済みアイテムの表示に使う文字列。
         * `label` が `ReactNode` の場合は必須。
         *
         * `label` に含まれていても `labelText` に含まれない文字列は検索対象にならない。
         * アイテムの同一性は `value` とこの文字列で判定するため、
         * `items` と `selectedItem` / `selectedItems` を別々に生成する場合も同じ値を指定すること。
         * `SingleCombobox` では選択済みアイテムのinput表示テキストとしてもこの値が使われる。
         */
        labelText: string
      }
  )

export type ComboboxOption<T> = {
  id: string
  selected: boolean
  isNew: boolean
  item: ComboboxItem<T>
}

export type BaseProps<T> = {
  /**
   * 選択可能なアイテムのリスト
   */
  items: Array<ComboboxItem<T>>
  /**
   * input 要素の `name` 属性の値
   */
  name?: string
  /**
   * input 要素の `disabled` 属性の値
   */
  disabled?: boolean
  /**
   * input 要素の `required` 属性の値
   */
  required?: boolean
  /**
   * コンポーネント内の一番外側の要素に適用するクラス名
   */
  className?: string
  /**
   * `true` のとき、コンポーネントの外枠が `DANGER` カラーになる
   */
  error?: boolean
  /**
   * `true` のとき、 `items` 内に存在しないアイテムを新しく追加できるようになる
   */
  creatable?: boolean
  /**
   * input 要素の `placeholder` 属性の値
   */
  placeholder?: string
  /**
   * `true` のとき、ドロップダウンリスト内にローダーを表示する
   */
  isLoading?: boolean
  /**
   * input 要素の `width` スタイルに適用する値
   */
  width?: number | string
  /**
   * ドロップダウンリスト内に表示するヘルプメッセージ
   */
  dropdownHelpMessage?: ReactNode
  /**
   * ドロップダウンリストの `width` スタイルに適用する値
   */
  dropdownWidth?: number | string
  /**
   * input 要素の `value` が変わった時に発火するコールバック関数
   */
  onChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void
  /**
   * `items` 内に存在しないアイテムが追加されたときに発火するコールバック関数
   */
  onAdd?: (label: string) => void
  /**
   * アイテムが選択された時に発火するコールバック関数
   */
  onSelect?: (item: ComboboxItem<T>) => void
  /**
   * input 要素の `value` が変わった時に発火するコールバック関数
   * @deprecated `onChange` は非推奨なため、 代わりに `onChangeInput` を使用してください。
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}
