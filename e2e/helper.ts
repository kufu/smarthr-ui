function isWin() {
  return process.platform.startsWith('win')
}

// In IE11, if the element does not fit in the screen, it will not react, so resize it.
// In a GUI environment such as mac, if the screen is enlarged beyond the window, an error will occur, so limit it to the Windows environment.
// cf. https://tech.medpeer.co.jp/entry/e2e-ie11
export async function resizeWindow(t) {
  if (isWin()) await t.resizeWindow(5000, 2000)
}
