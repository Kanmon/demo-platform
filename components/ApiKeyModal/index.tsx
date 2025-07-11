import { axiosWithApiKey } from '@/utils'
import { getErrorCodeFromAxiosError } from '@/utils/getErrorCodeFromAxiosError'
import { Alert } from '@mui/material'
import Modal from '@mui/material/Modal'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useAsync, useAsyncFn } from 'react-use'
import { saveApiKey } from '../../store/apiKeySlice'
import { updateUseCdnSdk } from '../../store/kanmonConnectSlice'
import Button from '../shared/Button'
import { genericErrorMessage } from '@/utils/constants'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import FormikCheckboxInput from '@/components/shared/FormikCheckBoxField'
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
  const { query, pathname, replace, isReady } = useRouter()

  const [{ loading: saveApiKeyLoading, error: saveApiKeyError }, saveApiKeyFn] =
    useAsyncFn(async (values: FormValues) => {
      const { apiKey, useCdnSdk } = values
      await axiosWithApiKey(apiKey).get('/api/test_api_key')

      dispatch(saveApiKey({ apiKey }))
      dispatch(updateUseCdnSdk({ useCdnSdk }))
    })

  const error = getSaveApiKeyErrorMessage(saveApiKeyError)

  const { value: doneValidatedApiKeyFromQueryParam } = useAsync(
    async function extractApiKeyFromQueryParamWhenEmbedded() {
      if (!isReady) {
        return null
      }

      const queryApiKey = query?.kanmonApiKey as string | undefined

      if (queryApiKey) {
        try {
          await saveApiKeyFn({ apiKey: queryApiKey, useCdnSdk: false })
        } finally {
          // Remove query params after saving them
          replace(
            {
              pathname: pathname, // Keep the current path
              query: {}, // Empty query object removes all query parameters
            },
            undefined,
            { shallow: true },
          )
        }
      }

      return true
    },
    [query?.kanmonApiKey, query?.useCdnSdk],
  )

  // Prevent flickering when api key is passed through query param
  if (!doneValidatedApiKeyFromQueryParam) return null

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
              {({ isValid, handleSubmit, isSubmitting }) => {
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
                      <div className="col-span-6">
                        <FormikCheckboxInput<FormValues>
                          fieldName="useCdnSdk"
                          label="Use CDN SDK"
                          containerClass="flex items-center mb-4"
                        />
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
