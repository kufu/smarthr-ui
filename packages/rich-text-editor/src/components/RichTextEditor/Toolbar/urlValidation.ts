/**
 * http / https のURLとして成立する文字列かどうかを判定する。
 *
 * prefix の文字列一致では `https://` だけの入力も通ってしまうため、URLとして
 * 解析できることまで確認する。http/https はホストを必須とするスキームで、
 * `https://` のようなホストのない値は解析の時点で例外になるので、
 * protocol の確認だけで足りる（hostname は解析が通れば常に非空）。
 */
export const isHttpUrl = (value: string): boolean => {
  // URL の解析は `https:/host` や先頭の制御文字を正規化して受け付けるが、保存されるのは入力した文字列で、
  // サニタイズが `http(s)://` で始まるかを見るため落ちる
  if (!/^https?:\/\//i.test(value)) return false

  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

/**
 * 宛先のある mailto かどうかを判定する。
 *
 * mailto はホストを持たないスキームなので `mailto:` 単体でも解析は通る。
 * 宛先は pathname に入るため、そこが空でないことまで確認する。
 * 宛先そのものの妥当性（アドレスの形）はメールクライアントの領分なので見ない。
 */
export const isMailtoUrl = (value: string): boolean => {
  if (!/^mailto:/i.test(value)) return false

  try {
    const url = new URL(value)

    return url.protocol === 'mailto:' && url.pathname !== ''
  } catch {
    return false
  }
}

export const isLinkUrl = (value: string): boolean => isHttpUrl(value) || isMailtoUrl(value)
