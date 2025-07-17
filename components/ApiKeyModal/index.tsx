import { axiosWithApiKey } from '@/utils'
import { getErrorCodeFromAxiosError } from '@/utils/getErrorCodeFromAxiosError'
import { Alert } from '@mui/material'
import Modal from '@mui/material/Modal'
import { useDispatch } from 'react-redux'
import { useAsyncFn } from 'react-use'
import { saveApiKey } from '../../store/apiKeySlice'
import { updateUseCdnSdk } from '../../store/kanmonConnectSlice'
import Button from '../shared/Button'
import { genericErrorMessage } from '@/utils/constants'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import FormikTextInput from '@/components/shared/FormikTextField'

const getSaveApiKeyErrorMessage = (error: any) => {
  if (!error) return null

  if (getErrorCodeFromAxiosError(error) === 'ForbiddenException') {
    return 'You entered an invalid Kanmon API Key. Please try again.'
  }

  return genericErrorMessage
}

export interface FormValues {
  apiKey: string
  useCdnSdk: boolean
}

const apiKeyValidationSchema = Yup.object().shape({
  apiKey: Yup.string().trim().required('Api Key is required'),
})

const ApiKeyModal = ({ open }: any) => {
  const dispatch = useDispatch()

  const [{ loading: saveApiKeyLoading, error: saveApiKeyError }, saveApiKeyFn] =
    useAsyncFn(async (values: FormValues) => {
      const { apiKey, useCdnSdk } = values
      await axiosWithApiKey(apiKey).get('/api/test_api_key')

      dispatch(saveApiKey({ apiKey }))
      dispatch(updateUseCdnSdk({ useCdnSdk }))
    })

  const error = getSaveApiKeyErrorMessage(saveApiKeyError)

  const initialValues: FormValues = {
    apiKey: '',
    useCdnSdk: false,
  }

  return (
    <Modal open={open}>
      <>
        <div className="top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 bg-white text-center rounded w-[450px] md:w-[550px]">
          <div className="p-12">
            <Formik
              onSubmit={async (values) => {
                await saveApiKeyFn(values)
              }}
              initialValues={initialValues}
              validationSchema={apiKeyValidationSchema}
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
                      <div className="flex justify-start mb-4">
                        <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => setFieldValue('useCdnSdk', false)}
                            className={`px-3 py-1 rounded-l-md transition-colors duration-150
                              ${!values.useCdnSdk ? 'bg-white text-blue-600 border border-gray-300' : 'text-gray-600'}
                            `}
                          >
                            Web-sdk NPM
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
                        disabled={!isValid || isSubmitting || saveApiKeyLoading}
                        onClick={() => handleSubmit()}
                        color="primary"
                      >
                        Start new demo
                      </Button>
                    </Form>
                  </div>
                )
              }}
            </Formik>
            {error && (
              <div className="my-4 text-left">
                <Alert severity="error">{error}</Alert>
              </div>
            )}
          </div>
        </div>
      </>
    </Modal>
  )
}

export default ApiKeyModal
