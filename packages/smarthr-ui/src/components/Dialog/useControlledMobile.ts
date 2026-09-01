import { useEnvironment } from '../../hooks/client/useEnvironment'

export const useControlledMobile = (mobileType?: 'sheet') => {
  const { mobile } = useEnvironment()

  return {
    mobile,
    mobileType: mobile ? mobileType : undefined,
  }
}
