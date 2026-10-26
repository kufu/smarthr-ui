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

export type DeletableComboboxItem<T> = ComboboxItem<T> & {
  /**
   * `MultiCombobox` で削除可能かどうか。省略時は `true` 扱い
   */
  deletable?: boolean
}

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
   * input 要素の `name` 属性の値。
   * `MultiCombobox` では、選択済みアイテムの値を保持する hidden input 群の `name` として使われ、
   * 検索用テキストボックスの `name` には `${name}-query` が設定される
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
   *
   * 新規追加したアイテムは選択状態に自動では反映されないため、
   * `selectedItem` / `selectedItems` による制御（`onAdd` で `items` に追加した上で選択状態を更新する）と組み合わせて使用すること。
   * `defaultSelectedItem` / `defaultSelectedItems` のみを指定した非制御の使用方法では、新規追加したアイテムは選択されない。
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
   *
   * このコールバックは追加の通知のみを行い、選択状態の更新は行わない。
   * `items` への追加と選択状態の更新（`selectedItem` / `selectedItems` と `onChangeSelected` 等）は呼び出し側で行うこと。
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
