import { FlatNamespace, KeyPrefix, TOptions } from 'i18next'
import { FallbackNs, useTranslation as useI18nTranslate, UseTranslationOptions } from 'react-i18next'
import { $Tuple } from 'react-i18next/helpers'

export type TranslateCallback = (key: string | string[], options?: TOptions) => string

export default function useTranslate<
  Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(ns?: Ns, options?: UseTranslationOptions<KPrefix>) {
  const [t] = useI18nTranslate(ns, options)

  return t as TranslateCallback
}
