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
import { axiosWithApiKey } from '@/utils'
import Button from '@/components/shared/Button'
import { Alert } from '@mui/material'
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
  const data = useSelector(getKanmonConnectSlice)
  const router = useRouter()
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
    <div className="top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 bg-white text-center rounded w-[450px] md:w-[550px]">
      <div className="p-12">
        <Formik
          onSubmit={async (values) => {
            await saveApiKeyFn(values)
          }}
          initialValues={initialValues}
          validateOnMount={true}
        >
          {({ isValid, handleSubmit, isSubmitting, values, setFieldValue }) => {
            return (
              <div className="mt-4">
                <h1 className="text-xl font-semibold mb-8">
                  Access the Demo Platform with your API Key
                </h1>
                <Form>
                  <div className="mb-4">
                    <FormikTextInput<FormValues>
                      fieldName="apiKey"
                      placeholder={'Set Api Key'}
                    />
                  </div>

                  <div className="flex justify-start items-center mb-4">
                    <span className="mr-3 text-sm font-medium text-gray-700">
                      Front end SDK Integration
                    </span>
                    <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => setFieldValue('useCdnSdk', false)}
                        className={`px-3 py-1 rounded-l-md transition-colors duration-150
                          ${!values.useCdnSdk ? 'bg-white text-blue-600 border border-gray-300' : 'text-gray-600'}
                        `}
                      >
                        @kanmon/web-sdk NPM
                        <span className="ml-1 text-[10px] text-blue-600 bg-blue-100 rounded px-1">
                          (recommended)
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFieldValue('useCdnSdk', true)}
                        className={`px-3 py-1 rounded-r-md transition-colors duration-150
                          ${values.useCdnSdk ? 'bg-white text-blue-600 border border-gray-300' : 'text-gray-600'}
                        `}
                      >
                        Kanmon CDN
                      </button>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    variant="contained"
                    disabled={!isValid || isSubmitting || loading}
                    onClick={() => handleSubmit()}
                    color="primary"
                  >
                    Apply Configuration
                  </Button>
                </Form>
              </div>
            )
          }}
        </Formik>
        {error && (
          <div className="my-4 text-left">
            <Alert severity="error">{errorMessage}</Alert>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Check out our{' '}
            <a
              href="https://www.npmjs.com/package/@kanmon/web-sdk"
              target="_blank"
              rel="noopener noreferrer"
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
