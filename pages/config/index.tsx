import { Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncFn } from 'react-use'
import { saveApiKey } from '../../store/apiKeySlice'
import {
  getKanmonConnectSlice,
  updateUseCdnSdk,
} from '../../store/kanmonConnectSlice'
import { getErrorCodeFromAxiosError } from '@/utils/getErrorCodeFromAxiosError'
import { genericErrorMessage } from '@/utils/constants'
import FormikTextInput from '@/components/shared/FormikTextField'
import { axiosWithApiKey, basicCssClassUpdater } from '@/utils'
import { Alert, Box } from '@mui/material'
import Button from '@/components/shared/Button'
import { useRouter } from 'next/router'

interface FormValues {
  apiKey: string
  useCdnSdk: boolean
}

const getSaveApiKeyErrorMessage = (error: any) => {
  if (!error) return null

  if (getErrorCodeFromAxiosError(error) === 'ForbiddenException') {
    return 'You entered an invalid Kanmon API Key. Please try again.'
  }

  return genericErrorMessage
}

const ConfigPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const data = useSelector(getKanmonConnectSlice)

  const initialValues: FormValues = {
    apiKey: '',
    useCdnSdk: data.useCdnSdk ?? false,
  }

  const [{ loading, error }, saveApiKeyFn] = useAsyncFn(
    async (values: FormValues) => {
      const { apiKey, useCdnSdk } = values
      if (apiKey) {
        await axiosWithApiKey(apiKey).get('/api/test_api_key')
        dispatch(saveApiKey({ apiKey }))
      }
      dispatch(updateUseCdnSdk({ useCdnSdk }))
      router.push('/')
    },
  )

  const errorMessage = getSaveApiKeyErrorMessage(error)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <img
                  src="/icons/settings.svg"
                  alt="Settings"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Configuration
                </h1>
                <p className="text-indigo-100 text-sm">
                  Set up your Kanmon integration
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <Formik
              onSubmit={async (values) => {
                await saveApiKeyFn(values)
              }}
              initialValues={initialValues}
              validateOnMount={true}
            >
              {({
                isValid,
                handleSubmit,
                isSubmitting,
                values,
                setFieldValue,
              }) => {
                return (
                  <Form className="space-y-6">
                    {/* API Key Section */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <img
                            src="/icons/key.svg"
                            alt="API Key"
                            width={16}
                            height={16}
                          />
                        </div>
                        <label className="text-sm font-semibold text-gray-700">
                          API Key
                        </label>
                      </div>
                      <FormikTextInput<FormValues>
                        fieldName="apiKey"
                        placeholder="Enter your Kanmon API key"
                        updateContainerCss={basicCssClassUpdater('w-full')}
                        customInputSx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: 'white',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366f1',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366f1',
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Integration Mode Section */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <img
                            src="/icons/check-circle.svg"
                            alt="Integration Mode"
                            width={16}
                            height={16}
                          />
                        </div>
                        <label className="text-sm font-semibold text-gray-700">
                          Integration Mode
                        </label>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-1 border border-gray-200">
                        <div className="grid grid-cols-2 gap-1">
                          <button
                            type="button"
                            onClick={() => setFieldValue('useCdnSdk', false)}
                            className={`relative p-4 rounded-lg transition-all duration-200 text-left ${
                              !values.useCdnSdk
                                ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  !values.useCdnSdk
                                    ? 'bg-indigo-100'
                                    : 'bg-gray-200'
                                }`}
                              >
                                <img
                                  src={
                                    !values.useCdnSdk
                                      ? '/icons/book.svg'
                                      : '/icons/book-gray.svg'
                                  }
                                  alt="NPM Package"
                                  width={16}
                                  height={16}
                                />
                              </div>
                              <div>
                                <div className="font-medium">NPM Package</div>
                                <div className="text-xs text-gray-500">
                                  @kanmon/web-sdk
                                </div>
                              </div>
                            </div>
                            {!values.useCdnSdk && (
                              <div className="absolute -top-1 -right-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  Recommended
                                </span>
                              </div>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setFieldValue('useCdnSdk', true)}
                            className={`relative p-4 rounded-lg transition-all duration-200 text-left ${
                              values.useCdnSdk
                                ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  values.useCdnSdk
                                    ? 'bg-indigo-100'
                                    : 'bg-gray-200'
                                }`}
                              >
                                <img
                                  src={
                                    values.useCdnSdk
                                      ? '/icons/globe.svg'
                                      : '/icons/globe-gray.svg'
                                  }
                                  alt="CDN"
                                  width={16}
                                  height={16}
                                />
                              </div>
                              <div>
                                <div className="font-medium">CDN</div>
                                <div className="text-xs text-gray-500">
                                  Script tag
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={!isValid || isSubmitting || loading}
                        onClick={() => handleSubmit()}
                        sx={{
                          background:
                            'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          borderRadius: '12px',
                          padding: '12px 24px',
                          fontSize: '16px',
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)',
                          '&:hover': {
                            background:
                              'linear-gradient(135deg, #5855eb 0%, #7c3aed 100%)',
                            boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.5)',
                          },
                          '&:disabled': {
                            background: '#e5e7eb',
                            color: '#9ca3af',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Applying Configuration...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <img
                              src="/icons/check.svg"
                              alt="Apply"
                              width={20}
                              height={20}
                            />
                            <span>Apply Configuration</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </Form>
                )
              }}
            </Formik>

            {/* Error Display */}
            {error && (
              <Box className="mt-6">
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: '12px',
                    '& .MuiAlert-icon': {
                      fontSize: '20px',
                    },
                  }}
                >
                  {errorMessage}
                </Alert>
              </Box>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Check out our{' '}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-medium underline"
            >
              documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConfigPage
