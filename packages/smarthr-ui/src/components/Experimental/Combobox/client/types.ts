import type { ComboboxItem as BaseComboboxItem } from '../../../Combobox'
import type { ReactNode } from 'react'

export type ComboboxItem<T> = BaseComboboxItem<T> & {
  /**
   * 選択肢の label の下に小さく表示する補足（社員番号や部署など）。
   * 検索の対象にも、選択済みの表示にも使わない
   */
  description?: ReactNode
}
