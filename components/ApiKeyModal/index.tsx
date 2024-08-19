import { TestApiKeyErrorCode } from '@/pages/api/test_api_key'
import { axiosWithApiKey } from '@/utils'
import { Alert, TextField } from '@mui/material'
import Modal from '@mui/material/Modal'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAsync, useAsyncFn } from 'react-use'
import { saveApiKey } from '../../store/apiKeySlice'
import Button from '../shared/Button'

const getSaveApiKeyErrorMessage = (error: any) => {
  if (!error) return null

  if (
    isAxiosError(error) &&
    error.response?.data.errorCode === TestApiKeyErrorCode.INVALID_API_KEY
  ) {
    return 'You entered an invalid Kanmon API Key. Please try again.'
  }

  return 'An unexpected error occurred. Please try again or reach out to Kanmon for help.'
}

const ApiKeyModal = ({ open }: any) => {
  const dispatch = useDispatch()
  const { query, pathname, replace } = useRouter()
  const [localApiKey, setLocalApiKey] = useState('')

  const [{ loading: saveApiKeyLoading, error: saveApiKeyError }, saveApiKeyFn] =
    useAsyncFn(async (apiKey: string) => {
      await axiosWithApiKey(apiKey).get('/api/test_api_key')

      dispatch(saveApiKey({ apiKey }))
    })

  const error = getSaveApiKeyErrorMessage(saveApiKeyError)

  useAsync(async () => {
    const queryApiKey = query?.kanmonApiKey as string | undefined

    if (queryApiKey) {
      await saveApiKeyFn(queryApiKey)

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
  }, [query?.kanmonApiKey])

  return (
    <Modal open={open}>
      <>
        <div className="top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 bg-white text-center rounded w-[450px] md:w-[550px]">
          <div className="p-12">
            <div className="mt-4">
              <h1 className="text-xl font-semibold mb-8">
                Access the Demo Platform with your API Key
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  saveApiKeyFn(localApiKey)
                }}
              >
                <div className="mb-8">
                  <TextField
                    variant="outlined"
                    value={localApiKey}
                    placeholder={'Set Api Key'}
                    fullWidth
                    onChange={(e) => {
                      setLocalApiKey(e.target.value)
                    }}
                  />
                </div>

                <Button
                  fullWidth
                  variant="contained"
                  disabled={!localApiKey || saveApiKeyLoading}
                  color="primary"
                  type="submit"
                >
                  Start new demo
                </Button>
              </form>
            </div>
            {error && (
              <div className="my-4 text-left">
                <Alert severity="error">
                  You entered an invalid Kanmon API Key. Please try again.
                </Alert>
              </div>
            )}
          </div>
        </div>
      </>
    </Modal>
  )
}

export default ApiKeyModal
