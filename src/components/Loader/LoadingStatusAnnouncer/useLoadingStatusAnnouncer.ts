import { useContext } from 'react'

import {
  LoadingStatusAnnouncerContext,
  LoadingStatusAnnouncerContextValue,
} from './LoadingStatusAnnouncerContext'

export function useLoadingAnnouncer(): LoadingStatusAnnouncerContextValue {
  const loadingAnnouncerContext = useContext(LoadingStatusAnnouncerContext)
  return loadingAnnouncerContext
}
