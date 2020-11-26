function isWin() {
  return process.platform.startsWith('win')
}

// IE11 は画面内に要素が収まっていないと反応しないのでリサイズする
// mac など GUI 環境だと window 以上に大きくするとエラーになるので win 環境に限定する
export async function resizeWindow(t) {
  if (isWin()) await t.resizeWindow(5000, 2000)
}
