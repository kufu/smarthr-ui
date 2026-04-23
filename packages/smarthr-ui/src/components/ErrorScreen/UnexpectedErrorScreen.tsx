'use client'

import { Localizer, useIntl } from '../../intl'
import { Stack } from '../Layout'
import { HelpLink } from '../TextLink'

import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  homeUrl: string
}

export const UnexpectedErrorScreen: FC<Props> = ({ homeUrl }) => {
  const { localize } = useIntl()

  return (
    <ErrorScreen
      title={localize({
        id: 'smarthr-ui/UnexpectedErrorScreen/title',
        defaultText: '予期しないエラーが発生しました',
      })}
      links={[
        {
          label: localize({
            id: 'smarthr-ui/ErrorScreen/homeLink',
            defaultText: 'ホームに戻る',
          }),
          url: homeUrl,
        },
      ]}
    >
      <Stack className="shr-max-w-col6">
        <p>
          {localize({
            id: 'smarthr-ui/UnexpectedErrorScreen/apology',
            defaultText: '大変申し訳ございません。',
          })}
          <br />
          {localize({
            id: 'smarthr-ui/UnexpectedErrorScreen/possibleCause',
            defaultText:
              '一時的な通信の問題や、ご利用環境、アップロードしたファイルの内容などによりエラーが発生している可能性があります。',
          })}
        </p>
        <p>
          {localize({
            id: 'smarthr-ui/UnexpectedErrorScreen/pleaseRetry',
            defaultText: 'お手数ですが、以下をお試しください。',
          })}
        </p>
        <ol className="shr-ps-[1.5em]">
          <li>
            {localize({
              id: 'smarthr-ui/UnexpectedErrorScreen/retryItem1',
              defaultText: '少し時間をおいて、再度お試しください。',
            })}
          </li>
          <li>
            <Localizer
              id="smarthr-ui/UnexpectedErrorScreen/retryItem2"
              defaultText="{maintenanceLink}をご確認ください（情報の掲載まで時間がかかる場合があります）。"
              values={{
                maintenanceLink: (
                  <HelpLink href="https://support.smarthr.jp/ja/info/status/page/1/">
                    メンテナンス・障害情報
                  </HelpLink>
                ),
              }}
            />
          </li>
        </ol>
        <p>
          {localize({
            id: 'smarthr-ui/UnexpectedErrorScreen/ifNotResolved',
            defaultText: '解消しない場合は、以下もご確認ください。',
          })}
        </p>
        <ul className="shr-ps-[1.5em]">
          <li>
            <Localizer
              id="smarthr-ui/UnexpectedErrorScreen/checkItem1"
              defaultText="{environmentLink}を満たしているかご確認ください。"
              values={{
                environmentLink: (
                  <HelpLink href="https://support.smarthr.jp/ja/help/articles/360035170054/">
                    SmartHRの動作環境
                  </HelpLink>
                ),
              }}
            />
          </li>
          <li>
            <Localizer
              id="smarthr-ui/UnexpectedErrorScreen/checkItem2"
              defaultText="ブラウザのCookieとキャッシュの削除をお試しください。詳しくは、{cookieCacheLink}を参照してください。"
              values={{
                cookieCacheLink: (
                  <HelpLink href="https://support.smarthr.jp/ja/help/articles/360026264433/">
                    Q. ブラウザのCookieとキャッシュを削除するには？
                  </HelpLink>
                ),
              }}
            />
          </li>
        </ul>
        <p>
          <Localizer
            id="smarthr-ui/UnexpectedErrorScreen/contactAdmin"
            defaultText="上記を確認しても解消しない場合は、社内の労務担当者など、SmartHRの管理者権限をお持ちの方に、{errorInfoLink}の情報を添えてご連絡ください。"
            values={{
              errorInfoLink: (
                <HelpLink href="https://support.smarthr.jp/ja/help/articles/360036353773/">
                  エラー発生時に教えていただきたい内容
                </HelpLink>
              ),
            }}
          />
        </p>
        <p>
          <Localizer
            id="smarthr-ui/UnexpectedErrorScreen/adminContact"
            defaultText="SmartHRの管理者権限をお持ちの方は、{errorInfoLink}の情報を添えて、右下のチャットマークからお問い合わせください。"
            values={{
              errorInfoLink: (
                <HelpLink href="https://support.smarthr.jp/ja/help/articles/360036353773/">
                  エラー発生時に教えていただきたい内容
                </HelpLink>
              ),
            }}
          />
        </p>
      </Stack>
    </ErrorScreen>
  )
}
