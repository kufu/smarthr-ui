import { StoryFn } from '@storybook/react'
import React from 'react'

import { Stack } from '../Layout'

import { InformationPanel } from './InformationPanel'

export default {
  title: 'Data Display（データ表示）/InformationPanel',
  component: InformationPanel,
}

export const All: StoryFn = () => (
  <Stack>
    <InformationPanel title="書類に記載する扶養家族">
      借り換え直前の残高3,000万円、借り換え後の借入額2,900万円の場合→借り換え後の借入額が少ないので「借り換え後の借入額の方が少ない・同じ」を選択
    </InformationPanel>
    <InformationPanel
      title={<span>SmartHRの項目一覧表をダウンロード</span>}
      type="success"
      active={false}
    >
      従業員リストをダウンロードする際に指定するフォーマットを、カスタマイズして登録、管理できます。登録したフォーマットを利用することで、外部システムへの取り込みに適したファイルを書き出せます。詳しくは、カスタムダウンロードフォーマットの追加・編集・削除を参照してください。
    </InformationPanel>
    <InformationPanel title="項目全体がわかるよう撮影してください" type="warning">
      離職日の翌日から1ヶ月ごとにさかのぼって区切り、それぞれの期間中に賃金支払基礎日数が11日以上ある、または、賃金支払の基礎となった時間が80時間以上ある期間を入力します。この期間を被保険者期間と言い、失業給付を受けるためには原則としてこの被保険者期間が2年間のうち12ヶ月必要となります。
    </InformationPanel>
    <InformationPanel title="お探しのページは見つかりませんでした" type="error">
      書類の様式によって日付の記載先が異なります。手元の書類の日付が記載されている欄を回答してください。
    </InformationPanel>
    <InformationPanel
      title="サンプルの分析を作成して自由に分析機能を試せます"
      type="sync"
      decorators={{
        openButtonLabel: (txt) => `open.(${txt})`,
        closeButtonLabel: (txt) => `close.(${txt})`,
      }}
      togglable
    >
      借り入れしている金融機関が3つ以上ある場合は、SmartHRで住宅ローン控除申告書を作成できません。回答履歴から［住宅ローン控除申告書作成対象外確認］の設問に戻って、「対象外に該当する」を選択してください。「対象外に該当する」を選択すると、これまでに作成した書類の最終確認画面に移動します。住宅ローン控除については手書きで申告書を作成し、必要な原本を添えて担当者に提出してください。
    </InformationPanel>
  </Stack>
)
All.storyName = 'all'
