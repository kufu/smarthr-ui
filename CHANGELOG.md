# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [16.0.2](https://github.com/kufu/smarthr-ui/compare/v16.0.1...v16.0.2) (2021-12-13)


### Bug Fixes

* `Input`のwidthをデフォルト値より小さく設定すると表示が崩れる不具合の修正 ([#2102](https://github.com/kufu/smarthr-ui/issues/2102)) ([d57c02b](https://github.com/kufu/smarthr-ui/commit/d57c02bd83a9f9997ad0a02fe62c170ef3921376))
* change not to show external link icon when suffix is null ([#2098](https://github.com/kufu/smarthr-ui/issues/2098)) ([36f4ce9](https://github.com/kufu/smarthr-ui/commit/36f4ce99bb0f3646d847436fc02585e05aef8379))
* LineClamp と Tooltip の baseline ズレを修正 ([#2101](https://github.com/kufu/smarthr-ui/issues/2101)) ([27ab76f](https://github.com/kufu/smarthr-ui/commit/27ab76fcf1179ebb9148019132d48b7341e169f8))
* SideNav のフォーカスインジケーターを新しい装飾に置き換える ([#2104](https://github.com/kufu/smarthr-ui/issues/2104)) ([b9f85ee](https://github.com/kufu/smarthr-ui/commit/b9f85ee76319410215abcdef3eb11a4a33881a22))
* TextLink のアイコン縦位置を正す ([#2100](https://github.com/kufu/smarthr-ui/issues/2100)) ([f8791b2](https://github.com/kufu/smarthr-ui/commit/f8791b26868b6c97437c4b8ae645d82340b88412))

### [16.0.1](https://github.com/kufu/smarthr-ui/compare/v16.0.0...v16.0.1) (2021-12-06)


### Bug Fixes

* change not to focus trigger when `ModelessDialog` is closed ([#2083](https://github.com/kufu/smarthr-ui/issues/2083)) ([2838bda](https://github.com/kufu/smarthr-ui/commit/2838bda1be7d3d8dfefdec6317b77f6653f87c30))
* change to pass ElementProps to Wrapper of `FlashMessage` ([#2095](https://github.com/kufu/smarthr-ui/issues/2095)) ([7711350](https://github.com/kufu/smarthr-ui/commit/77113506d1224ea3e07793a313d821e573e42a71))
* fontSize.S の影響で Button[size=s] の縦揃えに影響していたので修正 ([#2058](https://github.com/kufu/smarthr-ui/issues/2058)) ([33912ee](https://github.com/kufu/smarthr-ui/commit/33912eefcb32cbe7b36f58003367c0c0aecd5965))

## [16.0.0](https://github.com/kufu/smarthr-ui/compare/v15.3.0...v16.0.0) (2021-11-29)


### ⚠ BREAKING CHANGES

* サポートする node バージョンを更新 (#2022)

### Bug Fixes

* adjust LineClamp height in safari ([#2074](https://github.com/kufu/smarthr-ui/issues/2074)) ([515b691](https://github.com/kufu/smarthr-ui/commit/515b691452c6ccc11b7242fd6d0b54b81d01455a))
* fix to re-calcurate position of listbox on `MultiComboBox` ([#2075](https://github.com/kufu/smarthr-ui/issues/2075)) ([5aec65c](https://github.com/kufu/smarthr-ui/commit/5aec65c3be8fc2daba3916e246863c829cc23456))


* サポートする node バージョンを更新 ([#2022](https://github.com/kufu/smarthr-ui/issues/2022)) ([0d052f6](https://github.com/kufu/smarthr-ui/commit/0d052f65b14a5693e07de82d1dab61eb55c3cfe8))

## [15.3.0](https://github.com/kufu/smarthr-ui/compare/v15.2.2...v15.3.0) (2021-11-22)


### Features

* `Tooltip` に自動位置決め機能を追加し、`LineClamp` のツールチップが見切れないようにする (SHRUI-483) ([#2035](https://github.com/kufu/smarthr-ui/issues/2035)) ([8652e9c](https://github.com/kufu/smarthr-ui/commit/8652e9cc6e91cee3118336272e226f9e71094dfb))


### Bug Fixes

* `Calendar` がブラウザのフォントサイズによってスタイル崩れを起こさないように修正 (SHRUI-466) ([#2040](https://github.com/kufu/smarthr-ui/issues/2040)) ([ba5fcf1](https://github.com/kufu/smarthr-ui/commit/ba5fcf12d3d12aabcbb438708de4e56b10b4193b))
* `InputFile` が IE でクラッシュしないように修正 ([#2056](https://github.com/kufu/smarthr-ui/issues/2056)) ([6314229](https://github.com/kufu/smarthr-ui/commit/6314229de3541d32a30d03bb2aab6ec0e7e2372c))
* fix typos ([#2043](https://github.com/kufu/smarthr-ui/issues/2043)) ([49788ca](https://github.com/kufu/smarthr-ui/commit/49788caa4e29582ca47e1bdb035a22685a698db8))
* inputFileコンポーネントでコンポーネント内部のinput要素のvalueが変化しないのを修正します ([#2025](https://github.com/kufu/smarthr-ui/issues/2025)) ([0ac322d](https://github.com/kufu/smarthr-ui/commit/0ac322d812610a6471c268589a41f74954daddd4))
* reset margin of button on SegmentedControl ([#2060](https://github.com/kufu/smarthr-ui/issues/2060)) ([9054c71](https://github.com/kufu/smarthr-ui/commit/9054c710970d3fe632b94f220711e43bc5b0bb5a))
* Sidebar を export ([#2038](https://github.com/kufu/smarthr-ui/issues/2038)) ([30405cb](https://github.com/kufu/smarthr-ui/commit/30405cb3e9d96c8432089c4fd6e1463ff34e7141))

### [15.2.2](https://github.com/kufu/smarthr-ui/compare/v15.2.1...v15.2.2) (2021-11-08)


### Bug Fixes

* InputFileでキーボード操作でファイル選択ダイアログを表示できないのを修正します SHRUI-484 ([#2024](https://github.com/kufu/smarthr-ui/issues/2024)) ([d0b2e08](https://github.com/kufu/smarthr-ui/commit/d0b2e083a4ea93d4f403d850b0540d16c443560e))
* MessageScreen のリンクに下線を引く｜SHRUI-368 ([#2026](https://github.com/kufu/smarthr-ui/issues/2026)) ([bd1bdf8](https://github.com/kufu/smarthr-ui/commit/bd1bdf89d603491da4744152e2cc998e4f2f40b5))

### [15.2.1](https://github.com/kufu/smarthr-ui/compare/v15.2.0...v15.2.1) (2021-11-01)


### Bug Fixes

* can not select search item ([#2008](https://github.com/kufu/smarthr-ui/issues/2008)) ([d820cc9](https://github.com/kufu/smarthr-ui/commit/d820cc9192e85fd6a2cf2aa3360eeeacb722fdf4))
* fix to activate selected item on SingleComboBox ([#2018](https://github.com/kufu/smarthr-ui/issues/2018)) ([3e82a21](https://github.com/kufu/smarthr-ui/commit/3e82a212b5e9e5012f6858d4db13ef8741fd27d6))

## [15.2.0](https://github.com/kufu/smarthr-ui/compare/v15.1.0...v15.2.0) (2021-10-26)


### Features

* AppNavi にドロップダウン示唆プロパティを追加 ([#1969](https://github.com/kufu/smarthr-ui/issues/1969)) ([eaaf5f7](https://github.com/kufu/smarthr-ui/commit/eaaf5f73d020e642cb8ff38dce68fb67c80d6265))
* ComboBox・DatePicker・Selectのキャレットの色を変更・統一 ([#1975](https://github.com/kufu/smarthr-ui/issues/1975)) ([fbfe05c](https://github.com/kufu/smarthr-ui/commit/fbfe05c1824ed529145c19f515cfbae51599d51f))
* comboboxのautoComplete属性をoffに変更 ([#1974](https://github.com/kufu/smarthr-ui/issues/1974)) ([c8e3228](https://github.com/kufu/smarthr-ui/commit/c8e3228b9ea8988e10006b0c38f4a328e32d36c2))
* comboboxのautoComplete属性をoffに変更 ([#1974](https://github.com/kufu/smarthr-ui/issues/1974)) ([1d5efdd](https://github.com/kufu/smarthr-ui/commit/1d5efdded8a188761585b1d13a92ba0816828984))


### Bug Fixes

* `CheckBox` 内のアイコンサイズがブラウザのフォントサイズ設定に追従するように変更 ([#1965](https://github.com/kufu/smarthr-ui/issues/1965)) ([2a9b09b](https://github.com/kufu/smarthr-ui/commit/2a9b09b288274ac822c80f9efcdd73a11775fd2b))
* add value, role, name to `<ModelessDialog>` handle ([#1967](https://github.com/kufu/smarthr-ui/issues/1967)) ([342aef9](https://github.com/kufu/smarthr-ui/commit/342aef9eab52f1ad792d8fd95305738492069464))
* change `FormGroup` to be able to indicate that is a group ([#1968](https://github.com/kufu/smarthr-ui/issues/1968)) ([7f1ec03](https://github.com/kufu/smarthr-ui/commit/7f1ec03689a51f63ecba6052907dc62a779ea2e3))
* change header height of `ModelessDialog` not to expand by padding ([#1963](https://github.com/kufu/smarthr-ui/issues/1963)) ([748b31f](https://github.com/kufu/smarthr-ui/commit/748b31f7c767aafa1a8e8114d04090a89012246d))
* change not to set icon size in `AppNavi` ([#1964](https://github.com/kufu/smarthr-ui/issues/1964)) ([4242aee](https://github.com/kufu/smarthr-ui/commit/4242aeed53d77091deae250f0e07a13d1d46d27e))
* FlashMessage のアイコン縦位置のズレを直しました ([#1966](https://github.com/kufu/smarthr-ui/issues/1966)) ([ca14c52](https://github.com/kufu/smarthr-ui/commit/ca14c5274299a96ebd399cd41c893562106b5e06))

## [15.1.0](https://github.com/kufu/smarthr-ui/compare/v15.0.1...v15.1.0) (2021-10-11)


### Features

* `MultiComboBox` のテキストボックスを制御できるようにするオプションを追加 (SHRUI-458) ([#1929](https://github.com/kufu/smarthr-ui/issues/1929)) ([12e2af3](https://github.com/kufu/smarthr-ui/commit/12e2af3137586d3423312ed23b1c9af31829a15f))
* TextLink の折返しに対応し、Affix にも下線を引く｜SHRUI-481 ([#1943](https://github.com/kufu/smarthr-ui/issues/1943)) ([63e216b](https://github.com/kufu/smarthr-ui/commit/63e216b26661ca8f4887d4c948abab4065d08666))


### Bug Fixes

* change position of radio button with multi line label to top ([#1945](https://github.com/kufu/smarthr-ui/issues/1945)) ([4bbe3c3](https://github.com/kufu/smarthr-ui/commit/4bbe3c3edbd0bb2973b9301c300e3310770b1b22))
* コンボボックスのドロップダウンが画面からはみ出さないようにする (SHRUI-478) ([#1930](https://github.com/kufu/smarthr-ui/issues/1930)) ([229ae02](https://github.com/kufu/smarthr-ui/commit/229ae020d8f359bf8fd4aaf6213ba7274cf43a57))
* 不要なアイコンサイズを削除 ([#1941](https://github.com/kufu/smarthr-ui/issues/1941)) ([12e06d5](https://github.com/kufu/smarthr-ui/commit/12e06d5816fc5132e54fc588169d87c33e4a375f))

### [15.0.1](https://github.com/kufu/smarthr-ui/compare/v15.0.0...v15.0.1) (2021-10-04)


### Bug Fixes

* fix flex shorthand for IE ([#1932](https://github.com/kufu/smarthr-ui/issues/1932)) ([4e14559](https://github.com/kufu/smarthr-ui/commit/4e1455942dd01dec91e7a975f07af918a552232e))
* SegmentedControl の border が消えているので修正 ([#1920](https://github.com/kufu/smarthr-ui/issues/1920)) ([8d63135](https://github.com/kufu/smarthr-ui/commit/8d63135b35e38a54536be8a59029abc796c30efa))

## [15.0.0](https://github.com/kufu/smarthr-ui/compare/v14.4.0...v15.0.0) (2021-09-28)


### ⚠ BREAKING CHANGES

* Button / Input / Selectの高さの計算を変更しました。Buttonの高さが固定でなくなり、フォントサイズやフレックスコンテナーの `align` の値など外部に依存します。

### Features

* Button の width / height の固定値をやめる｜SHRUI-427  ([#1908](https://github.com/kufu/smarthr-ui/issues/1908)) ([d4784da](https://github.com/kufu/smarthr-ui/commit/d4784da4ad7e744178a8f0da08d69f0e4e4c9abb))
* export useTheme hook ([#1893](https://github.com/kufu/smarthr-ui/issues/1893)) ([dac62fd](https://github.com/kufu/smarthr-ui/commit/dac62fde2a10a51f44037bd2a2956350a2bb00e4))
* Input のスタイリングを見直す｜SHRUI-460 ([#1909](https://github.com/kufu/smarthr-ui/issues/1909)) ([6351125](https://github.com/kufu/smarthr-ui/commit/635112525495d32f4aa2366168bbd261f4d8d444))
* Select のスタイリングを見直す ([#1919](https://github.com/kufu/smarthr-ui/issues/1919)) ([49b32d4](https://github.com/kufu/smarthr-ui/commit/49b32d44814783fc3fc0bb6670e8ea2ee1d1328c))
* 各種 Dialog を body 直下以外からも生成できるようにする｜SHRUI-474 ([#1891](https://github.com/kufu/smarthr-ui/issues/1891)) ([fa8eab8](https://github.com/kufu/smarthr-ui/commit/fa8eab8ab71e353cfc893d1e6c3322399854ae46))
* `<Sidebar>` Component を追加  ([#1888](https://github.com/kufu/smarthr-ui/issues/1888))

### Bug Fixes

* Dialogのsubtitle未指定の場合のaria-labelを調整する ([#1921](https://github.com/kufu/smarthr-ui/issues/1921)) ([d8e96ef](https://github.com/kufu/smarthr-ui/commit/d8e96ef221c5741d038ec990c212cb36d4b5fb75))
* display all items when refocus SingleCombobox ([#1922](https://github.com/kufu/smarthr-ui/issues/1922)) ([ad93e3e](https://github.com/kufu/smarthr-ui/commit/ad93e3e382bc78ae5ae84a5dbfb100462d910ceb))
* SingleCombobox の削除ボタンが Input の suffix を使っていたため、縦位置がずれていたので修正 ([#1923](https://github.com/kufu/smarthr-ui/issues/1923)) ([03026f6](https://github.com/kufu/smarthr-ui/commit/03026f617e58af126f04f9233aad8a9f8ac1612c))
* TextColors に TEXT_WHITE を追加し忘れていた ([#1886](https://github.com/kufu/smarthr-ui/issues/1886)) ([09d437d](https://github.com/kufu/smarthr-ui/commit/09d437db45bccd376806c4667432d3565667c3fb))
* ダイアログがアニメーション中に低いスタッキングコンテキストにならないように修正 ([#1887](https://github.com/kufu/smarthr-ui/issues/1887)) ([0e53afe](https://github.com/kufu/smarthr-ui/commit/0e53afea2934fcd2c0aa82a6435ca4a11cddc0e6))

## [14.4.0](https://github.com/kufu/smarthr-ui/compare/v14.3.0...v14.4.0) (2021-09-14)


### Features

* `MultiComboBox` に選択済みアイテムを省略表示できるオプションを追加 (SHRUI-450) ([#1860](https://github.com/kufu/smarthr-ui/issues/1860)) ([8178a53](https://github.com/kufu/smarthr-ui/commit/8178a53184f3d6f56c1096b5c6dd586caedcecda))
* add row column gap Cluster ([#1836](https://github.com/kufu/smarthr-ui/issues/1836)) ([c59b6ec](https://github.com/kufu/smarthr-ui/commit/c59b6ec4cb5f9c7e6d85e4066e33409c8b234fe0))
* color に WHITE を追加 ([#1864](https://github.com/kufu/smarthr-ui/issues/1864)) ([694ee8d](https://github.com/kufu/smarthr-ui/commit/694ee8d594c624224f5756dd0a08007abbc09629))

## [14.3.0](https://github.com/kufu/smarthr-ui/compare/v14.2.0...v14.3.0) (2021-09-06)


### Features

* `Icon` の color に抽象トークンを渡せるようにする (SHRUI-446) ([#1855](https://github.com/kufu/smarthr-ui/issues/1855)) ([df38807](https://github.com/kufu/smarthr-ui/commit/df38807203628256911deef5e4a0df195c38ceb9))
* `ModelessDialog` を追加 (SHRUI-454) ([#1786](https://github.com/kufu/smarthr-ui/issues/1786)) ([173e380](https://github.com/kufu/smarthr-ui/commit/173e380a42d7bffcc59550379605331a881bb102))
* コンボボックスに `onChangeSelected` を追加 (SHRUI-436) ([#1777](https://github.com/kufu/smarthr-ui/issues/1777)) ([54198fe](https://github.com/kufu/smarthr-ui/commit/54198fe2d885c5e3dc1a10aa3677835eca1c55c8))
* 余白トークンに 0 を追加 ([#1841](https://github.com/kufu/smarthr-ui/issues/1841)) ([5976a82](https://github.com/kufu/smarthr-ui/commit/5976a82da65f6cc10a715b7e6126c2af8acc016d))


### Bug Fixes

* change labeling structure and add htmlFor props ([#1778](https://github.com/kufu/smarthr-ui/issues/1778)) ([6511898](https://github.com/kufu/smarthr-ui/commit/6511898c7ed3167697faf5ae07c427a4d29c05c1))
* defaultLeading がエクスポートされていなかった ([#1842](https://github.com/kufu/smarthr-ui/issues/1842)) ([158e5b0](https://github.com/kufu/smarthr-ui/commit/158e5b06eff7e51cfb3f720e15f4e3d4024a8d8c))
* OVERLAP の重なり順序の改善 (SHRUI-445) ([#1837](https://github.com/kufu/smarthr-ui/issues/1837)) ([7970eb0](https://github.com/kufu/smarthr-ui/commit/7970eb02a41570de5b1fb91f8371e57fe58e14f6))

## [14.2.0](https://github.com/kufu/smarthr-ui/compare/v14.1.0...v14.2.0) (2021-09-01)


### Features

* FloatArea に HTML 属性と className を足す ([#1827](https://github.com/kufu/smarthr-ui/issues/1827)) ([b762212](https://github.com/kufu/smarthr-ui/commit/b7622121b8aaf875af9e4286ff307e2498f5d07b))


### Bug Fixes

* change selected item of listbox of `SingleComboBox` not to cut off ([#1826](https://github.com/kufu/smarthr-ui/issues/1826)) ([483b153](https://github.com/kufu/smarthr-ui/commit/483b153544d79c0e7efde81184973146c00e2bba))
* FloatArea エラーメッセージの余分な余白を取り除く ([#1820](https://github.com/kufu/smarthr-ui/issues/1820)) ([4ea4356](https://github.com/kufu/smarthr-ui/commit/4ea435644cc6bd0329147279d898624c410beceb))
* ツールチップ、バルーンのダークモードを非推奨にする (SHRUI-444) ([#1825](https://github.com/kufu/smarthr-ui/issues/1825)) ([cbabedd](https://github.com/kufu/smarthr-ui/commit/cbabedd39547dede86334fd6e47903904be10bf7))

## [14.1.0](https://github.com/kufu/smarthr-ui/compare/v14.0.1...v14.1.0) (2021-08-23)


### Features

* ActionDialog と MessageDialog に副題を追加 ([#1812](https://github.com/kufu/smarthr-ui/issues/1812)) ([e2a6344](https://github.com/kufu/smarthr-ui/commit/e2a6344e9af1733064d0cfbf122a2f4dd776af34))


### Bug Fixes

* Calendar の年選択ボタンのイベント伝播を阻止する ([#1803](https://github.com/kufu/smarthr-ui/issues/1803)) ([bcf378d](https://github.com/kufu/smarthr-ui/commit/bcf378d8064e7b64731ad13e03080df81c541570))

## [14.0.1](https://github.com/kufu/smarthr-ui/compare/v14.0.0...v14.0.1) (2021-08-16)


### Bug Fixes

- TextLink に prefix/suffix を含まない場合はレイアウトコンポーネントを使わない (#1766) (4e05ff4e9251db9cee287b2955032c1b1aaa280e)
- FloatArea で p > div になっていたので修正 (#1788) (992f9cab2440bf397490b4ba87d74d571a37a0ae)

## [14.0.0](https://github.com/kufu/smarthr-ui/compare/v13.3.0...v14.0.0) (2021-08-02)


### ⚠ BREAKING CHANGES

* 利用されていなかった `Header` コンポーネントを削除しました。
* `RightFixedNote` において `title`
が必須プロパティになります。
* 旧 `CheckBox` および `CheckBoxLabel`
を削除しました。新しい `CheckBox` を使用してください。
* 旧 `RadioButton` および `RadioButtonLabel`
を削除しました。新しい `RadioButton` を使用してください。
* `SingleComboBox` の `onSelect`
が選択クリア時に発火しなくなります。選択クリアのハンドリングは `onClear`
で行ってください。

### Features

* add onClear handler ([#1747](https://github.com/kufu/smarthr-ui/issues/1747)) ([cc0fd58](https://github.com/kufu/smarthr-ui/commit/cc0fd580569a24067ef99e04c32bd3211ffb319e))
* make title required, and display textarea label ([#1744](https://github.com/kufu/smarthr-ui/issues/1744)) ([e14c01d](https://github.com/kufu/smarthr-ui/commit/e14c01dab4305a814fb8e472893e16d0bf76e8bc))
* remove unused <Header> ([#1761](https://github.com/kufu/smarthr-ui/issues/1761)) ([5a67dc5](https://github.com/kufu/smarthr-ui/commit/5a67dc5f6834911cf7a9968ecb3dfc77df4de9f4))


### Bug Fixes

* CheckBox コンポーネントのリネームと整理 (SHRUI-419) ([#1748](https://github.com/kufu/smarthr-ui/issues/1748)) ([4ed6875](https://github.com/kufu/smarthr-ui/commit/4ed68752b13eafbf156472f9f022bb99a81044c9))
* RadioButton コンポーネントのリネームと整理 (SHRUI-419) ([#1754](https://github.com/kufu/smarthr-ui/issues/1754)) ([d6c0fa5](https://github.com/kufu/smarthr-ui/commit/d6c0fa587e0ec9dd5dab0256e9f4be1be134730d))

## [13.3.0](https://github.com/kufu/smarthr-ui/compare/v13.2.0...v13.3.0) (2021-07-20)


### Features

* add option for fixedhead ([#1672](https://github.com/kufu/smarthr-ui/issues/1672)) ([21f5c86](https://github.com/kufu/smarthr-ui/commit/21f5c864ff9cd837a32a85e880df2b19d88862db))
* DropDown コンポーネントの属性の改善 SHRUI-262 ([#1670](https://github.com/kufu/smarthr-ui/issues/1670)) ([e7813d7](https://github.com/kufu/smarthr-ui/commit/e7813d75ff9e978595724e0fcc1c7aad51f0615b))
* Stack に align を追加 ([#1753](https://github.com/kufu/smarthr-ui/issues/1753)) ([5d00d6b](https://github.com/kufu/smarthr-ui/commit/5d00d6b4f7349154aaeeee93b10f16a84076935b))

## [13.2.0](https://github.com/kufu/smarthr-ui/compare/v13.1.0...v13.2.0) (2021-07-13)


### Features

* Stack をインライン要素のように振る舞えるように inline を追加 ([#1729](https://github.com/kufu/smarthr-ui/issues/1729)) ([95413d4](https://github.com/kufu/smarthr-ui/commit/95413d4a026b548c30276028870690746912d365))
* 影のテーマの追加と置き換え (SHRUI-417) ([#1699](https://github.com/kufu/smarthr-ui/issues/1699)) ([8737ad1](https://github.com/kufu/smarthr-ui/commit/8737ad15702b7586f6513955b42f03b0abf2e303))


### Bug Fixes

* `AccordionPanel` のフォーカスインジケータが隠れないように修正 (SHRUI-412) ([#1698](https://github.com/kufu/smarthr-ui/issues/1698)) ([f82fe2c](https://github.com/kufu/smarthr-ui/commit/f82fe2cb8a0c2362f79af8b9f12fd16c281ebadd))
* `ActionDialog` の warning 解消 ([#1713](https://github.com/kufu/smarthr-ui/issues/1713)) ([c077991](https://github.com/kufu/smarthr-ui/commit/c077991335b900627913bcbe062d7389d16b661c))
* Baloon に span を渡せるように修正 ([#1723](https://github.com/kufu/smarthr-ui/issues/1723)) ([54f1240](https://github.com/kufu/smarthr-ui/commit/54f124019be960e636dc4c3c2dd4f7d4240ea59c))
* change default color of affix of `Input` ([#1726](https://github.com/kufu/smarthr-ui/issues/1726)) ([2099eaa](https://github.com/kufu/smarthr-ui/commit/2099eaac870db0dcf63dabcf24b112bf889dde29))
* fix focus indicator not to be hidden by sibling elements ([#1725](https://github.com/kufu/smarthr-ui/issues/1725)) ([dfc08de](https://github.com/kufu/smarthr-ui/commit/dfc08de31843f97bffe008ac00b25c97f7a2bf53))
* rename onChange to onChangeInput ([#1727](https://github.com/kufu/smarthr-ui/issues/1727)) ([0ebcc40](https://github.com/kufu/smarthr-ui/commit/0ebcc403eeee793dfa343f5cbd9587aa8059b865))
* Tooltip の tabIndex を利用側で上書きできないので修正 ([#1709](https://github.com/kufu/smarthr-ui/issues/1709)) ([6cf8f01](https://github.com/kufu/smarthr-ui/commit/6cf8f017b2d3d8e8ba31eef4b21c54026e8fb9dc))
* コンボボックスのフォーカス挙動を変更 (SHRUI-423) ([#1724](https://github.com/kufu/smarthr-ui/issues/1724)) ([b682a36](https://github.com/kufu/smarthr-ui/commit/b682a364b03c870c9dab1845e46887816fba32b0))

## [13.1.0](https://github.com/kufu/smarthr-ui/compare/v13.0.0...v13.1.0) (2021-06-29)


### Features

* `CompactInformationPanel` の属性の改善 (SHRUI-435) ([#1676](https://github.com/kufu/smarthr-ui/issues/1676)) ([b501e4f](https://github.com/kufu/smarthr-ui/commit/b501e4f43b4f0343badd8a593cb7daec2d599124))
* `Input` の属性の改善 (SHRUI-273) ([#1658](https://github.com/kufu/smarthr-ui/issues/1658)) ([9672209](https://github.com/kufu/smarthr-ui/commit/9672209c3a5c800dc23c03c3c9a9d1bb4b366d6b))
* `Pagination` の属性の改善 (SHRUI-278) ([#1673](https://github.com/kufu/smarthr-ui/issues/1673)) ([94f09a7](https://github.com/kufu/smarthr-ui/commit/94f09a7a13be6e90931fbbb882a8593d8529f577))
* `RightFixedNote` の属性の改善 (SHRUI-282) ([#1677](https://github.com/kufu/smarthr-ui/issues/1677)) ([b09193f](https://github.com/kufu/smarthr-ui/commit/b09193f5860d75f130d29e84631ecf95c44c01c4))
* `SegmentedControl` の属性の改善 (SHRUI-283) ([#1678](https://github.com/kufu/smarthr-ui/issues/1678)) ([6371479](https://github.com/kufu/smarthr-ui/commit/6371479fb85ffc57068916f18a1e37cfec2b2144))
* `SmartHRLogo` の属性の改善 (SHRUI-285) ([#1680](https://github.com/kufu/smarthr-ui/issues/1680)) ([8efa186](https://github.com/kufu/smarthr-ui/commit/8efa18614b40736fd687d42af10ae9edd101681a))
* `StatusLabel` の属性の改善 (SHRUI-286) ([#1682](https://github.com/kufu/smarthr-ui/issues/1682)) ([81238f2](https://github.com/kufu/smarthr-ui/commit/81238f2b69e03684603d5f580bbba9d47f385d4d))
* `TabBar` の属性の改善 (SHRUI-287) ([#1683](https://github.com/kufu/smarthr-ui/issues/1683)) ([e273575](https://github.com/kufu/smarthr-ui/commit/e2735755d556b9fdedad44e68b10d2c0dfec9e0f))
* `Textarea` の属性の改善 ([#1686](https://github.com/kufu/smarthr-ui/issues/1686)) ([426b9e9](https://github.com/kufu/smarthr-ui/commit/426b9e9fab1e7164af2d9b086463e42f88ab3b27))
* `Tooltip` の属性の改善 (SHRUI-290) ([#1687](https://github.com/kufu/smarthr-ui/issues/1687)) ([65ba763](https://github.com/kufu/smarthr-ui/commit/65ba76397b29b4889ac00fb5f319e445a400dbdf))
* add default class name ([#1679](https://github.com/kufu/smarthr-ui/issues/1679)) ([394a077](https://github.com/kufu/smarthr-ui/commit/394a0775363820bd71ef0a2d2288281be1e34eb0))
* ComboBox の属性の改善 (SHRUI-277) ([#1662](https://github.com/kufu/smarthr-ui/issues/1662)) ([c93aa18](https://github.com/kufu/smarthr-ui/commit/c93aa18649473ecc8a701242018cfcf4f522ce88))
* Table の属性の改善 (SHRUI-288) ([#1684](https://github.com/kufu/smarthr-ui/issues/1684)) ([ef4995f](https://github.com/kufu/smarthr-ui/commit/ef4995f3c4b0aa93663fcb78d0ed0022ee69903b))
* Text コンポーネントに whiteSpace を追加 ([#1704](https://github.com/kufu/smarthr-ui/issues/1704)) ([9b95ae7](https://github.com/kufu/smarthr-ui/commit/9b95ae73a396d7981d8a6399754d64b3a494371a))


### Bug Fixes

* Cluster のインポートを追加 ([#1685](https://github.com/kufu/smarthr-ui/issues/1685)) ([379ea1c](https://github.com/kufu/smarthr-ui/commit/379ea1ca9fedeaeb6ea96628aac2f98efa6d6d9e))
* DialogContentInner の className が Wrraper にあたっていたのを Inner に戻す ([#1695](https://github.com/kufu/smarthr-ui/issues/1695)) ([9fd9791](https://github.com/kufu/smarthr-ui/commit/9fd97910bfb85aac6885663eb28b82c9a21928f9))
* MultiComboBox の削除アイコンの visuallyHiddenText をアイテムごとに分ける ([#1694](https://github.com/kufu/smarthr-ui/issues/1694)) ([c0acf2a](https://github.com/kufu/smarthr-ui/commit/c0acf2a0ec77adb3ed76b717c5454fb4899d46ce))
* Text を styled-component で wrap できなかったので修正｜ SHRUI-439 ([#1696](https://github.com/kufu/smarthr-ui/issues/1696)) ([c0e79f5](https://github.com/kufu/smarthr-ui/commit/c0e79f5d3e4064c4970840f9f3363ad4fe8594aa))

## [13.0.0](https://github.com/kufu/smarthr-ui/compare/v12.4.0...v13.0.0) (2021-06-15)


### ⚠ BREAKING CHANGES

* remove Icon component that uses name prop
* modify not to use old Icon component
* replace title tag from span to h3 in InformationPanel
* drop node v10 support

### Features

* `BlankImage` の属性の改善 (SHRUI-270) ([#1653](https://github.com/kufu/smarthr-ui/issues/1653)) ([d42ee33](https://github.com/kufu/smarthr-ui/commit/d42ee33543a1ebea9d42c7538bfc27213c6ce8d4))
* `Header` のclass名及び属性の改善 (SHRUI-266) ([#1639](https://github.com/kufu/smarthr-ui/issues/1639)) ([0d97bf2](https://github.com/kufu/smarthr-ui/commit/0d97bf25de74f88289703fb67f9692e5b2bd33c9))
* `Heading` の class 名と属性の改善 (SHRUI-267) ([#1640](https://github.com/kufu/smarthr-ui/issues/1640)) ([703e93a](https://github.com/kufu/smarthr-ui/commit/703e93abc2049f928ac932520fb8e821c86d59c1))
* `HeadlineArea` の class 名と属性の改善 (SHRUI-268) ([#1641](https://github.com/kufu/smarthr-ui/issues/1641)) ([b7ddfa9](https://github.com/kufu/smarthr-ui/commit/b7ddfa959f712d891777953a41abead0eaf74df5))
* `Icon` にデフォルトクラスを追加 (SHRUI-269) ([#1651](https://github.com/kufu/smarthr-ui/issues/1651)) ([925790a](https://github.com/kufu/smarthr-ui/commit/925790a11ac7b1b5095971de7d800e3daea12e03))
* `IndexNav` の属性の改善 (SHRUI-271) ([#1654](https://github.com/kufu/smarthr-ui/issues/1654)) ([8114893](https://github.com/kufu/smarthr-ui/commit/8114893cdd926ccce8c9f1533cd61b8d321ab674))
* `InformationPanel` の属性の改善 (SHRUI-272) ([#1655](https://github.com/kufu/smarthr-ui/issues/1655)) ([6dfb7fc](https://github.com/kufu/smarthr-ui/commit/6dfb7fc60b99415a0b81faa4ad4ad4d12feeb95f))
* `MessageScreen` の属性の改善 (SHRUI-276) ([#1660](https://github.com/kufu/smarthr-ui/issues/1660)) ([d484ade](https://github.com/kufu/smarthr-ui/commit/d484ade3d11d7b38d4bc82a8570cfe05023d4c6e))
* add CheckBoxNew component ([#1604](https://github.com/kufu/smarthr-ui/issues/1604)) ([691cb2f](https://github.com/kufu/smarthr-ui/commit/691cb2fc99ec3247fa69b197d2d01a55989a2d98))
* add data props to be able to register data about each item in ComboBox (SHRUI-415) ([#1586](https://github.com/kufu/smarthr-ui/issues/1586)) ([2feec6e](https://github.com/kufu/smarthr-ui/commit/2feec6e0754c4001b4f165313ac2487327c246c5))
* add default class ([#1659](https://github.com/kufu/smarthr-ui/issues/1659)) ([0809cbb](https://github.com/kufu/smarthr-ui/commit/0809cbb4e14ea196ad7736b5511ba46915f78e9c))
* add default class name of parts ([#1632](https://github.com/kufu/smarthr-ui/issues/1632)) ([4fc5c26](https://github.com/kufu/smarthr-ui/commit/4fc5c26490065b73d2774ad301019d366d706699))
* add FlashMessageList ([#1583](https://github.com/kufu/smarthr-ui/issues/1583)) ([a26adfc](https://github.com/kufu/smarthr-ui/commit/a26adfced5bd9a3dde64ccb3b2fe90b1720d89b5))
* add loading state into ComboBox (SHRUI-375) ([#1551](https://github.com/kufu/smarthr-ui/issues/1551)) ([4f5e0b4](https://github.com/kufu/smarthr-ui/commit/4f5e0b4fd91a8cc54547de188d0b23e294e37b00))
* add RadioButtonNew component ([#1592](https://github.com/kufu/smarthr-ui/issues/1592)) ([3174af2](https://github.com/kufu/smarthr-ui/commit/3174af217ae083bfac3a2597e2a90b8b3bbb371a))
* deprecate CheckBox and CheckBoxLabel ([#1605](https://github.com/kufu/smarthr-ui/issues/1605)) ([7ca470b](https://github.com/kufu/smarthr-ui/commit/7ca470b4463556c8d7f88d52fa56eb4879c59717))
* deprecate FieldSet component ([#1631](https://github.com/kufu/smarthr-ui/issues/1631)) ([ee77143](https://github.com/kufu/smarthr-ui/commit/ee77143a3057d1c98bdfeff77075c4f958d76698))
* deprecate RadioButton and RadioButtonLabel ([#1606](https://github.com/kufu/smarthr-ui/issues/1606)) ([aa01e28](https://github.com/kufu/smarthr-ui/commit/aa01e282ed0044ce744e023eb281a4b29beb5900))
* enable to be able to make anchor button disabled (SHRUI-363) ([#1522](https://github.com/kufu/smarthr-ui/issues/1522)) ([fa91170](https://github.com/kufu/smarthr-ui/commit/fa911701eb5267f1f48bd0e4ea26ad2a50b78791))
* fix border color to SegmentedControl ([#1617](https://github.com/kufu/smarthr-ui/issues/1617)) ([499b800](https://github.com/kufu/smarthr-ui/commit/499b8008f01fe4abd852cf73654a9f3ee80ef1a5))
* fix input prefix/suffix icons color in storybook ([#1635](https://github.com/kufu/smarthr-ui/issues/1635)) ([acedb47](https://github.com/kufu/smarthr-ui/commit/acedb476b9090b50914e1f018c6bc755a945af10))
* implement FormGroup component ([#1297](https://github.com/kufu/smarthr-ui/issues/1297)) ([2e44c34](https://github.com/kufu/smarthr-ui/commit/2e44c34497e94cfab2cba5cb4bd8e725da805b48))
* improve attributes for Calendar ([#1474](https://github.com/kufu/smarthr-ui/issues/1474)) ([08e4efa](https://github.com/kufu/smarthr-ui/commit/08e4efa2373e8425c2b9ea4c99f4ab6a9d21ac64))
* improve attributes for Dialog ([#1514](https://github.com/kufu/smarthr-ui/issues/1514)) ([93a345d](https://github.com/kufu/smarthr-ui/commit/93a345d5dcb2a00e0b65cd5281cfff47147031f2))
* improve attributes for FieldSet ([#1543](https://github.com/kufu/smarthr-ui/issues/1543)) ([1ca0162](https://github.com/kufu/smarthr-ui/commit/1ca0162bab51edf6c11ac2dac503db527f0db325))
* improve attributes for Footer ([#1633](https://github.com/kufu/smarthr-ui/issues/1633)) ([4d0e17d](https://github.com/kufu/smarthr-ui/commit/4d0e17d63accbb4d0b39a49a830ae7dbe2af5021))
* improve heading padding in InformationPanel ([#1561](https://github.com/kufu/smarthr-ui/issues/1561)) ([569d99a](https://github.com/kufu/smarthr-ui/commit/569d99adb91016203681ec70c18c3f47a71be22d))
* new focus appearance ([#1512](https://github.com/kufu/smarthr-ui/issues/1512)) ([8ad60f8](https://github.com/kufu/smarthr-ui/commit/8ad60f8517fe9b06c17473f0496c4511ea2bef43))


### Bug Fixes

* `<MultiCombobox>` focus indicator ([#1527](https://github.com/kufu/smarthr-ui/issues/1527)) ([520c8b6](https://github.com/kufu/smarthr-ui/commit/520c8b67a345177175cac9b9225abbeb4bab361b))
* ActionDialog のレスポンスメッセージがない時に余計な余白が出ている ([#1550](https://github.com/kufu/smarthr-ui/issues/1550)) ([e22258d](https://github.com/kufu/smarthr-ui/commit/e22258d07e47a890aea0bb43556630b0a83f2325))
* add aria-invalid to components with error state ([#1531](https://github.com/kufu/smarthr-ui/issues/1531)) ([b55b030](https://github.com/kufu/smarthr-ui/commit/b55b030550f6640781ae2a96640eeb6dd3ac8b84))
* added some attributes of accessibility for DatePicker component ([#1629](https://github.com/kufu/smarthr-ui/issues/1629)) ([aa7695f](https://github.com/kufu/smarthr-ui/commit/aa7695fb86dbd5bd57282f75c7f9c3cd9529afcf))
* change icon storybook from div to dl ([#1575](https://github.com/kufu/smarthr-ui/issues/1575)) ([5ef0212](https://github.com/kufu/smarthr-ui/commit/5ef021287cd49ad8b466436aedcefa1ea22c99f9))
* change the HTML tag of IndexNav ([#1634](https://github.com/kufu/smarthr-ui/issues/1634)) ([ab7704a](https://github.com/kufu/smarthr-ui/commit/ab7704adccb7ecbe916e681f5da0962d830b6a95))
* CompactInformationPanel に className を渡せるようにする ([#1669](https://github.com/kufu/smarthr-ui/issues/1669)) ([0994108](https://github.com/kufu/smarthr-ui/commit/0994108ea672b7c352a1b29a9e9a4005049063bd))
* Disable selected items when MultiComboBox is disabled ([#1544](https://github.com/kufu/smarthr-ui/issues/1544)) ([8edb9e0](https://github.com/kufu/smarthr-ui/commit/8edb9e0cd4dd305e84d812f79941ac7a294fbc80))
* Fix mobile Safari not showing all options for Select component  (SHRUI-392) ([#1517](https://github.com/kufu/smarthr-ui/issues/1517)) ([cdb85ce](https://github.com/kufu/smarthr-ui/commit/cdb85ce517ad154261418e6db42fad93fd8a2af2))
* FormGroup label to inline-block ([#1515](https://github.com/kufu/smarthr-ui/issues/1515)) ([d38aa0e](https://github.com/kufu/smarthr-ui/commit/d38aa0e18771163b3fd0a3cec9998695ce0bf73a))
* improve scroll suppression in Dialog (SHRUI-380) ([#1532](https://github.com/kufu/smarthr-ui/issues/1532)) ([9bf7bce](https://github.com/kufu/smarthr-ui/commit/9bf7bcef3c88ad88ac64db98126696ea47297b8a))
* modify not to new DOMRect for IE11 ([#1530](https://github.com/kufu/smarthr-ui/issues/1530)) ([2274ce6](https://github.com/kufu/smarthr-ui/commit/2274ce68b8c3fb1462c33f9ade94bbd8f5011d45))
* modify to be expected width when set percentage width ([#1585](https://github.com/kufu/smarthr-ui/issues/1585)) ([94a9eff](https://github.com/kufu/smarthr-ui/commit/94a9effa05a4ee9687cb49587581ca4724768882))
* set DIALOG shadow to CompactInformationPanel (SHRUI-400) ([#1549](https://github.com/kufu/smarthr-ui/issues/1549)) ([54823d8](https://github.com/kufu/smarthr-ui/commit/54823d89d1215c95a93891f4b8701b52b1942568))
* table all story accessible ([#1574](https://github.com/kufu/smarthr-ui/issues/1574)) ([1a8e53f](https://github.com/kufu/smarthr-ui/commit/1a8e53fa82938e8aecf5867e0c6c0d4c2e827ba4))


* fix!(BREAKING CHANGE): remove Icon that uses name prop (SHRUI-349) (#1494) ([b2952fa](https://github.com/kufu/smarthr-ui/commit/b2952fa64f2807b25925932f1f49d5153ae2b32d)), closes [#1494](https://github.com/kufu/smarthr-ui/issues/1494)
* fix!(BREAKING CHANGE): change default title tag in InformationPanel (SHRUI-170) (#1493) ([ed36ec3](https://github.com/kufu/smarthr-ui/commit/ed36ec395cd4f4c0bcf1fa4eec375673f9d32f8c)), closes [#1493](https://github.com/kufu/smarthr-ui/issues/1493)
* fix!(BREAKING CHANGE): drop node v10 support (SHRUI-384) (#1492) ([6dfc53e](https://github.com/kufu/smarthr-ui/commit/6dfc53ef549ef6711ba6863bf090fce021a56dc1)), closes [#1492](https://github.com/kufu/smarthr-ui/issues/1492)

## [12.4.0](https://github.com/kufu/smarthr-ui/compare/v12.4.0-1...v12.4.0) (2021-05-27)


### Bug Fixes

* modify to be expected width when set percentage width ([#1584](https://github.com/kufu/smarthr-ui/issues/1584)) ([cc7ec72](https://github.com/kufu/smarthr-ui/commit/cc7ec72493097b2f93d4c0e075a4244796b296fa))

## [12.4.0-1](https://github.com/kufu/smarthr-ui/compare/v12.4.0-0...v12.4.0-1) (2021-04-16)


### Bug Fixes

* Fix mobile Safari not showing all options for Select component  (SHRUI-392) ([#1517](https://github.com/kufu/smarthr-ui/issues/1517)) ([7b564b2](https://github.com/kufu/smarthr-ui/commit/7b564b2206c0734eaaa4d7fd9b2769cd74c9fe17))

## [12.4.0-0](https://github.com/kufu/smarthr-ui/compare/v12.3.1...v12.4.0-0) (2021-04-12)


### Features

* add default class names to button components ([#1472](https://github.com/kufu/smarthr-ui/issues/1472)) ([cd49408](https://github.com/kufu/smarthr-ui/commit/cd494088e8f208cc6c653bf7736197e5cca5a03f))
* add SingleComboBox (SHRUI-66) ([#1426](https://github.com/kufu/smarthr-ui/issues/1426)) ([3412352](https://github.com/kufu/smarthr-ui/commit/341235264700d750eb12574eb37aa6a8e65f9f5c))
* add sync icon to InformationPanel ([#1476](https://github.com/kufu/smarthr-ui/issues/1476)) ([166e9ee](https://github.com/kufu/smarthr-ui/commit/166e9eef1d63ab4c0c1a9194d5097d2fbf1fc99b))
* apply classNames to FlashMessage ([#1473](https://github.com/kufu/smarthr-ui/issues/1473)) ([9104d81](https://github.com/kufu/smarthr-ui/commit/9104d817f784f418977fb5597525019d5e634702))
* improve attributes for DefinitionList ([#1441](https://github.com/kufu/smarthr-ui/issues/1441)) ([27c4fc0](https://github.com/kufu/smarthr-ui/commit/27c4fc06abe17e83b664c36e219804395624e0dd))


### Bug Fixes

* enable to set attributes of dropzone and add smarthr-ui dropzone class name ([#1445](https://github.com/kufu/smarthr-ui/issues/1445)) ([2c73296](https://github.com/kufu/smarthr-ui/commit/2c73296d46c6bbfefc2bb28854b91489948707e6))
* exclude disabled element ([#1410](https://github.com/kufu/smarthr-ui/issues/1410)) ([fd9c0f3](https://github.com/kufu/smarthr-ui/commit/fd9c0f30cd1e94aa57b9b11552e1078c693380a4))
* Merge hotfix v12.3.0 to master ([#1477](https://github.com/kufu/smarthr-ui/issues/1477)) ([e5d8e8d](https://github.com/kufu/smarthr-ui/commit/e5d8e8d9de1e5375b3ecdb04616842f61494a488)), closes [#1475](https://github.com/kufu/smarthr-ui/issues/1475)
* modify height of MultiComboBox (SHRUI-364) ([#1471](https://github.com/kufu/smarthr-ui/issues/1471)) ([d28daf1](https://github.com/kufu/smarthr-ui/commit/d28daf1bd9e16e3e8eaa23da19de6e0767b11579))

### [12.3.2](https://github.com/kufu/smarthr-ui/compare/v12.3.1...v12.3.2) (2021-04-16)


### Bug Fixes

* Fix mobile Safari not showing all options for Select component  (SHRUI-392) ([#1517](https://github.com/kufu/smarthr-ui/issues/1517)) ([e235d82](https://github.com/kufu/smarthr-ui/commit/e235d827ce313a9668ea92581a0719ad1cbe98a4))

### [12.3.1](https://github.com/kufu/smarthr-ui/compare/v12.3.0...v12.3.1) (2021-04-01)


### Bug Fixes

* fix problem with createTheme ([#1475](https://github.com/kufu/smarthr-ui/issues/1475)) ([d980d4d](https://github.com/kufu/smarthr-ui/commit/d980d4dff014c459469ae73cb1c21f55f4a43253))

## [12.3.0](https://github.com/kufu/smarthr-ui/compare/v12.2.1...v12.3.0) (2021-03-23)


### Features

* ActionDialog にレスポンスメッセージエリアを追加 ([#1424](https://github.com/kufu/smarthr-ui/issues/1424)) ([fa37d0e](https://github.com/kufu/smarthr-ui/commit/fa37d0e1091329363be9f739a262ab036d65726f))
* add floatArea component ([#1270](https://github.com/kufu/smarthr-ui/issues/1270)) ([370ce97](https://github.com/kufu/smarthr-ui/commit/370ce9754bb26297eae079125939e01475174783))
* add new icon, fa-user-clock ([#1392](https://github.com/kufu/smarthr-ui/issues/1392)) ([78fc529](https://github.com/kufu/smarthr-ui/commit/78fc529d0a545b223a2081a600370117ade7e6f9))
* change colors (SHRUI-356, SHRUI-357, SHRUI-358) ([#1407](https://github.com/kufu/smarthr-ui/issues/1407)) ([777dbbc](https://github.com/kufu/smarthr-ui/commit/777dbbc16f27867409ef94c1c454d5ee09b89bd9))
* improve attributes for BackgroundJobsList and BackgroundJobsPanel (SHRUI-249) ([#1404](https://github.com/kufu/smarthr-ui/issues/1404)) ([de9ece9](https://github.com/kufu/smarthr-ui/commit/de9ece95ec3dd3d880946f40de38ff64bcafaec6))
* improve attributes for Base and DialogBase ([#1402](https://github.com/kufu/smarthr-ui/issues/1402)) ([a91f008](https://github.com/kufu/smarthr-ui/commit/a91f008e952cbffe409528fe42dfe88dedf71149))
* support multiline text of CheckboxLabel ([#1403](https://github.com/kufu/smarthr-ui/issues/1403)) ([3441590](https://github.com/kufu/smarthr-ui/commit/3441590512686bad55e1d473bbc0cea275b77907))


### Bug Fixes

* add disabled to the current button of pagenation ([#1429](https://github.com/kufu/smarthr-ui/issues/1429)) ([c40a824](https://github.com/kufu/smarthr-ui/commit/c40a824f92c620c0c54c5b43f43ec271f8048a63))
* add preset className to checkbox (SHRUI-255) ([#1391](https://github.com/kufu/smarthr-ui/issues/1391)) ([e455537](https://github.com/kufu/smarthr-ui/commit/e45553704d03d9f25ff2acc3591873f100e8bae2))
* change style to show focus indicator ([#1421](https://github.com/kufu/smarthr-ui/issues/1421)) ([200fe2c](https://github.com/kufu/smarthr-ui/commit/200fe2c8f62eb7ce2102fd3bda1c9ea5da5d713a))
* enable to set attributes of input element ([#1363](https://github.com/kufu/smarthr-ui/issues/1363)) ([9300a68](https://github.com/kufu/smarthr-ui/commit/9300a6848126c3a73e97b2fd7af29ccc85d769a8))
* flatten theme tree (SHRUI-204) ([#1256](https://github.com/kufu/smarthr-ui/issues/1256)) ([1b13571](https://github.com/kufu/smarthr-ui/commit/1b1357190f5d685f1ad9e0b389186d097aaf0cb9))
* improve ARIA ([#1409](https://github.com/kufu/smarthr-ui/issues/1409)) ([e2de01a](https://github.com/kufu/smarthr-ui/commit/e2de01a650c8a6c15a6d7f1a4a1e11d187204f49))
* improve attributes of AppNavi (SHRUI-248) ([#1378](https://github.com/kufu/smarthr-ui/issues/1378)) ([2e7e020](https://github.com/kufu/smarthr-ui/commit/2e7e020552e4f229a1f7fbeeedbbee22c0f08950))
* improve attributes of BottomFixedArea ([#1364](https://github.com/kufu/smarthr-ui/issues/1364)) ([1d0bf46](https://github.com/kufu/smarthr-ui/commit/1d0bf46a1dd4cc37c30d9cde1fa17537325143d2))
* improve attributes of CheckBoxLabel (SHRUI-256) ([#1427](https://github.com/kufu/smarthr-ui/issues/1427)) ([7c082e4](https://github.com/kufu/smarthr-ui/commit/7c082e4ea43301765faa551a367a17be64a5aa03))
* remove position: fixed for Footer in MessageScreen ([#1365](https://github.com/kufu/smarthr-ui/issues/1365)) ([c9505de](https://github.com/kufu/smarthr-ui/commit/c9505de9d38d365a545c7ac3c3ed3e4ae099debb))
* suppress to fire handler during animation for closing in Dialog (SHRUI-343) ([#1406](https://github.com/kufu/smarthr-ui/issues/1406)) ([a28ad0b](https://github.com/kufu/smarthr-ui/commit/a28ad0b1be3f0da0c1a05e74a69aacfcf2d39b84))
* tab-bar outline style ([#1439](https://github.com/kufu/smarthr-ui/issues/1439)) ([dbbca09](https://github.com/kufu/smarthr-ui/commit/dbbca0912dae5f7634a8441eb75a7850c413a784))
* textarea outline style ([#1440](https://github.com/kufu/smarthr-ui/issues/1440)) ([1539e0e](https://github.com/kufu/smarthr-ui/commit/1539e0e104af545ac6849fee016f8d2c8c55e78e))

### [12.2.1](https://github.com/kufu/smarthr-ui/compare/v12.2.0...v12.2.1) (2021-02-16)


### Bug Fixes

* enable to set disabled to close button ([#1326](https://github.com/kufu/smarthr-ui/issues/1326)) ([1f6fd86](https://github.com/kufu/smarthr-ui/commit/1f6fd8674f55fd8786db258b5535aba16fa69a0e))
* modify not to call other hooks in useMemo ([#1368](https://github.com/kufu/smarthr-ui/issues/1368)) ([c0070bc](https://github.com/kufu/smarthr-ui/commit/c0070bcefce89dc68250bbb7c194d05c764cd101))

## [12.2.0](https://github.com/kufu/smarthr-ui/compare/v12.1.1...v12.2.0) (2021-02-15)


### Features

* add handling when Window object is not supported ([#1312](https://github.com/kufu/smarthr-ui/issues/1312)) ([9391da3](https://github.com/kufu/smarthr-ui/commit/9391da31bae15a58fe3b9f8cd6d04c5ca7f550e0))


### Bug Fixes

* add light focus trap in Dialog (SHRUI-348) ([#1351](https://github.com/kufu/smarthr-ui/issues/1351)) ([b625739](https://github.com/kufu/smarthr-ui/commit/b62573939eff33bd60ba979f1791fd931b0cd8fd))
* improve attributes Base ([#1337](https://github.com/kufu/smarthr-ui/issues/1337)) ([801d02a](https://github.com/kufu/smarthr-ui/commit/801d02a508f6916ac855d0c570baaba8793a7909))
* improve attributes of Balloon (SHRUI-250) ([#1339](https://github.com/kufu/smarthr-ui/issues/1339)) ([8ca9dae](https://github.com/kufu/smarthr-ui/commit/8ca9dae06a1bfbd4410971c2d11ee3a754813e9f))

### [12.1.1](https://github.com/kufu/smarthr-ui/compare/v12.1.0...v12.1.1) (2021-02-08)


### Bug Fixes

* rename story file to include .stories ([#1340](https://github.com/kufu/smarthr-ui/issues/1340)) ([269aea3](https://github.com/kufu/smarthr-ui/commit/269aea369af0c9018c2f233ef8c959d42fd5413c))

## [12.1.0](https://github.com/kufu/smarthr-ui/compare/v12.0.0...v12.1.0) (2021-02-08)


### Features

* add new icons; fa-medkit and fa-tachometer-alt ([#1299](https://github.com/kufu/smarthr-ui/issues/1299)) ([e9557d6](https://github.com/kufu/smarthr-ui/commit/e9557d6ba1539dd24841664f5c2b95f8b49d4cbb))
* support <Fa***Icon /> components in addition to <Icon name="fa-***" /> ([#1304](https://github.com/kufu/smarthr-ui/issues/1304)) ([cf5fbe1](https://github.com/kufu/smarthr-ui/commit/cf5fbe1ef36f393ac6a1314fa46c212c944be239))


### Bug Fixes

* add "!important" to font-size of InputFile ([#1313](https://github.com/kufu/smarthr-ui/issues/1313)) ([757ebc6](https://github.com/kufu/smarthr-ui/commit/757ebc64b07ecc00818f26d8df4c82362b302fb5))
* add Segmented control ARIA (SHRUI-242) ([#1223](https://github.com/kufu/smarthr-ui/issues/1223)) ([f3c62cd](https://github.com/kufu/smarthr-ui/commit/f3c62cde713e08d9501cfc19f3cab82f0e2679ac))
* change input error style (SHRUI-327) ([#1298](https://github.com/kufu/smarthr-ui/issues/1298)) ([8db8c06](https://github.com/kufu/smarthr-ui/commit/8db8c069557f01fc0debc205df0d05380976fcf7))
* enable to set attributes of input element ([#1321](https://github.com/kufu/smarthr-ui/issues/1321)) ([b67b899](https://github.com/kufu/smarthr-ui/commit/b67b899f2e53ea6a81c8008ad2b774531be78213))
* enable to set disabled in Option of Select (SHRUI-303) ([#1318](https://github.com/kufu/smarthr-ui/issues/1318)) ([9388106](https://github.com/kufu/smarthr-ui/commit/9388106f098eed9c073bb72c42c79f6041d247d2))
* fix position of visually hidden text ([#1317](https://github.com/kufu/smarthr-ui/issues/1317)) ([3b02210](https://github.com/kufu/smarthr-ui/commit/3b0221066b4091c1c4e775d98212064e13c0bdc3))
* fix the condition of displaying message of duplicating in MultiComboBox (SHRUI-302) ([#1237](https://github.com/kufu/smarthr-ui/issues/1237)) ([e35848f](https://github.com/kufu/smarthr-ui/commit/e35848f024ce9fceb0b2f83f82e7124a702089b8))
* improve attributes of AccordionPanel (SHRUI-246) ([#1290](https://github.com/kufu/smarthr-ui/issues/1290)) ([2a58b0a](https://github.com/kufu/smarthr-ui/commit/2a58b0a6730a8b8e6321bfb84cb3aab5e747b6a0))
* input[file] の不要なfocusを削除する ([#1314](https://github.com/kufu/smarthr-ui/issues/1314)) ([209b8fb](https://github.com/kufu/smarthr-ui/commit/209b8fb54aa9c818843ecb5ec7a25190f63c4c3d))
* modify Dialog to be able to set aria-controls (SHRUI-220) ([#1231](https://github.com/kufu/smarthr-ui/issues/1231)) ([ae1cc05](https://github.com/kufu/smarthr-ui/commit/ae1cc05a8534d75feac98082feeeaa6072cfa36c))
* modify not to apply hover or focus style from other css to Button ([#1242](https://github.com/kufu/smarthr-ui/issues/1242)) ([8315e21](https://github.com/kufu/smarthr-ui/commit/8315e21c7d7818037c888f40ec8c94da4d5bace5))
* modify not to fire escape key handler when dialog is not open ([#1235](https://github.com/kufu/smarthr-ui/issues/1235)) ([b868654](https://github.com/kufu/smarthr-ui/commit/b868654a4d71d369e7480ff46d88091aa7863283))
* modify to be able to scroll dropdown in IE ([#1206](https://github.com/kufu/smarthr-ui/issues/1206)) ([12a24f7](https://github.com/kufu/smarthr-ui/commit/12a24f704d29a734aca45a142485f1e7c54f500a))
* replace old color code of storybook to theme in DefinitionList ([#1249](https://github.com/kufu/smarthr-ui/issues/1249)) ([d81dc3e](https://github.com/kufu/smarthr-ui/commit/d81dc3ef56cc686d49a53617957f866bc49d661c))

## [12.0.0](https://github.com/kufu/smarthr-ui/compare/v11.1.0...v12.0.0) (2021-01-12)


### ⚠ BREAKING CHANGES

* change loader animation (#1173)
* remove shinColorPalette
* add type props to button (#1086)

### Features

* add "from" and "to" props to DatePicker component ([#1123](https://github.com/kufu/smarthr-ui/issues/1123)) ([7f841e0](https://github.com/kufu/smarthr-ui/commit/7f841e08964fc1c912d2e3d042015f04e254deb6))
* add blukActionArea in Head of Table (SHRUI-8) ([#937](https://github.com/kufu/smarthr-ui/issues/937)) ([bf0158a](https://github.com/kufu/smarthr-ui/commit/bf0158acb176fc42be5e9365b996b1998db12f70))
* add border style to MessageDialog ([#1059](https://github.com/kufu/smarthr-ui/issues/1059)) ([add5da7](https://github.com/kufu/smarthr-ui/commit/add5da754c47190bacf6d69c9ae6b88dd34ec0cf))
* add darkenAmount argument to hoverColor method ([#950](https://github.com/kufu/smarthr-ui/issues/950)) ([7d78586](https://github.com/kufu/smarthr-ui/commit/7d78586cc9073c3ac4fd998169e285f3ac72f6e4))
* add hasBlank and blankLabel props to Select ([#1061](https://github.com/kufu/smarthr-ui/issues/1061)) ([165e104](https://github.com/kufu/smarthr-ui/commit/165e1049083ae19dab9d2ee5030375130aa3700b))
* add Shin color (SHRUI-227) ([#1141](https://github.com/kufu/smarthr-ui/issues/1141)) ([1c8063a](https://github.com/kufu/smarthr-ui/commit/1c8063ac92543f54b4046efc7d9f12a177cb891b))
* add SideNav component ([#1142](https://github.com/kufu/smarthr-ui/issues/1142)) ([6bae12c](https://github.com/kufu/smarthr-ui/commit/6bae12c4e24360e839f55a1f9f2789de75681d47)), closes [/github.com/kufu/smarthr-ui/pull/1142#discussion_r533174306](https://github.com/kufu//github.com/kufu/smarthr-ui/pull/1142/issues/discussion_r533174306)
* change the attribute of radius ([#1080](https://github.com/kufu/smarthr-ui/issues/1080)) ([0e5bb8f](https://github.com/kufu/smarthr-ui/commit/0e5bb8fc47268ac96f86a5d7d876f9fee9e34786))
* expose Icon components individually ([#1127](https://github.com/kufu/smarthr-ui/issues/1127)) ([f7e716b](https://github.com/kufu/smarthr-ui/commit/f7e716b019488f267caae733dbfc80f9d14a9cab))
* fix style of disabling selectbox ([#1184](https://github.com/kufu/smarthr-ui/issues/1184)) ([04f0240](https://github.com/kufu/smarthr-ui/commit/04f0240946bac8764d397d215f79fd7156e8febb))
* support React v17 ([#1151](https://github.com/kufu/smarthr-ui/issues/1151)) ([dc23011](https://github.com/kufu/smarthr-ui/commit/dc23011ad7db3eca02c1c5ea6e0dbe0af4da8367))


### Bug Fixes

*  invalid html width attribute ([#1105](https://github.com/kufu/smarthr-ui/issues/1105)) ([1061356](https://github.com/kufu/smarthr-ui/commit/1061356fdd9b4849740f0b7515cb34193d13676a))
* add aria and role attributes to dialog ([#1033](https://github.com/kufu/smarthr-ui/issues/1033)) ([92561f3](https://github.com/kufu/smarthr-ui/commit/92561f388350f5398afd7efea317527134a3e983)), closes [/github.com/kufu/smarthr-ui/pull/1033#discussion_r529388476](https://github.com/kufu//github.com/kufu/smarthr-ui/pull/1033/issues/discussion_r529388476)
* add aria and role attributes to Pagenation ([#1124](https://github.com/kufu/smarthr-ui/issues/1124)) ([8a5ac30](https://github.com/kufu/smarthr-ui/commit/8a5ac30ade05b68e08ad414573bab0aaffdc184c))
* add aria-checked to checkbox ([#1029](https://github.com/kufu/smarthr-ui/issues/1029)) ([69dfed1](https://github.com/kufu/smarthr-ui/commit/69dfed1262dc1197984caf202b48b9a013b30f23))
* add aria-controls to accordion button triggers for Change default Expanded ([#1140](https://github.com/kufu/smarthr-ui/issues/1140)) ([8d366c2](https://github.com/kufu/smarthr-ui/commit/8d366c258d09ef4476e17f5c34c832497cf97978))
* add aria-describedby ([#1137](https://github.com/kufu/smarthr-ui/issues/1137)) ([d98f729](https://github.com/kufu/smarthr-ui/commit/d98f7293b535b215237365fb87ce67004348175f))
* add background-color white ([#1260](https://github.com/kufu/smarthr-ui/issues/1260)) ([3caa554](https://github.com/kufu/smarthr-ui/commit/3caa554106fb76cd39f9ac412624334df68c27b0))
* add box-sizing: border-box to textarea ([#1060](https://github.com/kufu/smarthr-ui/issues/1060)) ([14e8f06](https://github.com/kufu/smarthr-ui/commit/14e8f06d2fc796b268fdac2fdc79681b797b067d))
* add optional chaining to _isChildPortal ([#1236](https://github.com/kufu/smarthr-ui/issues/1236)) ([6258036](https://github.com/kufu/smarthr-ui/commit/6258036bda429340b23abbbd0e67aa59e3560cc9))
* add type props to button ([#1086](https://github.com/kufu/smarthr-ui/issues/1086)) ([f603a16](https://github.com/kufu/smarthr-ui/commit/f603a16e680e6e025ddf2c95095eb2799dd82ed6))
* change disabled props to transient props ([#1092](https://github.com/kufu/smarthr-ui/issues/1092)) ([1af1390](https://github.com/kufu/smarthr-ui/commit/1af13904e73a827f74065975b2c803ed7278a638))
* change full-width space to half-width ([#1201](https://github.com/kufu/smarthr-ui/issues/1201)) ([889aa2b](https://github.com/kufu/smarthr-ui/commit/889aa2beac63b458504ff4c9613d203f4f1f3a7e))
* change loader animation ([#1173](https://github.com/kufu/smarthr-ui/issues/1173)) ([abddc8f](https://github.com/kufu/smarthr-ui/commit/abddc8f99190e585647a330f5d9ae877ac4ad8ae)), closes [/github.com/kufu/smarthr-ui/pull/1173#discussion_r532369303](https://github.com/kufu//github.com/kufu/smarthr-ui/pull/1173/issues/discussion_r532369303)
* change the minimum value of from props in the calendar component ([#1122](https://github.com/kufu/smarthr-ui/issues/1122)) ([5718806](https://github.com/kufu/smarthr-ui/commit/57188066ad7edda3632bd4591d94e7e6c6a0c362))
* change theme props to transient props ([#1081](https://github.com/kufu/smarthr-ui/issues/1081)) ([960bc98](https://github.com/kufu/smarthr-ui/commit/960bc980ac7d89ad7e3c953cb8ab90b109d88636))
* change to add aria-label to icon ([#1110](https://github.com/kufu/smarthr-ui/issues/1110)) ([3254aef](https://github.com/kufu/smarthr-ui/commit/3254aef5bd62aa88b7fd687798807f040ecd6dbc))
* change width props to temporary props ([#1089](https://github.com/kufu/smarthr-ui/issues/1089)) ([44bbe36](https://github.com/kufu/smarthr-ui/commit/44bbe364c8d7b5634dec738a2627b24d78caac5d))
* checkboxLabel where the label contains a "div" and "p" ([#1083](https://github.com/kufu/smarthr-ui/issues/1083)) ([96e6b69](https://github.com/kufu/smarthr-ui/commit/96e6b69e7d71d96f7d223f6dbe03569f10f45c0f))
* DatePicker bugs ([#1091](https://github.com/kufu/smarthr-ui/issues/1091)) ([11edaab](https://github.com/kufu/smarthr-ui/commit/11edaabc7b99e1b7e97eb0b636e1786e3a31ef12))
* dialog focus management ([#889](https://github.com/kufu/smarthr-ui/issues/889)) ([b9fde13](https://github.com/kufu/smarthr-ui/commit/b9fde131af353180fe7742fb34d9a65648bd8b22))
* fallback parentElement of svg element for IE ([#1241](https://github.com/kufu/smarthr-ui/issues/1241)) ([d4ae54e](https://github.com/kufu/smarthr-ui/commit/d4ae54e448fd1baa985b8c3f11556dfa468007ef))
* fix input width for firefox ([#1253](https://github.com/kufu/smarthr-ui/issues/1253)) ([d9fc669](https://github.com/kufu/smarthr-ui/commit/d9fc6695384c4263a6d00fc598f736054cc7eb3b))
* improve accessibility of MultiComboBox (SHRUI-207) ([#1187](https://github.com/kufu/smarthr-ui/issues/1187)) ([db30633](https://github.com/kufu/smarthr-ui/commit/db30633601ba48d69c8ad26bd87a914c7f6c4172))
* improve role of infomationpanel ([#1205](https://github.com/kufu/smarthr-ui/issues/1205)) ([116a3c4](https://github.com/kufu/smarthr-ui/commit/116a3c4b5e05bfae21ac992d049ff0235ec843e5))
* invalid html attribute ([#1095](https://github.com/kufu/smarthr-ui/issues/1095)) ([bb85bac](https://github.com/kufu/smarthr-ui/commit/bb85bac2df1a26e717010385a2a7e096ac3d444e))
* invalid html attribute ([#1106](https://github.com/kufu/smarthr-ui/issues/1106)) ([8732440](https://github.com/kufu/smarthr-ui/commit/87324403a7501c86e84386db60e7cf983a441532))
* make StatusLabel vertical center alignment  ([#879](https://github.com/kufu/smarthr-ui/issues/879)) ([34cc429](https://github.com/kufu/smarthr-ui/commit/34cc429d255a95c67ee7cc53875a25c1ef5899f5))
* modify auto format of CurrencyInput (SHRUI-145) ([#1143](https://github.com/kufu/smarthr-ui/issues/1143)) ([266a0bc](https://github.com/kufu/smarthr-ui/commit/266a0bc2cc11922addafffeec560bf234603236f))
* modify not to apply hover-style to Checkbox when hover over a disabled CheckboxLabel ([#1136](https://github.com/kufu/smarthr-ui/issues/1136)) ([0c662a3](https://github.com/kufu/smarthr-ui/commit/0c662a3f803513941df4e375dc4700888a38b520))
* pass undefined to accept instead of blank string ([#1121](https://github.com/kufu/smarthr-ui/issues/1121)) ([514d569](https://github.com/kufu/smarthr-ui/commit/514d569b38d27eaf8bdc590f7e961f6c52ace6ca))
* refactor Dropdown (SHRUI-221) ([#1126](https://github.com/kufu/smarthr-ui/issues/1126)) ([0b77df6](https://github.com/kufu/smarthr-ui/commit/0b77df6909d4f6dcb624463c9343c746a5587883))
* reflect feedback of SideNav (SHRUI-320) ([#1251](https://github.com/kufu/smarthr-ui/issues/1251)) ([b66441c](https://github.com/kufu/smarthr-ui/commit/b66441c486c8f2c8baffcc78c477655ac70956da))
* remove that blank optgroup is displayed for IE ([#1186](https://github.com/kufu/smarthr-ui/issues/1186)) ([06dc2db](https://github.com/kufu/smarthr-ui/commit/06dc2db71ef578e32ac783fb062dfc62baf02c2a))
* replace defaultPalette (SHRUI-233) ([#1153](https://github.com/kufu/smarthr-ui/issues/1153)) ([b323bd5](https://github.com/kufu/smarthr-ui/commit/b323bd584ea5c679e0e3d21cccc48072aa402cfc))
* replace div in button with span ([#1084](https://github.com/kufu/smarthr-ui/issues/1084)) ([8f1ed53](https://github.com/kufu/smarthr-ui/commit/8f1ed5304528bd1161d5429188bb903df096cddb))
* replace figurein button with span ([#1082](https://github.com/kufu/smarthr-ui/issues/1082)) ([4c0188f](https://github.com/kufu/smarthr-ui/commit/4c0188f32396f19cccbba9a20d5e9dbeda84f802))
* shifting of index when IndexNav's ListItem is inserted into a new line ([#1138](https://github.com/kufu/smarthr-ui/issues/1138)) ([6222f57](https://github.com/kufu/smarthr-ui/commit/6222f576824f5c108699b9a7613fd1f27f46d469))
* update package.json ([#1224](https://github.com/kufu/smarthr-ui/issues/1224)) ([976fb89](https://github.com/kufu/smarthr-ui/commit/976fb89f506bf83da309fcf606fe2fb08d321438))
* アコーディオンパネルの展開時に overflow を既定値に戻す ([#1125](https://github.com/kufu/smarthr-ui/issues/1125)) ([8d8069b](https://github.com/kufu/smarthr-ui/commit/8d8069b05672165943ef17080c17696108a17872))

## [12.0.0-0](https://github.com/kufu/smarthr-ui/compare/v11.1.0...v12.0.0-0) (2020-12-17)


### ⚠ BREAKING CHANGES

* change loader animation (#1173)
* remove shinColorPalette
* add type props to button (#1086)

### Features

* add "from" and "to" props to DatePicker component ([#1123](https://github.com/kufu/smarthr-ui/issues/1123)) ([7f841e0](https://github.com/kufu/smarthr-ui/commit/7f841e08964fc1c912d2e3d042015f04e254deb6))
* add blukActionArea in Head of Table (SHRUI-8) ([#937](https://github.com/kufu/smarthr-ui/issues/937)) ([bf0158a](https://github.com/kufu/smarthr-ui/commit/bf0158acb176fc42be5e9365b996b1998db12f70))
* add border style to MessageDialog ([#1059](https://github.com/kufu/smarthr-ui/issues/1059)) ([add5da7](https://github.com/kufu/smarthr-ui/commit/add5da754c47190bacf6d69c9ae6b88dd34ec0cf))
* add darkenAmount argument to hoverColor method ([#950](https://github.com/kufu/smarthr-ui/issues/950)) ([7d78586](https://github.com/kufu/smarthr-ui/commit/7d78586cc9073c3ac4fd998169e285f3ac72f6e4))
* add hasBlank and blankLabel props to Select ([#1061](https://github.com/kufu/smarthr-ui/issues/1061)) ([165e104](https://github.com/kufu/smarthr-ui/commit/165e1049083ae19dab9d2ee5030375130aa3700b))
* add Shin color (SHRUI-227) ([#1141](https://github.com/kufu/smarthr-ui/issues/1141)) ([1c8063a](https://github.com/kufu/smarthr-ui/commit/1c8063ac92543f54b4046efc7d9f12a177cb891b))
* add SideNav component ([#1142](https://github.com/kufu/smarthr-ui/issues/1142)) ([6bae12c](https://github.com/kufu/smarthr-ui/commit/6bae12c4e24360e839f55a1f9f2789de75681d47)), closes [/github.com/kufu/smarthr-ui/pull/1142#discussion_r533174306](https://github.com/kufu//github.com/kufu/smarthr-ui/pull/1142/issues/discussion_r533174306)
* change the attribute of radius ([#1080](https://github.com/kufu/smarthr-ui/issues/1080)) ([0e5bb8f](https://github.com/kufu/smarthr-ui/commit/0e5bb8fc47268ac96f86a5d7d876f9fee9e34786))
* expose Icon components individually ([#1127](https://github.com/kufu/smarthr-ui/issues/1127)) ([f7e716b](https://github.com/kufu/smarthr-ui/commit/f7e716b019488f267caae733dbfc80f9d14a9cab))
* fix style of disabling selectbox ([#1184](https://github.com/kufu/smarthr-ui/issues/1184)) ([04f0240](https://github.com/kufu/smarthr-ui/commit/04f0240946bac8764d397d215f79fd7156e8febb))
* support React v17 ([#1151](https://github.com/kufu/smarthr-ui/issues/1151)) ([dc23011](https://github.com/kufu/smarthr-ui/commit/dc23011ad7db3eca02c1c5ea6e0dbe0af4da8367))


### Bug Fixes

*  invalid html width attribute ([#1105](https://github.com/kufu/smarthr-ui/issues/1105)) ([1061356](https://github.com/kufu/smarthr-ui/commit/1061356fdd9b4849740f0b7515cb34193d13676a))
* add aria and role attributes to dialog ([#1033](https://github.com/kufu/smarthr-ui/issues/1033)) ([92561f3](https://github.com/kufu/smarthr-ui/commit/92561f388350f5398afd7efea317527134a3e983)), closes [/github.com/kufu/smarthr-ui/pull/1033#discussion_r529388476](https://github.com/kufu//github.com/kufu/smarthr-ui/pull/1033/issues/discussion_r529388476)
* add aria and role attributes to Pagenation ([#1124](https://github.com/kufu/smarthr-ui/issues/1124)) ([8a5ac30](https://github.com/kufu/smarthr-ui/commit/8a5ac30ade05b68e08ad414573bab0aaffdc184c))
* add aria-checked to checkbox ([#1029](https://github.com/kufu/smarthr-ui/issues/1029)) ([69dfed1](https://github.com/kufu/smarthr-ui/commit/69dfed1262dc1197984caf202b48b9a013b30f23))
* add aria-controls to accordion button triggers for Change default Expanded ([#1140](https://github.com/kufu/smarthr-ui/issues/1140)) ([8d366c2](https://github.com/kufu/smarthr-ui/commit/8d366c258d09ef4476e17f5c34c832497cf97978))
* add aria-describedby ([#1137](https://github.com/kufu/smarthr-ui/issues/1137)) ([d98f729](https://github.com/kufu/smarthr-ui/commit/d98f7293b535b215237365fb87ce67004348175f))
* add box-sizing: border-box to textarea ([#1060](https://github.com/kufu/smarthr-ui/issues/1060)) ([14e8f06](https://github.com/kufu/smarthr-ui/commit/14e8f06d2fc796b268fdac2fdc79681b797b067d))
* add optional chaining to _isChildPortal ([#1236](https://github.com/kufu/smarthr-ui/issues/1236)) ([6258036](https://github.com/kufu/smarthr-ui/commit/6258036bda429340b23abbbd0e67aa59e3560cc9))
* add type props to button ([#1086](https://github.com/kufu/smarthr-ui/issues/1086)) ([f603a16](https://github.com/kufu/smarthr-ui/commit/f603a16e680e6e025ddf2c95095eb2799dd82ed6))
* change disabled props to transient props ([#1092](https://github.com/kufu/smarthr-ui/issues/1092)) ([1af1390](https://github.com/kufu/smarthr-ui/commit/1af13904e73a827f74065975b2c803ed7278a638))
* change full-width space to half-width ([#1201](https://github.com/kufu/smarthr-ui/issues/1201)) ([889aa2b](https://github.com/kufu/smarthr-ui/commit/889aa2beac63b458504ff4c9613d203f4f1f3a7e))
* change loader animation ([#1173](https://github.com/kufu/smarthr-ui/issues/1173)) ([abddc8f](https://github.com/kufu/smarthr-ui/commit/abddc8f99190e585647a330f5d9ae877ac4ad8ae)), closes [/github.com/kufu/smarthr-ui/pull/1173#discussion_r532369303](https://github.com/kufu//github.com/kufu/smarthr-ui/pull/1173/issues/discussion_r532369303)
* change the minimum value of from props in the calendar component ([#1122](https://github.com/kufu/smarthr-ui/issues/1122)) ([5718806](https://github.com/kufu/smarthr-ui/commit/57188066ad7edda3632bd4591d94e7e6c6a0c362))
* change theme props to transient props ([#1081](https://github.com/kufu/smarthr-ui/issues/1081)) ([960bc98](https://github.com/kufu/smarthr-ui/commit/960bc980ac7d89ad7e3c953cb8ab90b109d88636))
* change to add aria-label to icon ([#1110](https://github.com/kufu/smarthr-ui/issues/1110)) ([3254aef](https://github.com/kufu/smarthr-ui/commit/3254aef5bd62aa88b7fd687798807f040ecd6dbc))
* change width props to temporary props ([#1089](https://github.com/kufu/smarthr-ui/issues/1089)) ([44bbe36](https://github.com/kufu/smarthr-ui/commit/44bbe364c8d7b5634dec738a2627b24d78caac5d))
* checkboxLabel where the label contains a "div" and "p" ([#1083](https://github.com/kufu/smarthr-ui/issues/1083)) ([96e6b69](https://github.com/kufu/smarthr-ui/commit/96e6b69e7d71d96f7d223f6dbe03569f10f45c0f))
* DatePicker bugs ([#1091](https://github.com/kufu/smarthr-ui/issues/1091)) ([11edaab](https://github.com/kufu/smarthr-ui/commit/11edaabc7b99e1b7e97eb0b636e1786e3a31ef12))
* dialog focus management ([#889](https://github.com/kufu/smarthr-ui/issues/889)) ([b9fde13](https://github.com/kufu/smarthr-ui/commit/b9fde131af353180fe7742fb34d9a65648bd8b22))
* improve accessibility of MultiComboBox (SHRUI-207) ([#1187](https://github.com/kufu/smarthr-ui/issues/1187)) ([db30633](https://github.com/kufu/smarthr-ui/commit/db30633601ba48d69c8ad26bd87a914c7f6c4172))
* improve role of infomationpanel ([#1205](https://github.com/kufu/smarthr-ui/issues/1205)) ([116a3c4](https://github.com/kufu/smarthr-ui/commit/116a3c4b5e05bfae21ac992d049ff0235ec843e5))
* invalid html attribute ([#1095](https://github.com/kufu/smarthr-ui/issues/1095)) ([bb85bac](https://github.com/kufu/smarthr-ui/commit/bb85bac2df1a26e717010385a2a7e096ac3d444e))
* invalid html attribute ([#1106](https://github.com/kufu/smarthr-ui/issues/1106)) ([8732440](https://github.com/kufu/smarthr-ui/commit/87324403a7501c86e84386db60e7cf983a441532))
* make StatusLabel vertical center alignment  ([#879](https://github.com/kufu/smarthr-ui/issues/879)) ([34cc429](https://github.com/kufu/smarthr-ui/commit/34cc429d255a95c67ee7cc53875a25c1ef5899f5))
* modify auto format of CurrencyInput (SHRUI-145) ([#1143](https://github.com/kufu/smarthr-ui/issues/1143)) ([266a0bc](https://github.com/kufu/smarthr-ui/commit/266a0bc2cc11922addafffeec560bf234603236f))
* modify not to apply hover-style to Checkbox when hover over a disabled CheckboxLabel ([#1136](https://github.com/kufu/smarthr-ui/issues/1136)) ([0c662a3](https://github.com/kufu/smarthr-ui/commit/0c662a3f803513941df4e375dc4700888a38b520))
* pass undefined to accept instead of blank string ([#1121](https://github.com/kufu/smarthr-ui/issues/1121)) ([514d569](https://github.com/kufu/smarthr-ui/commit/514d569b38d27eaf8bdc590f7e961f6c52ace6ca))
* refactor Dropdown (SHRUI-221) ([#1126](https://github.com/kufu/smarthr-ui/issues/1126)) ([0b77df6](https://github.com/kufu/smarthr-ui/commit/0b77df6909d4f6dcb624463c9343c746a5587883))
* remove that blank optgroup is displayed for IE ([#1186](https://github.com/kufu/smarthr-ui/issues/1186)) ([06dc2db](https://github.com/kufu/smarthr-ui/commit/06dc2db71ef578e32ac783fb062dfc62baf02c2a))
* replace defaultPalette (SHRUI-233) ([#1153](https://github.com/kufu/smarthr-ui/issues/1153)) ([b323bd5](https://github.com/kufu/smarthr-ui/commit/b323bd584ea5c679e0e3d21cccc48072aa402cfc))
* replace div in button with span ([#1084](https://github.com/kufu/smarthr-ui/issues/1084)) ([8f1ed53](https://github.com/kufu/smarthr-ui/commit/8f1ed5304528bd1161d5429188bb903df096cddb))
* replace figurein button with span ([#1082](https://github.com/kufu/smarthr-ui/issues/1082)) ([4c0188f](https://github.com/kufu/smarthr-ui/commit/4c0188f32396f19cccbba9a20d5e9dbeda84f802))
* shifting of index when IndexNav's ListItem is inserted into a new line ([#1138](https://github.com/kufu/smarthr-ui/issues/1138)) ([6222f57](https://github.com/kufu/smarthr-ui/commit/6222f576824f5c108699b9a7613fd1f27f46d469))
* update package.json ([#1224](https://github.com/kufu/smarthr-ui/issues/1224)) ([976fb89](https://github.com/kufu/smarthr-ui/commit/976fb89f506bf83da309fcf606fe2fb08d321438))
* アコーディオンパネルの展開時に overflow を既定値に戻す ([#1125](https://github.com/kufu/smarthr-ui/issues/1125)) ([8d8069b](https://github.com/kufu/smarthr-ui/commit/8d8069b05672165943ef17080c17696108a17872))

## [11.2.0](https://github.com/kufu/smarthr-ui/compare/v11.1.0...v11.2.0) (2020-11-26)


### Features

* add Shin color (SHRUI-227) ([#1141](https://github.com/kufu/smarthr-ui/issues/1141)) ([#1154](https://github.com/kufu/smarthr-ui/issues/1154)) ([db08ce4](https://github.com/kufu/smarthr-ui/commit/db08ce47b2fb2eb8985b295e9470974842ee948a))

## [11.1.0](https://github.com/kufu/smarthr-ui/compare/v11.0.0-0...v11.1.0) (2020-10-28)


### Features

* add InputFIle (SHRUI-156) ([#1066](https://github.com/kufu/smarthr-ui/issues/1066)) ([0c92755](https://github.com/kufu/smarthr-ui/commit/0c92755393dade4810b6f8e73061e88f8bffdafb))


### Bug Fixes

* a11y of Dropdown (SHRUI-180) ([#1050](https://github.com/kufu/smarthr-ui/issues/1050)) ([a413acf](https://github.com/kufu/smarthr-ui/commit/a413acf50fb8ae3abea69bcd775ea60c396ecc0b))
* apply changes of release v11.0.0 ([#1090](https://github.com/kufu/smarthr-ui/issues/1090)) ([9cf6ded](https://github.com/kufu/smarthr-ui/commit/9cf6ded78a5cb2437eccb354122f3ca7b4d4a584)), closes [#1085](https://github.com/kufu/smarthr-ui/issues/1085) [#1087](https://github.com/kufu/smarthr-ui/issues/1087)
* change Cell height ([#976](https://github.com/kufu/smarthr-ui/issues/976)) ([0ad828c](https://github.com/kufu/smarthr-ui/commit/0ad828c725ce91d9d42939c6a608ac236c85c630))
* change SmartHR Logo props to temporary props ([#1094](https://github.com/kufu/smarthr-ui/issues/1094)) ([91b509a](https://github.com/kufu/smarthr-ui/commit/91b509a1e2a1b13ea53afbabc84f480d116fb4c9))
* change tag of calendar component ([#1088](https://github.com/kufu/smarthr-ui/issues/1088)) ([ba87935](https://github.com/kufu/smarthr-ui/commit/ba87935cf3ffad2f987a4e62df9fe60b70761561))
* change tertiary link in Bottom Fixed Area to correct HTML ([#1065](https://github.com/kufu/smarthr-ui/issues/1065)) ([b023dfd](https://github.com/kufu/smarthr-ui/commit/b023dfd860fa258854f416279514e82d1cb3f6fc))
* change theme props to transient props ([#1069](https://github.com/kufu/smarthr-ui/issues/1069)) ([beaff5c](https://github.com/kufu/smarthr-ui/commit/beaff5cad6ca3a908dbdbd6cb4c8af31799b8d1a))
* change to see the content overflowing in the vertical direction of MessageScreen ([#1058](https://github.com/kufu/smarthr-ui/issues/1058)) ([773fd15](https://github.com/kufu/smarthr-ui/commit/773fd15631be8a9f279a98742c492b0bfc052614))
* change to unify the notation in the README ([#1068](https://github.com/kufu/smarthr-ui/issues/1068)) ([c8e515c](https://github.com/kufu/smarthr-ui/commit/c8e515c9a17f551f42b30499924acad8a986aec0))
* enable to use MultiComboBox on Dropdown ([#1067](https://github.com/kufu/smarthr-ui/issues/1067)) ([0d9fe7f](https://github.com/kufu/smarthr-ui/commit/0d9fe7fb2c63fd5dcdf947f2f43b46f856254537))
* support webpack v5 ([#1057](https://github.com/kufu/smarthr-ui/issues/1057)) ([3d8d14e](https://github.com/kufu/smarthr-ui/commit/3d8d14ee9d1ae19f051cad95a57156370a5168c1))

## [11.0.0](https://github.com/kufu/smarthr-ui/compare/v11.0.0-1...v11.0.0) (2020-10-22)

## [11.0.0-1](https://github.com/kufu/smarthr-ui/compare/v11.0.0-0...v11.0.0-1) (2020-10-21)


### Bug Fixes

* calculate Calendar position in DatePicker (SHRUI-212) ([#1085](https://github.com/kufu/smarthr-ui/issues/1085)) ([eeb9bda](https://github.com/kufu/smarthr-ui/commit/eeb9bda4b144705d6681658f1b1a7e5c46ea4fdf))
* consider reset css in BackgroundJobsPanel (SHRUI-213) ([#1087](https://github.com/kufu/smarthr-ui/issues/1087)) ([9bbc279](https://github.com/kufu/smarthr-ui/commit/9bbc27998d9bec16a4fc0acaaa6cd639a595e8c3))

## [11.0.0-0](https://github.com/kufu/smarthr-ui/compare/v10.0.0...v11.0.0-0) (2020-10-12)


### ⚠ BREAKING CHANGES

* change props of DatePicker drastically, and remove
parsing error.

* fix: typo

* fix: ref in custom hook

* docs: update README
* Remove id property from Tooltip component

* fix: change prefix to sequence number

### Features

* add BackgroundJobsPanel (SHRUI-116) ([#975](https://github.com/kufu/smarthr-ui/issues/975)) ([9a1ae65](https://github.com/kufu/smarthr-ui/commit/9a1ae659086ed31abbb9387178031a9cd39dd7f9))
* add SegmentedControl (SHRUI-115) ([#949](https://github.com/kufu/smarthr-ui/issues/949)) ([36ea094](https://github.com/kufu/smarthr-ui/commit/36ea094cf1f2dd5b426d53153b04c9bcbc3af9d5))
* add style for visually hidden ([#963](https://github.com/kufu/smarthr-ui/issues/963)) ([fda4ccf](https://github.com/kufu/smarthr-ui/commit/fda4ccf5e72957c8070f1009aefb4bb14f140515))
* add useId hook and remove id property from Tooltip ([#974](https://github.com/kufu/smarthr-ui/issues/974)) ([f638d6b](https://github.com/kufu/smarthr-ui/commit/f638d6b4bb14450640f90b580218793e27843df7))
* add visually hidden text for some components ([#1016](https://github.com/kufu/smarthr-ui/issues/1016)) ([39c85c7](https://github.com/kufu/smarthr-ui/commit/39c85c7e83bb3af461c082ac4245b1299aa955ce))
* change addon order ([#1041](https://github.com/kufu/smarthr-ui/issues/1041)) ([29bde4c](https://github.com/kufu/smarthr-ui/commit/29bde4c33390ecb520c912ec4643dd801213403a))
* create shadow theme ([#1004](https://github.com/kufu/smarthr-ui/issues/1004)) ([e194e01](https://github.com/kufu/smarthr-ui/commit/e194e017626337638a9af7645f7034f47193e737))
* create zIndex theme ([#1026](https://github.com/kufu/smarthr-ui/issues/1026)) ([0f190ab](https://github.com/kufu/smarthr-ui/commit/0f190ab99476b3620298436b6a3571bed988144a))


### Bug Fixes

* a11y of Calendar ([#1035](https://github.com/kufu/smarthr-ui/issues/1035)) ([45ed373](https://github.com/kufu/smarthr-ui/commit/45ed37332868a8f5df68449a96c8e8de68d42c10))
* add ARIA attributes into Pagination ([#1032](https://github.com/kufu/smarthr-ui/issues/1032)) ([32f1e3f](https://github.com/kufu/smarthr-ui/commit/32f1e3f25fca91ffd0525e4e80dffa6e223dc974))
* add aria-label to MessageScreen ([#1018](https://github.com/kufu/smarthr-ui/issues/1018)) ([ef56e37](https://github.com/kufu/smarthr-ui/commit/ef56e377984e8c199ca7eaa5156f1b4f5df26406))
* add aria-label to SmartHR Logo ([#1019](https://github.com/kufu/smarthr-ui/issues/1019)) ([5507618](https://github.com/kufu/smarthr-ui/commit/55076180a67f542b05e48ad13db73badd95dda56))
* add blank optgroup for not omitting labels for Mobile Safari ([#979](https://github.com/kufu/smarthr-ui/issues/979)) ([87eaa1b](https://github.com/kufu/smarthr-ui/commit/87eaa1b59ceddefccab713da68c931e683962d11))
* add css to show disabled input value ([#1028](https://github.com/kufu/smarthr-ui/issues/1028)) ([1547580](https://github.com/kufu/smarthr-ui/commit/154758027b2bf29d9524ef7f00f1d6adadaa850c))
* add role attribute and visually hidden text ([#1015](https://github.com/kufu/smarthr-ui/issues/1015)) ([536e304](https://github.com/kufu/smarthr-ui/commit/536e30470e5b413ca14bedc4cf644ad9a7c6112f))
* add role attribute to tooltip ([#1045](https://github.com/kufu/smarthr-ui/issues/1045)) ([d67fb3d](https://github.com/kufu/smarthr-ui/commit/d67fb3d1523e1e8a42ba42428591cb7d20e3a4ab))
* change not to add aria-expanded when InformationPanel has no toggle button ([#1046](https://github.com/kufu/smarthr-ui/issues/1046)) ([ffe8652](https://github.com/kufu/smarthr-ui/commit/ffe8652782bd36015787f8e8700a8a5f3353ac04))
* DatePicker (SHRUI-178) ([#1027](https://github.com/kufu/smarthr-ui/issues/1027)) ([3c94f19](https://github.com/kufu/smarthr-ui/commit/3c94f19211b4db465267411e1f6ff2a3d10125e8))
* enable to ignore Icon what has no labels (SHRUI-148) ([#1031](https://github.com/kufu/smarthr-ui/issues/1031)) ([bf12672](https://github.com/kufu/smarthr-ui/commit/bf126727d59754be102932a1b4ac0f2d78cd2358))
* fix styles of Calendar when using reset style ([#973](https://github.com/kufu/smarthr-ui/issues/973)) ([3e790b2](https://github.com/kufu/smarthr-ui/commit/3e790b255b38414e3681ed6c4d84253f8b33a9e7))
* move frame styles to Wrapper ([#985](https://github.com/kufu/smarthr-ui/issues/985)) ([b9de4e4](https://github.com/kufu/smarthr-ui/commit/b9de4e4f607e4a352e43ce17512be9c48d35afe2))
* nested Dropdown ([#1003](https://github.com/kufu/smarthr-ui/issues/1003)) ([6f648df](https://github.com/kufu/smarthr-ui/commit/6f648df61d3e2140a156f0692f866d9be3901fb9))
* stylelint ([#1034](https://github.com/kufu/smarthr-ui/issues/1034)) ([a6a23e4](https://github.com/kufu/smarthr-ui/commit/a6a23e46161023d59d7841bbbc76df480f4cd61f))
* update font-family ([#930](https://github.com/kufu/smarthr-ui/issues/930)) ([ff7c7f3](https://github.com/kufu/smarthr-ui/commit/ff7c7f3a64f170ea76fdc94ab57dea4dc4c90ad8))

## [10.1.0](https://github.com/kufu/smarthr-ui/compare/v10.0.0...v10.1.0) (2020-11-24)


### Features

* backport Shin Color to v10 (SHRUI-232) ([#1155](https://github.com/kufu/smarthr-ui/issues/1155)) ([1b551e1](https://github.com/kufu/smarthr-ui/commit/1b551e107674209966083cbacf89ccc6a11b4a3b)), closes [#1141](https://github.com/kufu/smarthr-ui/issues/1141)

## [10.0.0](https://github.com/kufu/smarthr-ui/compare/v9.3.0...v10.0.0) (2020-08-31)


### ⚠ BREAKING CHANGES

* reconsider border radius of theme (#849)
* Tooltip become portal, and become to require id property

### Features

* add DatePicker ([#910](https://github.com/kufu/smarthr-ui/issues/910)) ([8e400fc](https://github.com/kufu/smarthr-ui/commit/8e400fca421517b139ba12f8fb21e98f56f688a9))
* added SVGAttributes and role attributes to props ([#909](https://github.com/kufu/smarthr-ui/issues/909)) ([d975191](https://github.com/kufu/smarthr-ui/commit/d975191b9432663828ec8216932f00a5f253fe43))


### Bug Fixes

* add role in FlashMessage ([#940](https://github.com/kufu/smarthr-ui/issues/940)) ([56e1e2e](https://github.com/kufu/smarthr-ui/commit/56e1e2e8e22a6b01689f6c8d819f301bf09a25cf))
* reconsider border radius of theme ([#849](https://github.com/kufu/smarthr-ui/issues/849)) ([02e21ca](https://github.com/kufu/smarthr-ui/commit/02e21caae2a77adc61b17200c895a48c4a73c7af))


* BREAKING CHANGE: change Tooltip to portal (#900) ([b4a3a9d](https://github.com/kufu/smarthr-ui/commit/b4a3a9d20a71793b479b6f988ac4833871753660)), closes [#900](https://github.com/kufu/smarthr-ui/issues/900)

## [9.4.0](https://github.com/kufu/smarthr-ui/compare/v9.3.0...v9.4.0) (2020-11-26)


### Features

* backport Shin Color to v9 (SHRUI-232) ([#1156](https://github.com/kufu/smarthr-ui/issues/1156)) ([88ff431](https://github.com/kufu/smarthr-ui/commit/88ff431c056aec6f6a8fd0872226d3b55c77b1e5)), closes [#1141](https://github.com/kufu/smarthr-ui/issues/1141)

## [9.3.0](https://github.com/kufu/smarthr-ui/compare/v9.2.0...v9.3.0) (2020-08-11)


### Features

* add maxlength attribute and text counter to textarea ([#877](https://github.com/kufu/smarthr-ui/issues/877)) ([9ae5142](https://github.com/kufu/smarthr-ui/commit/9ae5142bb4f766a6f0a2c1e0488f710e10fd0366))


### Bug Fixes

* add necessary dependencies of hooks ([#906](https://github.com/kufu/smarthr-ui/issues/906)) ([a14e2c0](https://github.com/kufu/smarthr-ui/commit/a14e2c0adae7853d1ba153ef9215519e67eecd8f))
* fix applying className ([#890](https://github.com/kufu/smarthr-ui/issues/890)) ([a950f0c](https://github.com/kufu/smarthr-ui/commit/a950f0c2e9cd1b3a9cd82cf7dc0c71ce97d5afec))
* TabBar for IE support ([#854](https://github.com/kufu/smarthr-ui/issues/854)) ([adb0fc3](https://github.com/kufu/smarthr-ui/commit/adb0fc3cf0715e36b19e0ce05f5824d1b556281e))
* typographical error ([#920](https://github.com/kufu/smarthr-ui/issues/920)) ([0e30876](https://github.com/kufu/smarthr-ui/commit/0e30876b50f5c34a67e661b0b35d85013394c9f6))
* width for input element in Input ([#905](https://github.com/kufu/smarthr-ui/issues/905)) ([b77046f](https://github.com/kufu/smarthr-ui/commit/b77046fdc221ba07c814714104735e2f4ae996a1))

## [9.2.0](https://github.com/kufu/smarthr-ui/compare/v9.1.0...v9.2.0) (2020-07-15)


### Features

* add affixes into Input ([#851](https://github.com/kufu/smarthr-ui/issues/851)) ([f95c8ec](https://github.com/kufu/smarthr-ui/commit/f95c8ecbad568fe4739b4a3dd927722109375be8))
* add Calendar component ([#832](https://github.com/kufu/smarthr-ui/issues/832)) ([0990e38](https://github.com/kufu/smarthr-ui/commit/0990e38d8f8716795e0c82599245625412574c61))
* add IndexNav component ([#838](https://github.com/kufu/smarthr-ui/issues/838)) ([6ce3c6a](https://github.com/kufu/smarthr-ui/commit/6ce3c6a43ecc1a5a429566402e8d60aaba19f9fd))


### Bug Fixes

* add className props to RightFixedNote and RightFixedNoteItem ([#865](https://github.com/kufu/smarthr-ui/issues/865)) ([a861eed](https://github.com/kufu/smarthr-ui/commit/a861eed4f20205a882d7cd7580fd2099d33d91da))
* change flex to long-hand in FlashMessage ([#852](https://github.com/kufu/smarthr-ui/issues/852)) ([e2817e1](https://github.com/kufu/smarthr-ui/commit/e2817e16b0a10da954b3cce614fc77fb0579eeb8))
* change not to pass unnecessary props to Background ([#862](https://github.com/kufu/smarthr-ui/issues/862)) ([9dd9c2f](https://github.com/kufu/smarthr-ui/commit/9dd9c2f905a5738dfeef987f9044db2b0052a8af))
* change not to use rowSpan=0 ([#861](https://github.com/kufu/smarthr-ui/issues/861)) ([6f829c0](https://github.com/kufu/smarthr-ui/commit/6f829c02fccaf06f6acd92953a84654320be863c))
* correct ms-expand of Select ([#853](https://github.com/kufu/smarthr-ui/issues/853)) ([9b2811b](https://github.com/kufu/smarthr-ui/commit/9b2811bf72d123a052310e83b8eb4a0e89b7b94c))
* fix calendar date in storybook ([#863](https://github.com/kufu/smarthr-ui/issues/863)) ([f4bac46](https://github.com/kufu/smarthr-ui/commit/f4bac461689f135d6a50c5a183171e924f1c4a08))
* position shift of scrollable DropdownContent ([#841](https://github.com/kufu/smarthr-ui/issues/841)) ([07786eb](https://github.com/kufu/smarthr-ui/commit/07786eb8a2ca7da579d001def098f47bec8b1bab))
* validate tags in RadioButton/RadioButtonLabel ([#837](https://github.com/kufu/smarthr-ui/issues/837)) ([21c10d8](https://github.com/kufu/smarthr-ui/commit/21c10d8eef56f95a283ce2ab6854d0198868501b))

## [9.1.0](https://github.com/kufu/smarthr-ui/compare/v9.0.2...v9.1.0) (2020-06-17)


### Features

* add currency mode into Input ([#822](https://github.com/kufu/smarthr-ui/issues/822)) ([0cd3c32](https://github.com/kufu/smarthr-ui/commit/0cd3c323884a706891b0ec4f7e0ab35c1f2c7840))
* add FilterDropdown ([#825](https://github.com/kufu/smarthr-ui/issues/825)) ([b2e94fc](https://github.com/kufu/smarthr-ui/commit/b2e94fc01579b41d5c6b13280023b97783935d15))


### Bug Fixes

* change cache key ([#831](https://github.com/kufu/smarthr-ui/issues/831)) ([abec6b7](https://github.com/kufu/smarthr-ui/commit/abec6b7e4d242dad552e5d37815478a31883cbf9))

### [9.0.2](https://github.com/kufu/smarthr-ui/compare/v9.0.1...v9.0.2) (2020-06-10)


### Bug Fixes

* pass other props to AppNaviCustomTag ([#829](https://github.com/kufu/smarthr-ui/issues/829)) ([77b260b](https://github.com/kufu/smarthr-ui/commit/77b260b8653e7321fdfad56e800002185bf8cc26))

### [9.0.1](https://github.com/kufu/smarthr-ui/compare/v9.0.0...v9.0.1) (2020-06-10)


### Bug Fixes

* fix props type for AppNavi ([#828](https://github.com/kufu/smarthr-ui/issues/828)) ([57ff40b](https://github.com/kufu/smarthr-ui/commit/57ff40b1404187c8ff91fb100b05f6a4777e419c))
* use stylelint-config-smarthr for stylelint ([#806](https://github.com/kufu/smarthr-ui/issues/806)) ([b25debd](https://github.com/kufu/smarthr-ui/commit/b25debd5a1d677953258f21e1e10a574f099c3f3))

## [9.0.0](https://github.com/kufu/smarthr-ui/compare/v8.4.0...v9.0.0) (2020-06-09)


### ⚠ BREAKING CHANGES

* it is no longer disabled by default when passing true for current props
* feat: add buttons props types for AppNavi component
* fix: add AppNavi test
* fix: add README of AppNavi
* feat: add disabled props for AppNavi items
* remove background color from TabBar

* fix: remove background color

* test: update snapshot

### Features

* add buttons props types for AppNavi component ([#826](https://github.com/kufu/smarthr-ui/issues/826)) ([ed3a138](https://github.com/kufu/smarthr-ui/commit/ed3a1388fd20cd528301bc1857d0d58fd1b7f3e9))
* add togglable option in InformationPanel ([#817](https://github.com/kufu/smarthr-ui/issues/817)) ([5df6953](https://github.com/kufu/smarthr-ui/commit/5df695383e927f96b7750f4ca5ad0c9df277c039))


### Bug Fixes

* fix typo Heading default type ([#815](https://github.com/kufu/smarthr-ui/issues/815)) ([2b54b88](https://github.com/kufu/smarthr-ui/commit/2b54b88774aa54708b47746ee780eee3b8131af2))
* improve TextButton broder-color to transparent ([#813](https://github.com/kufu/smarthr-ui/issues/813)) ([299de50](https://github.com/kufu/smarthr-ui/commit/299de504d56b8da68819b1c71fcd102580b16880))
* lower 'th' details in 'Table' ([#816](https://github.com/kufu/smarthr-ui/issues/816)) ([0dcf86a](https://github.com/kufu/smarthr-ui/commit/0dcf86ae4ab351441247a5ca8ef08096982848c0))
* remove background color from TabBar ([#820](https://github.com/kufu/smarthr-ui/issues/820)) ([4ea3e8f](https://github.com/kufu/smarthr-ui/commit/4ea3e8fea6ff1c05ce538ab2f9d2a10697dde8e2))

## [8.4.0](https://github.com/kufu/smarthr-ui/compare/v8.3.0...v8.4.0) (2020-06-03)


### Features

* Add BottomFixedArea component ([#777](https://github.com/kufu/smarthr-ui/issues/777)) ([486bb57](https://github.com/kufu/smarthr-ui/commit/486bb5768f07739b518a928021c0d81671f3772f))


### Bug Fixes

* scrollbar visibility in dropdown ([#805](https://github.com/kufu/smarthr-ui/issues/805)) ([a173cbf](https://github.com/kufu/smarthr-ui/commit/a173cbfd44b2ceb1c318a491564202addafce094))

## [8.3.0](https://github.com/kufu/smarthr-ui/compare/v8.2.0...v8.3.0) (2020-05-28)


### Features

* add aria attribute ([#788](https://github.com/kufu/smarthr-ui/issues/788)) ([c936320](https://github.com/kufu/smarthr-ui/commit/c936320a1a775cecb2b858a3a758393c134804f1))
* add labelSuffix props to FieldSet component ([#769](https://github.com/kufu/smarthr-ui/issues/769)) ([01eea8b](https://github.com/kufu/smarthr-ui/commit/01eea8be4770edb3f1d4c3e07df0a5631b4307cb))
* add MessageScreen Component ([#768](https://github.com/kufu/smarthr-ui/issues/768)) ([fb9a27e](https://github.com/kufu/smarthr-ui/commit/fb9a27ebffbab7abd2a23c125d3dd963a50e5771))
* add width and height props to SmartHRLogo ([#767](https://github.com/kufu/smarthr-ui/issues/767)) ([3c93eb2](https://github.com/kufu/smarthr-ui/commit/3c93eb23bec6191af18e8c9f89a98c6edd37728b))
* fade out Dialog component ([#776](https://github.com/kufu/smarthr-ui/issues/776)) ([9adc249](https://github.com/kufu/smarthr-ui/commit/9adc249297b31b8c2e282be5108f19fbe2f1eeea))
* nullable cell option ([#754](https://github.com/kufu/smarthr-ui/issues/754)) ([b16624d](https://github.com/kufu/smarthr-ui/commit/b16624da16ad74708c88374aa0ed52bf9b291b21))


### Bug Fixes

* button style ([#790](https://github.com/kufu/smarthr-ui/issues/790)) ([6ab20b7](https://github.com/kufu/smarthr-ui/commit/6ab20b71696ca7a89d8a0f4b716ad07a1529f285))
* enable multiple error messages for FieldSet ([#782](https://github.com/kufu/smarthr-ui/issues/782)) ([6a37c72](https://github.com/kufu/smarthr-ui/commit/6a37c72e5d16b9abb9c72997c09df0b3a624ac35))
* round the corners of table on base ([#766](https://github.com/kufu/smarthr-ui/issues/766)) ([affc1f9](https://github.com/kufu/smarthr-ui/commit/affc1f93b7a5ff4fe7f2590c8ce931fef17b66ad))
* set appear animation for Dialog ([#792](https://github.com/kufu/smarthr-ui/issues/792)) ([e6c992b](https://github.com/kufu/smarthr-ui/commit/e6c992ba6a8a274be4700b0de3ee28fcec642917))

## [8.2.0](https://github.com/kufu/smarthr-ui/compare/v8.1.0...v8.2.0) (2020-05-07)


### Features

* add tooltip component ([#738](https://github.com/kufu/smarthr-ui/issues/738)) ([dc1e2ee](https://github.com/kufu/smarthr-ui/commit/dc1e2eec09ae5d6801ed65f5df862d463a0af0f7))


### Bug Fixes

* Fix the polished version ([#765](https://github.com/kufu/smarthr-ui/issues/765)) ([bddfaab](https://github.com/kufu/smarthr-ui/commit/bddfaab037fac19bfed915356ab01a97c4005b93))
* change SecondaryButton disabled style ([#757](https://github.com/kufu/smarthr-ui/issues/757)) ([d3c2ba1](https://github.com/kufu/smarthr-ui/commit/d3c2ba1540ed4a67922a695d25f552027257c263))
* change storybook dropdown style ([#740](https://github.com/kufu/smarthr-ui/issues/740)) ([20ee9e8](https://github.com/kufu/smarthr-ui/commit/20ee9e83f17baafcf78eb04e6bf4b79f2dc284a3))

## [8.1.0](https://github.com/kufu/smarthr-ui/compare/v8.0.0...v8.1.0) (2020-04-30)


### Features

* add DropZone component ([#719](https://github.com/kufu/smarthr-ui/issues/719)) ([67942a0](https://github.com/kufu/smarthr-ui/commit/67942a08c697c604e4e3e411a1d0e9008cf12c33))


### Bug Fixes

* change Footer base color ([#748](https://github.com/kufu/smarthr-ui/issues/748)) ([ab6ecf6](https://github.com/kufu/smarthr-ui/commit/ab6ecf69ac3f27a61c3d9b15a86a7b2fb6dbfcb7))
* Change header color ([#753](https://github.com/kufu/smarthr-ui/issues/753)) ([43e4e8a](https://github.com/kufu/smarthr-ui/commit/43e4e8a97af7f75206d2a2effbe89168d92a94bf))
* change storybook loader color ([#730](https://github.com/kufu/smarthr-ui/issues/730)) ([f2aed10](https://github.com/kufu/smarthr-ui/commit/f2aed10614e393fa22d9fd4ea76016696c839a4a))
* dropdown scroll area height for ie ([#756](https://github.com/kufu/smarthr-ui/issues/756)) ([4d52204](https://github.com/kufu/smarthr-ui/commit/4d52204af0c1c5893e944ded9966587cc57b71a7))
* fix styles for FlashMessage component ([#726](https://github.com/kufu/smarthr-ui/issues/726)) ([d6b8eae](https://github.com/kufu/smarthr-ui/commit/d6b8eaef9ec2322a266da1593629b329e19a00fb))

## [8.0.0](https://github.com/kufu/smarthr-ui/compare/v7.1.0...v8.0.0) (2020-04-09)


### ⚠ BREAKING CHANGES

* dark property for CheckBox and CheckBoxLable will no longer work
* dark property for RadioButton will no longer work
* The scroll area is no longer automatically allocated.

### Features

* add scroller component for Dropdown ([#720](https://github.com/kufu/smarthr-ui/issues/720)) ([3c9d5b5](https://github.com/kufu/smarthr-ui/commit/3c9d5b5a6409999fec0c6bf966566981bf570dd1))
* update .node-version ([#728](https://github.com/kufu/smarthr-ui/issues/728)) ([e9102d5](https://github.com/kufu/smarthr-ui/commit/e9102d564f11b25f4c64015f1936553932b3fe00))


### Bug Fixes

* fix checkbox style ([#724](https://github.com/kufu/smarthr-ui/issues/724)) ([478d488](https://github.com/kufu/smarthr-ui/commit/478d488cceab265055e591659733474e619130c4))
* radio button style ([#722](https://github.com/kufu/smarthr-ui/issues/722)) ([4a81272](https://github.com/kufu/smarthr-ui/commit/4a812723f095fc0e59abb756c7f42f3708684f5b))
* remove dark property from RadioButton component ([#725](https://github.com/kufu/smarthr-ui/issues/725)) ([f3f70ee](https://github.com/kufu/smarthr-ui/commit/f3f70ee466a504727b5f851a3ed09f156f1208ad))
* tweak arrow size for Ballloon component([#723](https://github.com/kufu/smarthr-ui/issues/723)) ([ae5287f](https://github.com/kufu/smarthr-ui/commit/ae5287f93214908530465dce4c10134e36e9e058))

## [7.1.0](https://github.com/kufu/smarthr-ui/compare/v7.0.0...v7.1.0) (2020-04-03)


### Features

* add scrollable props for DropdownContent ([#710](https://github.com/kufu/smarthr-ui/issues/710)) ([9559404](https://github.com/kufu/smarthr-ui/commit/9559404c6a6308bee9982d077a93b6d236250a95))
* add textarea component ([#683](https://github.com/kufu/smarthr-ui/issues/683)) ([2852d43](https://github.com/kufu/smarthr-ui/commit/2852d43cfe398565919d86c36c46c3328b50329c))


### Bug Fixes

* change AppNaviButton style ([#697](https://github.com/kufu/smarthr-ui/issues/697)) ([25a9729](https://github.com/kufu/smarthr-ui/commit/25a97290a90bec2a191620d42acb80f2e9cd7067))
* change label text color in RadioButtonLabel and CheckBoxLabel ([#698](https://github.com/kufu/smarthr-ui/issues/698)) ([969861f](https://github.com/kufu/smarthr-ui/commit/969861f4ebb9a0c99ce4c6bcbaa6a6f9ad67db2d))
* fix that some styles doesn’t work ([#705](https://github.com/kufu/smarthr-ui/issues/705)) ([f6f75a6](https://github.com/kufu/smarthr-ui/commit/f6f75a6eb78ceee5d9c00ac82264073655ea7ac6))

## [7.0.0](https://github.com/kufu/smarthr-ui/compare/v6.2.0...v7.0.0) (2020-03-18)


### ⚠ BREAKING CHANGES

* change several icon names

### Features

* introduce Footer component ([#686](https://github.com/kufu/smarthr-ui/issues/686)) ([09da7a4](https://github.com/kufu/smarthr-ui/commit/09da7a4b52bf13efcf773b8d0c9457a54188d2cd))


### Bug Fixes

* add align-items property to InformationPanel ([#672](https://github.com/kufu/smarthr-ui/issues/672)) ([1de95b7](https://github.com/kufu/smarthr-ui/commit/1de95b7a28329c70b7de95081858d5ebcb9ea224))
* add optgroup option for select ([#671](https://github.com/kufu/smarthr-ui/issues/671)) ([ebbff1d](https://github.com/kufu/smarthr-ui/commit/ebbff1d1afdb0e985a09a15823ac6a80f7baa5fd))
* avoid creating styled-components' instance dynamically ([#685](https://github.com/kufu/smarthr-ui/issues/685)) ([4adfa2a](https://github.com/kufu/smarthr-ui/commit/4adfa2a55f57a7aed6fb534aef204f0e189efd5f))
* dropdown content position ([#664](https://github.com/kufu/smarthr-ui/issues/664)) ([6bcf49b](https://github.com/kufu/smarthr-ui/commit/6bcf49b971fd11f41987ac208aae6a2372fc8faf))
* fix padding-right in Input ([#665](https://github.com/kufu/smarthr-ui/issues/665)) ([df24caf](https://github.com/kufu/smarthr-ui/commit/df24caf43c39cca3b7d791769b0617d68f7e5d96))
* fix padding-right in Input ([#665](https://github.com/kufu/smarthr-ui/issues/665)) ([c16d5ec](https://github.com/kufu/smarthr-ui/commit/c16d5ec728806c28805908acdb7ea7306d3b4d4c))
* fix typos ([#684](https://github.com/kufu/smarthr-ui/issues/684)) ([1bcd45b](https://github.com/kufu/smarthr-ui/commit/1bcd45ba7212823c20be42d750f726ea93555b9b))

## [6.3.0](https://github.com/kufu/smarthr-ui/compare/v6.2.0...v6.3.0) (2020-11-24)


### Features

* backport Shin Color to v6 (SHRUI-232) ([#1157](https://github.com/kufu/smarthr-ui/issues/1157)) ([f462116](https://github.com/kufu/smarthr-ui/commit/f462116007b047a7ce6c96679cbc8410a55523ea)), closes [#1141](https://github.com/kufu/smarthr-ui/issues/1141)

## [6.2.0](https://github.com/kufu/smarthr-ui/compare/v6.1.1...v6.2.0) (2020-02-13)


### Features

* add icon ([090d48c](https://github.com/kufu/smarthr-ui/commit/090d48ced891c50938a1f727fde682f472efae3c))
* add TBD stories ([#598](https://github.com/kufu/smarthr-ui/issues/598)) ([4c16fdc](https://github.com/kufu/smarthr-ui/commit/4c16fdc97e35c63c83220427c27cd968f965a01c))
* add TEXT_LINK to palette ([#597](https://github.com/kufu/smarthr-ui/issues/597)) ([abb8029](https://github.com/kufu/smarthr-ui/commit/abb8029d6fb21ee4bfa35ab27cfc3345aa77268b))


### Bug Fixes

* dropdown flickers ([#650](https://github.com/kufu/smarthr-ui/issues/650)) ([32ccc98](https://github.com/kufu/smarthr-ui/commit/32ccc985b45876a94a9f1a9e38e97b047175d89b))
* lint for InformationPanel ([f85e8af](https://github.com/kufu/smarthr-ui/commit/f85e8af5870087dc52c5116ff1303b9edf9c53cb))
* long title InformationPanel ([b9d47b5](https://github.com/kufu/smarthr-ui/commit/b9d47b5ee37438f546cd8665464fc6ff8f050e8e))

### [6.1.1](https://github.com/kufu/smarthr-ui/compare/v6.1.0...v6.1.1) (2020-01-21)


### Bug Fixes

* fix description of husky ([b7e8c7c](https://github.com/kufu/smarthr-ui/commit/b7e8c7cebb8749a203593582573b65de7efb18a9))

## [6.1.0](https://github.com/kufu/smarthr-ui/compare/v6.0.0...v6.1.0) (2020-01-20)


### Features

* change children prop type of Heading ([d27424f](https://github.com/kufu/smarthr-ui/commit/d27424f78cb66fa2e4de6566b8fcbf8022a1900f))
* change term prop type of DefinitionListItem ([b654ca0](https://github.com/kufu/smarthr-ui/commit/b654ca007a997d721e649a8f4c12bd798eb5e595))

## [6.0.0](https://github.com/kufu/smarthr-ui/compare/v5.0.0...v6.0.0) (2020-01-17)

### ⚠ BREAKING CHANGES

- change component name of Field to FieldSet([1dd912c](https://github.com/kufu/smarthr-ui/pull/579/commits/1dd912c6f352cbd3949e222c8c88e26d3e8bcd20))
- remove AppBar component([fe07d35](https://github.com/kufu/smarthr-ui/pull/574/commits/fe07d35979d08327d940626c04681a00006bfbaa))
- remove rowspan and colspan props from Cell([282c804](https://github.com/kufu/smarthr-ui/pull/575/commits/282c804eaa17ff405e3a4b8871b2ea93a7bf265a))
- end of support for Node v8([8942a77](https://github.com/kufu/smarthr-ui/pull/573/commits/8942a77bdedc801d492de063eeacd6385ff49cb0))

### Features

- add aria attributes ([d5b6cfd](https://github.com/kufu/smarthr-ui/commit/d5b6cfd6d8dd50143e95013e74f5973fab0020cc))
- add className props ([e8aacf4](https://github.com/kufu/smarthr-ui/commit/e8aacf471c7e42fbe993d4f9a925a15d209fd3ab))
- add defaultExpanded props ([b53f599](https://github.com/kufu/smarthr-ui/commit/b53f59999d9f06a99ca7276e5c8b30b703cd4726))
- add DescriptionList ([88bab82](https://github.com/kufu/smarthr-ui/commit/88bab825970839d3eed46e814c61d4f5fedd641f))
- Add DialogBase component ([#576](https://github.com/kufu/smarthr-ui/issues/576)) ([6f63757](https://github.com/kufu/smarthr-ui/commit/6f6375758fb33d233d3a396100407bfef545da2a))
- add font themes ([56a3fc6](https://github.com/kufu/smarthr-ui/commit/56a3fc6932760ad04acc93d9eb9c38407e44eb92))
- add HeadingTypes type into Heading ([cfd6d3a](https://github.com/kufu/smarthr-ui/commit/cfd6d3a7de37f81f3e06324a2f38c8cd62b7f28a))
- Add onClickOverlay props to to ActionDialog and MessageDialog ([c002fd1](https://github.com/kufu/smarthr-ui/commit/c002fd1049f76106dc137ee08fdc137f6a29c20b))
- add position provider component ([78e8253](https://github.com/kufu/smarthr-ui/commit/78e8253367ea8068045be64acc59ba3e6f3f30af))
- add some examples ([b152b6f](https://github.com/kufu/smarthr-ui/commit/b152b6f277a1e2bbce96596992928cc0b67b7701))
- **icon:** Add a FaClock icon ([73e8156](https://github.com/kufu/smarthr-ui/commit/73e8156a596eb7d028f907d95a79976b0e0b8e17))
- add style ([2c99af2](https://github.com/kufu/smarthr-ui/commit/2c99af245185a46df54f7e3c2db2ff4ef40b0141))
- add style ([7540a13](https://github.com/kufu/smarthr-ui/commit/7540a131aa41b9fa6d14b3cf644c1c3e21e8a713))
- add TextButton component ([9001063](https://github.com/kufu/smarthr-ui/commit/900106352cc494a053832fb433e263f9ec5f8e48))
- add useOffsetHeight hook ([0753bf1](https://github.com/kufu/smarthr-ui/commit/0753bf1783b48b2fea94f1cba04acf70605e7b22))
- Added Header component ([236f58f](https://github.com/kufu/smarthr-ui/commit/236f58fb1e5b64ada6d3ad12210a581ab4b76453))
- change props ([8e51061](https://github.com/kufu/smarthr-ui/commit/8e51061967f63cf5ea66140be825d9f5504af087))
- Create InformationPanel component ([1b08bf7](https://github.com/kufu/smarthr-ui/commit/1b08bf7419426a81c1a97ba559cb3c76c9dc82af))
- divide icon props to iconPosition and DisplayIcon ([1f37eff](https://github.com/kufu/smarthr-ui/commit/1f37effff7df1bb5e15ed94d57c019945450e25e))
- export undo icon ([797adaa](https://github.com/kufu/smarthr-ui/commit/797adaa22754a29fd3de97a4838aaa06da6fd3b2))
- export undo icon ([2cbd5c5](https://github.com/kufu/smarthr-ui/commit/2cbd5c5fd49840d395ff5efd2eeaff7133cd9f79))
- give position provider ([73360ca](https://github.com/kufu/smarthr-ui/commit/73360cafa547daf4cbcdb9968eba6eb2644a7631))
- manage state useing Map object ([e512a42](https://github.com/kufu/smarthr-ui/commit/e512a4213042241381707d2f380716d8d85639e0))
- remove AppBar component ([#574](https://github.com/kufu/smarthr-ui/issues/574)) ([2099a11](https://github.com/kufu/smarthr-ui/commit/2099a11312e388c08ae5fed63217a52e04cc5637))
- set max-height in child components ([086f0f2](https://github.com/kufu/smarthr-ui/commit/086f0f29a4ef4e4954abc94a3e638d28cb42dd1f))
- Update behavior of defaultExpanded ([8190c7c](https://github.com/kufu/smarthr-ui/commit/8190c7ccef1366959c331e93f9805e548fb95a70))
- **Dialog:** close a dialog when Escape key is pressed ([7e86234](https://github.com/kufu/smarthr-ui/commit/7e862345a9977be44f9d67d5dd6e44bd8b43ab1b))
- **icon:** Add arrow right icon ([0d76099](https://github.com/kufu/smarthr-ui/commit/0d76099ea02ef176c60c12885e2b42354ce76171))
- **icon:** Add fa-chevron-_, fa-copy, and fa-trash-_ ([dcfac49](https://github.com/kufu/smarthr-ui/commit/dcfac49c867b92ac53021c0d6db11db51c425713))
- **icon:** Add fa-times-circle ([961a5c9](https://github.com/kufu/smarthr-ui/commit/961a5c99e4e183c2b9ca8a761fccdc4e111e4daa))

### Bug Fixes

- AccordionPanel -> AccordionPanelItem ([c221c65](https://github.com/kufu/smarthr-ui/commit/c221c65faf09a9e026710a64fbfa1eba81e319da))
- add className props ([75d3f20](https://github.com/kufu/smarthr-ui/commit/75d3f20e7772a194545d12b88da39ff3b95e6488))
- add className props for Dropdown component ([#522](https://github.com/kufu/smarthr-ui/issues/522)) ([88c7066](https://github.com/kufu/smarthr-ui/commit/88c70667b4339466b95e28a4ee6b661759e1e3db))
- Add colSpan, rowSpan props to Cell ([9f95526](https://github.com/kufu/smarthr-ui/commit/9f9552622b8f79251b8ddc71f12945a50ec9c72c))
- Add isCrew as props ([8c21b76](https://github.com/kufu/smarthr-ui/commit/8c21b76d65c2cc93d8d9282bc426176ec96687e1))
- Add line-height to DefinitionListItem ([e328728](https://github.com/kufu/smarthr-ui/commit/e3287281754de860ae31aeb51827c1e5f043604c))
- Add ref props ([47fe111](https://github.com/kufu/smarthr-ui/commit/47fe111f0253845c9c2bc404eddaf45d11dde22d))
- add resolutions field ([6e0dc4b](https://github.com/kufu/smarthr-ui/commit/6e0dc4b7f47d3b907b17a63e1f153d7d74f0501d))
- add setTimeout to delay scheduling ([c64ca0b](https://github.com/kufu/smarthr-ui/commit/c64ca0be30d6ceb7e076d9f87b69edbf2d3949ae))
- Adjust style ([88b9767](https://github.com/kufu/smarthr-ui/commit/88b9767786e1905156dfe7c0584a8d52b89dd98b))
- callback onClick ([c792871](https://github.com/kufu/smarthr-ui/commit/c7928713bffffde4247dbddbcd8a656d6299c104))
- change area-expanded value ([02a0ae8](https://github.com/kufu/smarthr-ui/commit/02a0ae818321ce7b3fbd46daf82b16e57f529335))
- change context types ([74edb9a](https://github.com/kufu/smarthr-ui/commit/74edb9a02493b61ca6e709007a550faaedb25c85))
- change fa-reg-plus-square icon to fa-plus-square icon ([d87a545](https://github.com/kufu/smarthr-ui/commit/d87a545785d75149a1f0f9a6d6294f0798f95186))
- Change Field props ([6ebf620](https://github.com/kufu/smarthr-ui/commit/6ebf6209be8a86057c548e5397e95121ee73d5b0))
- change icon ([f704049](https://github.com/kufu/smarthr-ui/commit/f704049d98509574091524c0d98c721092ac6364))
- change name of Field component ([#579](https://github.com/kufu/smarthr-ui/issues/579)) ([f2655c8](https://github.com/kufu/smarthr-ui/commit/f2655c818551895eda5543fab26d822af451535b))
- change padding ([bcda0c6](https://github.com/kufu/smarthr-ui/commit/bcda0c64ec517ad9f7aa1d12ff09d46447de5b34))
- Change RadioButton props ([fe8f014](https://github.com/kufu/smarthr-ui/commit/fe8f014b76334fb5efbf4699cc9358c8e47833c6))
- change rotate direction ([84963e5](https://github.com/kufu/smarthr-ui/commit/84963e58a984f73812652a5f31e8e988fb241b2f))
- Change Select props ([1c667ea](https://github.com/kufu/smarthr-ui/commit/1c667ead5da49dcdbc5cf2bcc26cee75a518f13a))
- Change the animation ([2fbaf84](https://github.com/kufu/smarthr-ui/commit/2fbaf84f3e69d427977ddcb5bfa564f247abcecb))
- change to correct name ([1d0dd75](https://github.com/kufu/smarthr-ui/commit/1d0dd7516b2c234721876c0173e900dfb084b1d5))
- children format ([a44720b](https://github.com/kufu/smarthr-ui/commit/a44720bdc0d752dc45949d1f6f345a70de592db5))
- context initial data ([2a6e39b](https://github.com/kufu/smarthr-ui/commit/2a6e39bc9a333ce0f60b0d0ebe65a5deffae516f))
- Except autoFocus from input ([b3b7065](https://github.com/kufu/smarthr-ui/commit/b3b7065b0f25674b4476475eee9212659a9e3572))
- export components ([d9609db](https://github.com/kufu/smarthr-ui/commit/d9609db46970a16cd8696e577e7e4df428ab3508))
- export import ([369b780](https://github.com/kufu/smarthr-ui/commit/369b780cee10365593114788272dbc2d75e9c8a1))
- export text button ([55b2922](https://github.com/kufu/smarthr-ui/commit/55b292208209668c5c3b5dae1ac7b23ac8010c35))
- fix box-shadow value in Base ([7e7a34e](https://github.com/kufu/smarthr-ui/commit/7e7a34e9e652e09a248f2b58767786a7ae0408b7))
- Fix build error ([1679909](https://github.com/kufu/smarthr-ui/commit/1679909d61121dc200a857d9f9587a141d3aa434))
- Fix dropdown trigger bug ([34aee6b](https://github.com/kufu/smarthr-ui/commit/34aee6b00d458f72040c5a7b15c09d466898dbba))
- fix for reviews ([20fdf3f](https://github.com/kufu/smarthr-ui/commit/20fdf3ff11b761f8a4def324beaeba650b7ae728))
- Fix Header and HeaderButton construction ([364756a](https://github.com/kufu/smarthr-ui/commit/364756aac00ea229ebbaa9a95d860a5b26ef03e3))
- Fix HeaderUserNotification construction ([554b3dd](https://github.com/kufu/smarthr-ui/commit/554b3dd5769dd7bd8ed05ea52b55f6806dbc3f26))
- Fix HeaderUsreDropdown ([2f59124](https://github.com/kufu/smarthr-ui/commit/2f591243ec9e63f9a69f71cd8a674e92eea85046))
- fix line-height for StatusLabel ([58fa24e](https://github.com/kufu/smarthr-ui/commit/58fa24ebc85b9294583745e96704e522413fb00f)), closes [#551](https://github.com/kufu/smarthr-ui/issues/551)
- Fix style ([b2bc511](https://github.com/kufu/smarthr-ui/commit/b2bc5118474df4b4d40b6baed6174a1c9b81c490))
- Fixed a bug that did not animate when using firefox ([c65fa1f](https://github.com/kufu/smarthr-ui/commit/c65fa1f9ac79d12f6249724add9b9a0ecd612e90))
- HeaderCrewDropDown -> HeaderCrewDropdown ([59f2ac5](https://github.com/kufu/smarthr-ui/commit/59f2ac54a9ef1c4a15ce6d93ce064d09c79d2d9d))
- Increase type of Input type props, fix [#483](https://github.com/kufu/smarthr-ui/issues/483) ([e2db0fe](https://github.com/kufu/smarthr-ui/commit/e2db0fe475f81c8e16cfd748b4af79b8803343c9))
- manage state inside component ([855c1ed](https://github.com/kufu/smarthr-ui/commit/855c1ed89843e470c53332295cbf6280d8815a85))
- move helper file to inside libs ([36e30c6](https://github.com/kufu/smarthr-ui/commit/36e30c633856a5acc20e31cd06c0223fce47fd27))
- move icon props to Accordion component ([e6717aa](https://github.com/kufu/smarthr-ui/commit/e6717aa05b11cfa9664cfc862fe0543be67c7219))
- move onClick to trigger component ([8dae970](https://github.com/kufu/smarthr-ui/commit/8dae97011be4cfbca8c12e837ddef1222653c19a))
- not to animate at first rendering ([530542b](https://github.com/kufu/smarthr-ui/commit/530542bd23f3ed46087f6b8888b68e1ffae33d03))
- pass icon props from AccordionPanel ([392668a](https://github.com/kufu/smarthr-ui/commit/392668ad3a75b717b55be39e13d85eb635dbec4f))
- Pass input default props to checkbox ([e576001](https://github.com/kufu/smarthr-ui/commit/e5760012f59fab85e16b572336b41ce1a5d49421))
- Remove console.log ([098a44d](https://github.com/kufu/smarthr-ui/commit/098a44d7c28a5e8ff91a08ca06b293fdd8c66f89))
- Remove unnecessary file ([8e17b82](https://github.com/kufu/smarthr-ui/commit/8e17b8215ebbdc5634d6a1258830fd0f07d1424e))
- remove unnecessary onClick ([ebff6fb](https://github.com/kufu/smarthr-ui/commit/ebff6fba6e56f0b267d84338412cf2631e1f0036))
- rename Accordion to AccordionPanel ([e3925fd](https://github.com/kufu/smarthr-ui/commit/e3925fd8b50f56a7c4c1ddbf296b86854702c396))
- rename function ([f75505e](https://github.com/kufu/smarthr-ui/commit/f75505e7e2c57f1b21169e3ebabc0411a3f69658))
- set disabled style to Input ([bdf16f0](https://github.com/kufu/smarthr-ui/commit/bdf16f0c487e19591f1473c633760ec1d666484f))
- set vertical-align to error message ([701950e](https://github.com/kufu/smarthr-ui/commit/701950e3ddf2f3769a4a22e19101dbad002fbd03))
- state management ([932eb5c](https://github.com/kufu/smarthr-ui/commit/932eb5cb99caa60675f6ba42c1bb7890587678b3))
- style ([5358cf9](https://github.com/kufu/smarthr-ui/commit/5358cf9c93eae60c33314e6d43a19410eac7981b))
- style ([3f9bb39](https://github.com/kufu/smarthr-ui/commit/3f9bb39d08ebcef47f22e151def5ff99a852c685))
- Update avatar style ([93c651e](https://github.com/kufu/smarthr-ui/commit/93c651e147454241222080719465bee44fba6859))
- use forwardRef ([f2ab9a9](https://github.com/kufu/smarthr-ui/commit/f2ab9a9008d8fff07df8df1bb3000ea44f8e7a95))
- **dropdown:** change initial position for dropdown component ([6d73c0a](https://github.com/kufu/smarthr-ui/commit/6d73c0ad882aff6aef5fa6db3c85d152a41d58c8))
- use typescript generics ([1de2b8e](https://github.com/kufu/smarthr-ui/commit/1de2b8e401bc0669b88280b162d7a75665dd3eee))
- **select:** fix selectbox css ([#503](https://github.com/kufu/smarthr-ui/issues/503)) ([934687b](https://github.com/kufu/smarthr-ui/commit/934687b2414ddbbf219e1eb77823d22f6f6f362c))

* Remove deprecated props for Table component (#575) ([74a0220](https://github.com/kufu/smarthr-ui/commit/74a022089e9efe8187bd5023496a9013d003359c)), closes [#575](https://github.com/kufu/smarthr-ui/issues/575)

## [5.10.0](https://github.com/kufu/smarthr-ui/compare/v5.9.0...v5.10.0) (2019-12-20)

### Features

- Create InformationPanel component ([1b08bf7](https://github.com/kufu/smarthr-ui/commit/1b08bf7419426a81c1a97ba559cb3c76c9dc82af))

## [5.9.0](https://github.com/kufu/smarthr-ui/compare/v5.8.0...v5.9.0) (2019-12-12)

### Features

- **Dialog:** close a dialog when Escape key is pressed ([7e86234](https://github.com/kufu/smarthr-ui/commit/7e862345a9977be44f9d67d5dd6e44bd8b43ab1b))

### Bug Fixes

- Fix dropdown trigger bug ([34aee6b](https://github.com/kufu/smarthr-ui/commit/34aee6b00d458f72040c5a7b15c09d466898dbba))
- **dropdown:** change initial position for dropdown component ([6d73c0a](https://github.com/kufu/smarthr-ui/commit/6d73c0ad882aff6aef5fa6db3c85d152a41d58c8))
- add className props for Dropdown component ([#522](https://github.com/kufu/smarthr-ui/issues/522)) ([88c7066](https://github.com/kufu/smarthr-ui/commit/88c70667b4339466b95e28a4ee6b661759e1e3db))
- Add isCrew as props ([8c21b76](https://github.com/kufu/smarthr-ui/commit/8c21b76d65c2cc93d8d9282bc426176ec96687e1))
- change fa-reg-plus-square icon to fa-plus-square icon ([d87a545](https://github.com/kufu/smarthr-ui/commit/d87a545785d75149a1f0f9a6d6294f0798f95186))
- Fix Header and HeaderButton construction ([364756a](https://github.com/kufu/smarthr-ui/commit/364756aac00ea229ebbaa9a95d860a5b26ef03e3))
- Fix HeaderUserNotification construction ([554b3dd](https://github.com/kufu/smarthr-ui/commit/554b3dd5769dd7bd8ed05ea52b55f6806dbc3f26))
- Fix HeaderUsreDropdown ([2f59124](https://github.com/kufu/smarthr-ui/commit/2f591243ec9e63f9a69f71cd8a674e92eea85046))
- Fix style ([b2bc511](https://github.com/kufu/smarthr-ui/commit/b2bc5118474df4b4d40b6baed6174a1c9b81c490))
- HeaderCrewDropDown -> HeaderCrewDropdown ([59f2ac5](https://github.com/kufu/smarthr-ui/commit/59f2ac54a9ef1c4a15ce6d93ce064d09c79d2d9d))
- Remove unnecessary file ([8e17b82](https://github.com/kufu/smarthr-ui/commit/8e17b8215ebbdc5634d6a1258830fd0f07d1424e))
- Update avatar style ([93c651e](https://github.com/kufu/smarthr-ui/commit/93c651e147454241222080719465bee44fba6859))

### [5.8.1](https://github.com/kufu/smarthr-ui/compare/v5.8.0...v5.8.1) (2019-12-10)

### Bug Fixes

- **dropdown:** change initial position for dropdown component ([6d73c0a](https://github.com/kufu/smarthr-ui/commit/6d73c0ad882aff6aef5fa6db3c85d152a41d58c8))
- add className props for Dropdown component ([#522](https://github.com/kufu/smarthr-ui/issues/522)) ([88c7066](https://github.com/kufu/smarthr-ui/commit/88c70667b4339466b95e28a4ee6b661759e1e3db))

## [5.8.0](https://github.com/kufu/smarthr-ui/compare/v5.7.1...v5.8.0) (2019-12-06)

### Features

- **icon:** Add fa-chevron-_, fa-copy, and fa-trash-_ ([dcfac49](https://github.com/kufu/smarthr-ui/commit/dcfac49c867b92ac53021c0d6db11db51c425713))
- Added Header component ([236f58f](https://github.com/kufu/smarthr-ui/commit/236f58fb1e5b64ada6d3ad12210a581ab4b76453))
- Update behavior of defaultExpanded ([8190c7c](https://github.com/kufu/smarthr-ui/commit/8190c7ccef1366959c331e93f9805e548fb95a70))

### Bug Fixes

- Remove console.log ([098a44d](https://github.com/kufu/smarthr-ui/commit/098a44d7c28a5e8ff91a08ca06b293fdd8c66f89))
- **select:** fix selectbox css ([#503](https://github.com/kufu/smarthr-ui/issues/503)) ([934687b](https://github.com/kufu/smarthr-ui/commit/934687b2414ddbbf219e1eb77823d22f6f6f362c))

### [5.7.1](https://github.com/kufu/smarthr-ui/compare/v5.7.0...v5.7.1) (2019-12-04)

### Bug Fixes

- Add colSpan, rowSpan props to Cell ([9f95526](https://github.com/kufu/smarthr-ui/commit/9f9552622b8f79251b8ddc71f12945a50ec9c72c))
- Change the animation ([2fbaf84](https://github.com/kufu/smarthr-ui/commit/2fbaf84f3e69d427977ddcb5bfa564f247abcecb))
- Increase type of Input type props, fix [#483](https://github.com/kufu/smarthr-ui/issues/483) ([e2db0fe](https://github.com/kufu/smarthr-ui/commit/e2db0fe475f81c8e16cfd748b4af79b8803343c9))

## [5.7.0](https://github.com/kufu/smarthr-ui/compare/v5.6.0...v5.7.0) (2019-11-26)

### Features

- **icon:** Add fa-times-circle ([961a5c9](https://github.com/kufu/smarthr-ui/commit/961a5c99e4e183c2b9ca8a761fccdc4e111e4daa))
- Add onClickOverlay props to to ActionDialog and MessageDialog ([c002fd1](https://github.com/kufu/smarthr-ui/commit/c002fd1049f76106dc137ee08fdc137f6a29c20b))

### Bug Fixes

- Add line-height to DefinitionListItem ([e328728](https://github.com/kufu/smarthr-ui/commit/e3287281754de860ae31aeb51827c1e5f043604c))
- Adjust style ([88b9767](https://github.com/kufu/smarthr-ui/commit/88b9767786e1905156dfe7c0584a8d52b89dd98b))
- Fix build error ([1679909](https://github.com/kufu/smarthr-ui/commit/1679909d61121dc200a857d9f9587a141d3aa434))

## [5.6.0](https://github.com/kufu/smarthr-ui/compare/v5.5.0...v5.6.0) (2019-11-20)

### Features

- **icon:** Add arrow right icon ([0d76099](https://github.com/kufu/smarthr-ui/commit/0d76099))

## [5.5.0](https://github.com/kufu/smarthr-ui/compare/v5.2.1...v5.5.0) (2019-11-15)

### Bug Fixes

- AccordionPanel -> AccordionPanelItem ([c221c65](https://github.com/kufu/smarthr-ui/commit/c221c65))
- add className props ([75d3f20](https://github.com/kufu/smarthr-ui/commit/75d3f20))
- callback onClick ([c792871](https://github.com/kufu/smarthr-ui/commit/c792871))
- change area-expanded value ([02a0ae8](https://github.com/kufu/smarthr-ui/commit/02a0ae8))
- change context types ([74edb9a](https://github.com/kufu/smarthr-ui/commit/74edb9a))
- change icon ([f704049](https://github.com/kufu/smarthr-ui/commit/f704049))
- change padding ([bcda0c6](https://github.com/kufu/smarthr-ui/commit/bcda0c6))
- change rotate direction ([84963e5](https://github.com/kufu/smarthr-ui/commit/84963e5))
- change to correct name ([1d0dd75](https://github.com/kufu/smarthr-ui/commit/1d0dd75))
- children format ([a44720b](https://github.com/kufu/smarthr-ui/commit/a44720b))
- context initial data ([2a6e39b](https://github.com/kufu/smarthr-ui/commit/2a6e39b))
- export components ([d9609db](https://github.com/kufu/smarthr-ui/commit/d9609db))
- export import ([369b780](https://github.com/kufu/smarthr-ui/commit/369b780))
- fix for reviews ([20fdf3f](https://github.com/kufu/smarthr-ui/commit/20fdf3f))
- Fixed a bug that did not animate when using firefox ([c65fa1f](https://github.com/kufu/smarthr-ui/commit/c65fa1f))
- manage state inside component ([855c1ed](https://github.com/kufu/smarthr-ui/commit/855c1ed))
- move helper file to inside libs ([36e30c6](https://github.com/kufu/smarthr-ui/commit/36e30c6))
- move icon props to Accordion component ([e6717aa](https://github.com/kufu/smarthr-ui/commit/e6717aa))
- move onClick to trigger component ([8dae970](https://github.com/kufu/smarthr-ui/commit/8dae970))
- not to animate at first rendering ([530542b](https://github.com/kufu/smarthr-ui/commit/530542b))
- pass icon props from AccordionPanel ([392668a](https://github.com/kufu/smarthr-ui/commit/392668a))
- remove unnecessary onClick ([ebff6fb](https://github.com/kufu/smarthr-ui/commit/ebff6fb))
- rename Accordion to AccordionPanel ([e3925fd](https://github.com/kufu/smarthr-ui/commit/e3925fd))
- rename function ([f75505e](https://github.com/kufu/smarthr-ui/commit/f75505e))
- state management ([932eb5c](https://github.com/kufu/smarthr-ui/commit/932eb5c))
- style ([3f9bb39](https://github.com/kufu/smarthr-ui/commit/3f9bb39))
- style ([5358cf9](https://github.com/kufu/smarthr-ui/commit/5358cf9))
- use typescript generics ([1de2b8e](https://github.com/kufu/smarthr-ui/commit/1de2b8e))

### Features

- add aria attributes ([d5b6cfd](https://github.com/kufu/smarthr-ui/commit/d5b6cfd))
- add className props ([e8aacf4](https://github.com/kufu/smarthr-ui/commit/e8aacf4))
- add defaultExpanded props ([b53f599](https://github.com/kufu/smarthr-ui/commit/b53f599))
- add DescriptionList ([88bab82](https://github.com/kufu/smarthr-ui/commit/88bab82))
- add font themes ([56a3fc6](https://github.com/kufu/smarthr-ui/commit/56a3fc6))
- add some examples ([b152b6f](https://github.com/kufu/smarthr-ui/commit/b152b6f))
- add style ([7540a13](https://github.com/kufu/smarthr-ui/commit/7540a13))
- add style ([2c99af2](https://github.com/kufu/smarthr-ui/commit/2c99af2))
- **icon:** Add a FaClock icon ([73e8156](https://github.com/kufu/smarthr-ui/commit/73e8156))
- change props ([8e51061](https://github.com/kufu/smarthr-ui/commit/8e51061))
- divide icon props to iconPosition and DisplayIcon ([1f37eff](https://github.com/kufu/smarthr-ui/commit/1f37eff))
- manage state useing Map object ([e512a42](https://github.com/kufu/smarthr-ui/commit/e512a42))

## [5.4.0](https://github.com/kufu/smarthr-ui/compare/v5.3.0...v5.4.0) (2019-11-13)

### Features

- **icon:** Add a FaClock icon ([73e8156](https://github.com/kufu/smarthr-ui/commit/73e8156))

## [5.3.0](https://github.com/kufu/smarthr-ui/compare/v5.2.1...v5.3.0) (2019-11-12)

### Bug Fixes

- AccordionPanel -> AccordionPanelItem ([c221c65](https://github.com/kufu/smarthr-ui/commit/c221c65))
- add className props ([75d3f20](https://github.com/kufu/smarthr-ui/commit/75d3f20))
- callback onClick ([c792871](https://github.com/kufu/smarthr-ui/commit/c792871))
- change area-expanded value ([02a0ae8](https://github.com/kufu/smarthr-ui/commit/02a0ae8))
- change context types ([74edb9a](https://github.com/kufu/smarthr-ui/commit/74edb9a))
- change icon ([f704049](https://github.com/kufu/smarthr-ui/commit/f704049))
- change padding ([bcda0c6](https://github.com/kufu/smarthr-ui/commit/bcda0c6))
- change rotate direction ([84963e5](https://github.com/kufu/smarthr-ui/commit/84963e5))
- change to correct name ([1d0dd75](https://github.com/kufu/smarthr-ui/commit/1d0dd75))
- children format ([a44720b](https://github.com/kufu/smarthr-ui/commit/a44720b))
- context initial data ([2a6e39b](https://github.com/kufu/smarthr-ui/commit/2a6e39b))
- export components ([d9609db](https://github.com/kufu/smarthr-ui/commit/d9609db))
- export import ([369b780](https://github.com/kufu/smarthr-ui/commit/369b780))
- Fixed a bug that did not animate when using firefox ([c65fa1f](https://github.com/kufu/smarthr-ui/commit/c65fa1f))
- manage state inside component ([855c1ed](https://github.com/kufu/smarthr-ui/commit/855c1ed))
- move helper file to inside libs ([36e30c6](https://github.com/kufu/smarthr-ui/commit/36e30c6))
- move icon props to Accordion component ([e6717aa](https://github.com/kufu/smarthr-ui/commit/e6717aa))
- move onClick to trigger component ([8dae970](https://github.com/kufu/smarthr-ui/commit/8dae970))
- not to animate at first rendering ([530542b](https://github.com/kufu/smarthr-ui/commit/530542b))
- pass icon props from AccordionPanel ([392668a](https://github.com/kufu/smarthr-ui/commit/392668a))
- remove unnecessary onClick ([ebff6fb](https://github.com/kufu/smarthr-ui/commit/ebff6fb))
- rename Accordion to AccordionPanel ([e3925fd](https://github.com/kufu/smarthr-ui/commit/e3925fd))
- rename function ([f75505e](https://github.com/kufu/smarthr-ui/commit/f75505e))
- state management ([932eb5c](https://github.com/kufu/smarthr-ui/commit/932eb5c))
- style ([3f9bb39](https://github.com/kufu/smarthr-ui/commit/3f9bb39))
- style ([5358cf9](https://github.com/kufu/smarthr-ui/commit/5358cf9))
- use typescript generics ([1de2b8e](https://github.com/kufu/smarthr-ui/commit/1de2b8e))

### Features

- add aria attributes ([d5b6cfd](https://github.com/kufu/smarthr-ui/commit/d5b6cfd))
- add className props ([e8aacf4](https://github.com/kufu/smarthr-ui/commit/e8aacf4))
- add defaultExpanded props ([b53f599](https://github.com/kufu/smarthr-ui/commit/b53f599))
- add some examples ([b152b6f](https://github.com/kufu/smarthr-ui/commit/b152b6f))
- add style ([2c99af2](https://github.com/kufu/smarthr-ui/commit/2c99af2))
- add style ([7540a13](https://github.com/kufu/smarthr-ui/commit/7540a13))
- change props ([8e51061](https://github.com/kufu/smarthr-ui/commit/8e51061))
- divide icon props to iconPosition and DisplayIcon ([1f37eff](https://github.com/kufu/smarthr-ui/commit/1f37eff))
- manage state useing Map object ([e512a42](https://github.com/kufu/smarthr-ui/commit/e512a42))

### [5.2.1](https://github.com/kufu/smarthr-ui/compare/v5.2.0...v5.2.1) (2019-11-07)

### Bug Fixes

- Add ref props ([47fe111](https://github.com/kufu/smarthr-ui/commit/47fe111))
- use forwardRef ([f2ab9a9](https://github.com/kufu/smarthr-ui/commit/f2ab9a9))

## [5.2.0](https://github.com/kufu/smarthr-ui/compare/v5.0.0...v5.2.0) (2019-11-06)

### Bug Fixes

- add resolutions field ([6e0dc4b](https://github.com/kufu/smarthr-ui/commit/6e0dc4b))
- Change Field props ([6ebf620](https://github.com/kufu/smarthr-ui/commit/6ebf620))
- Change RadioButton props ([fe8f014](https://github.com/kufu/smarthr-ui/commit/fe8f014))
- Change Select props ([1c667ea](https://github.com/kufu/smarthr-ui/commit/1c667ea))
- Except autoFocus from input ([b3b7065](https://github.com/kufu/smarthr-ui/commit/b3b7065))
- export text button ([55b2922](https://github.com/kufu/smarthr-ui/commit/55b2922))
- Pass input default props to checkbox ([e576001](https://github.com/kufu/smarthr-ui/commit/e576001))

### Features

- add TextButton component ([9001063](https://github.com/kufu/smarthr-ui/commit/9001063))
- export undo icon ([797adaa](https://github.com/kufu/smarthr-ui/commit/797adaa))
- export undo icon ([2cbd5c5](https://github.com/kufu/smarthr-ui/commit/2cbd5c5))

## [5.1.0](https://github.com/kufu/smarthr-ui/compare/v5.0.0...v5.1.0) (2019-11-05)

### Features

- add TextButton component ([9001063](https://github.com/kufu/smarthr-ui/commit/9001063))
- export undo icon ([797adaa](https://github.com/kufu/smarthr-ui/commit/797adaa))
- export undo icon ([2cbd5c5](https://github.com/kufu/smarthr-ui/commit/2cbd5c5))

## [5.0.0](https://github.com/kufu/smarthr-ui/compare/v4.0.1...v5.0.0) (2019-11-01)

### ⚠ BREAKING CHANGES

- Update components
- Fix typo in icon name
- pascal case doesn't support.

- chore: update snapshots
- original icon gets the same props as react-icons

- chore: update snapshot

- chore: export Icon component

- fix: remove 'Base', 'Icon' from IGNORE_DIRS
- remove size of tasting and trenta

### Bug Fixes

- add background-color to Flash component ([56b8079](https://github.com/kufu/smarthr-ui/commit/56b8079))
- Add ThemeProvider to DropdownContent ([8a2a8a2](https://github.com/kufu/smarthr-ui/commit/8a2a8a2))
- **selectbox:** Add aria-label ([8a7a0ab](https://github.com/kufu/smarthr-ui/commit/8a7a0ab))
- apply in DropDown storybook ([8b0b84d](https://github.com/kufu/smarthr-ui/commit/8b0b84d))
- Apply Input in Field Component ([7916091](https://github.com/kufu/smarthr-ui/commit/7916091))
- Change Button interface to conform to the DOM interface ([82003a2](https://github.com/kufu/smarthr-ui/commit/82003a2))
- Change Button interface to conform to the DOM interface ([f6b0a9e](https://github.com/kufu/smarthr-ui/commit/f6b0a9e))
- Change Checkbox interface to conform to the DOM interface ([aa38817](https://github.com/kufu/smarthr-ui/commit/aa38817))
- change for reviews ([e8bf397](https://github.com/kufu/smarthr-ui/commit/e8bf397))
- Change Input interface to conform to the DOM interface ([f01952f](https://github.com/kufu/smarthr-ui/commit/f01952f))
- Change label props to children ([e29f663](https://github.com/kufu/smarthr-ui/commit/e29f663))
- Change prop type for TabItem ([629e552](https://github.com/kufu/smarthr-ui/commit/629e552))
- **selectbox:** Change to use fa-sort ([ca95f47](https://github.com/kufu/smarthr-ui/commit/ca95f47))
- Change Select interface to conform to the DOM interface ([0ff3f35](https://github.com/kufu/smarthr-ui/commit/0ff3f35))
- Change Select interface to conform to the DOM interface ([6567c2d](https://github.com/kufu/smarthr-ui/commit/6567c2d))
- Change Select interface to conform to the DOM interface ([7d05e95](https://github.com/kufu/smarthr-ui/commit/7d05e95))
- Change tag to which className is applied ([4b4f0fd](https://github.com/kufu/smarthr-ui/commit/4b4f0fd))
- Checkbox test ([03adb5d](https://github.com/kufu/smarthr-ui/commit/03adb5d))
- Fix dropdown content position ([e7465c3](https://github.com/kufu/smarthr-ui/commit/e7465c3))
- Fix dropdown content size bug ([5d96292](https://github.com/kufu/smarthr-ui/commit/5d96292))
- Fix font-size ([cd3ed2e](https://github.com/kufu/smarthr-ui/commit/cd3ed2e))
- fix for jslint ([095f709](https://github.com/kufu/smarthr-ui/commit/095f709))
- Fix rendering bug ([0ec70e2](https://github.com/kufu/smarthr-ui/commit/0ec70e2))
- Fix typo ([ff4295c](https://github.com/kufu/smarthr-ui/commit/ff4295c))
- Fix yarn.lock ([ccd75a0](https://github.com/kufu/smarthr-ui/commit/ccd75a0))
- Fix yarn.lock ([936f25b](https://github.com/kufu/smarthr-ui/commit/936f25b))
- Make storybook compatible with React hooks ([1b96936](https://github.com/kufu/smarthr-ui/commit/1b96936))
- memoize DropdownContentRoot ([f470ea9](https://github.com/kufu/smarthr-ui/commit/f470ea9))
- Modify left position logic ([b3af02d](https://github.com/kufu/smarthr-ui/commit/b3af02d))
- Recover lost files ([e6d9c60](https://github.com/kufu/smarthr-ui/commit/e6d9c60))
- Remove export ([03f632f](https://github.com/kufu/smarthr-ui/commit/03f632f))
- Remove the part that was described in double ([66ef42a](https://github.com/kufu/smarthr-ui/commit/66ef42a))
- Remove unnecessary files ([0f70685](https://github.com/kufu/smarthr-ui/commit/0f70685))
- show checkbox focus indicator ([b9f0e85](https://github.com/kufu/smarthr-ui/commit/b9f0e85))
- show Radio focus indicator ([09657a0](https://github.com/kufu/smarthr-ui/commit/09657a0))
- style ([71e37d2](https://github.com/kufu/smarthr-ui/commit/71e37d2))
- support uncontrollable Dropdown ([f55c9bb](https://github.com/kufu/smarthr-ui/commit/f55c9bb))
- Update all storybook's packages ([a0e2eea](https://github.com/kufu/smarthr-ui/commit/a0e2eea))
- Update dropdown position logic ([df50ca9](https://github.com/kufu/smarthr-ui/commit/df50ca9))
- Update ts setting ([843bec0](https://github.com/kufu/smarthr-ui/commit/843bec0))
- Use fa-check instead of check ([bc5ee1c](https://github.com/kufu/smarthr-ui/commit/bc5ee1c))
- Use fa-check-circle instead of check-circle ([d5e560e](https://github.com/kufu/smarthr-ui/commit/d5e560e))
- **select:** Change from text to default ([ae5cae6](https://github.com/kufu/smarthr-ui/commit/ae5cae6))
- **selectbox:** Adjustment when disabled or hover and fix css ([83738ae](https://github.com/kufu/smarthr-ui/commit/83738ae))
- **selectbox:** Remove blackOption and placeholder ([6d7bc5d](https://github.com/kufu/smarthr-ui/commit/6d7bc5d))
- **selectbox:** Remove unnecessary Vendor Prefix ([f26c0ed](https://github.com/kufu/smarthr-ui/commit/f26c0ed))
- Use fa-exclamation-triangle instead of exclamation-triangle ([dd9be98](https://github.com/kufu/smarthr-ui/commit/dd9be98))
- Use fa-times instead of cross ([fafb006](https://github.com/kufu/smarthr-ui/commit/fafb006))
- Use ReactDOM.createElement instead of ReactDOM.render ([957a0b6](https://github.com/kufu/smarthr-ui/commit/957a0b6))

### Features

- add an entry point for ES Modules ([5e9349a](https://github.com/kufu/smarthr-ui/commit/5e9349a))
- Add angle icon ([ea992e4](https://github.com/kufu/smarthr-ui/commit/ea992e4))
- add AppNavi component ([8b4a053](https://github.com/kufu/smarthr-ui/commit/8b4a053))
- add BaseButton component ([7dce43f](https://github.com/kufu/smarthr-ui/commit/7dce43f))
- add BlankImage component ([6f19e51](https://github.com/kufu/smarthr-ui/commit/6f19e51))
- Add className props to CheckboxLabel ([2c7cc94](https://github.com/kufu/smarthr-ui/commit/2c7cc94))
- Add className props to components ([37da6b4](https://github.com/kufu/smarthr-ui/commit/37da6b4))
- add clone icon ([4850691](https://github.com/kufu/smarthr-ui/commit/4850691))
- Add controllable ActionDialog component ([d9a6ddc](https://github.com/kufu/smarthr-ui/commit/d9a6ddc))
- Add controllable Dialog component ([674cfd7](https://github.com/kufu/smarthr-ui/commit/674cfd7))
- Add DangerButton component ([1ced44f](https://github.com/kufu/smarthr-ui/commit/1ced44f))
- Add Dialog basic component ([66ed088](https://github.com/kufu/smarthr-ui/commit/66ed088))
- Add FaCaretUp icon ([e7748e3](https://github.com/kufu/smarthr-ui/commit/e7748e3))
- Add FaExclamationCircle icon ([4720536](https://github.com/kufu/smarthr-ui/commit/4720536))
- Add minus icon ([8dba673](https://github.com/kufu/smarthr-ui/commit/8dba673))
- Add mixed props to Checkbox ([08741a1](https://github.com/kufu/smarthr-ui/commit/08741a1))
- Add NewDropdown component temporary ([c59239e](https://github.com/kufu/smarthr-ui/commit/c59239e))
- Add onClickBackground props to Modal ([e539afe](https://github.com/kufu/smarthr-ui/commit/e539afe))
- add Outline color to PletteProperty ([730e4be](https://github.com/kufu/smarthr-ui/commit/730e4be))
- Add PrimaryButton component ([#297](https://github.com/kufu/smarthr-ui/issues/297)) ([6cd2390](https://github.com/kufu/smarthr-ui/commit/6cd2390))
- add reply icon and paper-plain icon ([a62b623](https://github.com/kufu/smarthr-ui/commit/a62b623))
- add SecondaryButton component ([6909756](https://github.com/kufu/smarthr-ui/commit/6909756))
- add SkeletonButton component ([50500c8](https://github.com/kufu/smarthr-ui/commit/50500c8))
- Add TabBar ([#301](https://github.com/kufu/smarthr-ui/issues/301)) ([4afe1ff](https://github.com/kufu/smarthr-ui/commit/4afe1ff))
- Added Table component ([#269](https://github.com/kufu/smarthr-ui/issues/269)) ([1ec3115](https://github.com/kufu/smarthr-ui/commit/1ec3115))
- Adjust the display position of content ([1183721](https://github.com/kufu/smarthr-ui/commit/1183721))
- **icon:** Add external link icon ([28f240e](https://github.com/kufu/smarthr-ui/commit/28f240e))
- Change Field component props ([49ef9d7](https://github.com/kufu/smarthr-ui/commit/49ef9d7))
- **icon:** Add a FaCloudDownloadAlt icon ([5c4e8bd](https://github.com/kufu/smarthr-ui/commit/5c4e8bd))
- update UI for Pagination component and add `withoutNumbers props` ([93c067d](https://github.com/kufu/smarthr-ui/commit/93c067d))
- **icon:** Add a FaEye icon ([13eb8bf](https://github.com/kufu/smarthr-ui/commit/13eb8bf))
- **select:** Create select component ([f91e471](https://github.com/kufu/smarthr-ui/commit/f91e471))
- Create ActionDialogContent ([c7b6f05](https://github.com/kufu/smarthr-ui/commit/c7b6f05))
- Create controllable MessageDialog component ([ee63d93](https://github.com/kufu/smarthr-ui/commit/ee63d93))
- Create MessageDialog ([82b6e20](https://github.com/kufu/smarthr-ui/commit/82b6e20))
- export default frame ([4e1340d](https://github.com/kufu/smarthr-ui/commit/4e1340d))
- export default hover interaction ([c95707a](https://github.com/kufu/smarthr-ui/commit/c95707a))
- export default size ([1556da1](https://github.com/kufu/smarthr-ui/commit/1556da1))
- export defaultPalette ([34c2f72](https://github.com/kufu/smarthr-ui/commit/34c2f72))
- Update ActionDialogContent props ([cbb77c6](https://github.com/kufu/smarthr-ui/commit/cbb77c6))
- update AppNavi component so it can take a child component ([eabe203](https://github.com/kufu/smarthr-ui/commit/eabe203))

* change some font size ([5596d9f](https://github.com/kufu/smarthr-ui/commit/5596d9f))
* Merge pull request #319 from kufu/features/ttmz ([e5ce046](https://github.com/kufu/smarthr-ui/commit/e5ce046)), closes [#319](https://github.com/kufu/smarthr-ui/issues/319)
* Merge pull request #421 from kufu/fix-typo ([67c0923](https://github.com/kufu/smarthr-ui/commit/67c0923)), closes [#421](https://github.com/kufu/smarthr-ui/issues/421)
* BREAKING CHANGE: Changed color name of theme (#245) ([19a532d](https://github.com/kufu/smarthr-ui/commit/19a532d)), closes [#245](https://github.com/kufu/smarthr-ui/issues/245)
* BREAKING CHANGE: Enabled to use react-icons ([a60ab19](https://github.com/kufu/smarthr-ui/commit/a60ab19))

### [4.0.1](https://github.com/kufu/smarthr-ui/compare/v4.0.0...v4.0.1) (2019-08-06)

### Bug Fixes

- Fix export test ([5e67069](https://github.com/kufu/smarthr-ui/commit/5e67069))

## [4.0.0](https://github.com/kufu/smarthr-ui/compare/v3.9.2...v4.0.0) (2019-08-05)

### Tests

- add a test for missing exports in src/index.ts ([55618db](https://github.com/kufu/smarthr-ui/commit/55618db))

* BREAKING CHANGE: Update palette of theme (#220) ([de50fd8](https://github.com/kufu/smarthr-ui/commit/de50fd8)), closes [#220](https://github.com/kufu/smarthr-ui/issues/220)

### BREAKING CHANGES

- new theme does not support outdated variables

- chore: replace \${palette.White} to #fff

- chore: replace Mono_P10 to Border

- chore: replace Mono_P20 to Border

- chore: replace SmarthrGreen to Main

- chore: theme.palette.White to #fff

- chore: replace Mono_P40 to TextGrey

- chore: replace palette.Red to palette.Danger

- chore: replace Mono_P60 to TextGrey

- chore: replace Orange_M30 to Warning

- chore: replace Yellow to Warning

- chore: replace Red to Danger

- chore: replace Blue to Main

- chore: replace White to #fff

- chore: replace Black to TextBlack

- chore: replace Mono_P30 to TextGrey

- chore: change color

- chore: yarn add polished

- feat: add hoverColor method

- chore: modify hover color for PagenationItem

- chore: modify hover color for Button

- chore: modify focus color for Input

- style: change color code to lower case

- style: update snapshots

### [3.9.2](https://github.com/kufu/smarthr-ui/compare/v3.9.1...v3.9.2) (2019-07-31)

### Bug Fixes

- Skip res-suit when aws credential is not exist ([fc4282d](https://github.com/kufu/smarthr-ui/commit/fc4282d))

### [3.9.1](https://github.com/kufu/smarthr-ui/compare/v3.9.0...v3.9.1) (2019-07-22)

### [3.8.6](https://github.com/kufu/smarthr-ui/compare/v3.8.5...v3.8.6) (2019-07-03)
