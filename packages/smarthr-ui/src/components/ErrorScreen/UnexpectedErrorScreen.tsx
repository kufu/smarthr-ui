import { Stack } from '../Layout'
import { HelpLink } from '../TextLink'

import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  homeUrl: string
}

export const UnexpectedErrorScreen: FC<Props> = ({ homeUrl }) => (
  <ErrorScreen
    title="予期しないエラーが発生しました"
    links={[
      {
        label: 'ホームへ戻る',
        url: homeUrl,
      },
    ]}
  >
    <Stack className="shr-max-w-col6">
      <p>
        大変申し訳ございません。
        <br />
        一時的な通信の問題や、ご利用環境、アップロードしたファイルの内容などによりエラーが発生している可能性があります。
      </p>
      <p>お手数ですが、以下をお試しください。</p>
      <ol className="shr-ps-[1.5em]">
        <li>少し時間をおいて、再度お試しください。</li>
        <li>
          <HelpLink href="https://support.smarthr.jp/ja/info/status/page/1/">
            メンテナンス・障害情報
          </HelpLink>
          をご確認ください（情報の掲載まで時間がかかる場合があります）。
        </li>
      </ol>
      <p>解消しない場合は、以下もご確認ください。</p>
      <ul className="shr-ps-[1.5em]">
        <li>
          <HelpLink href="https://support.smarthr.jp/ja/help/articles/360035170054/">
            SmartHRの動作環境
          </HelpLink>
          を満たしているかご確認ください。
        </li>
        <li>
          ブラウザのCookieとキャッシュの削除をお試しください。詳しくは、
          <HelpLink href="https://support.smarthr.jp/ja/help/articles/360026264433/">
            Q. ブラウザのCookieとキャッシュを削除するには？
          </HelpLink>
          を参照してください。
        </li>
      </ul>
      <p>
        上記を確認しても解消しない場合は、社内の労務担当者など、SmartHRの管理者権限をお持ちの方に、
        <HelpLink href="https://support.smarthr.jp/ja/help/articles/360036353773/">
          エラー発生時に教えていただきたい内容
        </HelpLink>
        の情報を添えてご連絡ください。
      </p>
      <p>
        SmartHRの管理者権限をお持ちの方は、
        <HelpLink href="https://support.smarthr.jp/ja/help/articles/360036353773/">
          エラー発生時に教えていただきたい内容
        </HelpLink>
        の情報を添えて、右下のチャットマークからお問い合わせください。
      </p>
    </Stack>
  </ErrorScreen>
)
