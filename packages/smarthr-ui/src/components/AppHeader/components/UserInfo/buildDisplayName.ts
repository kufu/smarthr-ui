export const buildDisplayName = ({
  email,
  empCode,
  firstName,
  lastName,
}: {
  email?: string | null
  empCode?: string | null
  firstName?: string | null
  lastName?: string | null
}) => {
  if (firstName && lastName) {
    return `${lastName} ${firstName}${empCode ? `（${empCode}）` : ''}`
  }

  return empCode || email || ''
}
