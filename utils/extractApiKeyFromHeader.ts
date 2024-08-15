export const extractApiKeyFromHeader = (
  authorizationHeader: string | undefined,
): string | undefined => {
  if (!authorizationHeader) {
    return
  }

  return authorizationHeader.replace('ApiKey ', '')
}
