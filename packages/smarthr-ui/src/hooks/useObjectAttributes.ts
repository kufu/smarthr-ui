import { isValidElement } from 'react'

// HINT: コンポーネントの引数が例えば <AnyTitle /> と { title:  <AnyTitle />, styleType: 'hoge' } のような場合
// Object形式かどうかを判定し常に { title, ...} のように変換するutility
export const useObjectAttributes = <T, U>(original: T, callback: (org: Exclude<T, U>) => U): U => {
  if (
    // HINT: 後続の判定で利用しているtypeofはnullの場合もobject判定されてしまうため事前に判定
    !original ||
    // HINT: objectでない場合はReactNodeでないことも確定するためObject形式に変換する
    typeof original !== 'object' ||
    // HINT: ReactNodeかどうかをチェック
    isValidElement(original)
  ) {
    return callback(original as Exclude<T, U>)
  }

  return original as U
}
