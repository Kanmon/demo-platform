export const getErrorCodeFromAxiosError = (error: any): string => {
  return error?.response?.data?.errorCode ?? 'UNEXPECTED_ERROR'
}
