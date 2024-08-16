import Modal from '@mui/material/Modal'
import { useDispatch } from 'react-redux'
import Button from '../shared/Button'
import { saveApiKey } from '../../store/apiKeySlice'
import { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import { validate as isValidUUID } from 'uuid'
import { useRouter } from 'next/router'

const NEXT_PUBLIC_DEPLOY_ENV = process.env.NEXT_PUBLIC_DEPLOY_ENV as
  | 'production'
  | 'sandbox'
  | 'staging'
  | 'development'

const ApiKeyModal = ({ open }: any) => {
  const dispatch = useDispatch()
  const { query, pathname, replace } = useRouter()
  const [localApiKey, setLocalApiKey] = useState('')

  const setApiKey = () => {
    if (!localApiKey) return
    saveNewApiKey(localApiKey)
  }

  const saveNewApiKey = (apiKey: string) => {
    let apiKeyToTest = apiKey
    // Older api keys were simply uuids, but newer are prefixed with the deploy env
    if (apiKey.startsWith(NEXT_PUBLIC_DEPLOY_ENV)) {
      // Also removes the dash after the deploy env
      apiKeyToTest = apiKey.slice(NEXT_PUBLIC_DEPLOY_ENV.length + 1)
    }

    if (!isValidUUID(apiKeyToTest)) {
      console.log('Not a valid uuid!', apiKey)
      // throw a real error here that gets displayed
      return
    }

    localStorage.setItem('kanmonApiKey', apiKey)

    dispatch(
      saveApiKey({
        apiKey: apiKey,
      }),
    )
  }

  // Store the api key separately because when we logout - we delete the root store
  useEffect(() => {
    const storedApiKey = localStorage.getItem('kanmonApiKey')

    if (storedApiKey) {
      saveNewApiKey(storedApiKey)
    }
  }, [])

  useEffect(() => {
    const queryApiKey = query?.kanmonApiKey as string | undefined

    if (queryApiKey) {
      saveNewApiKey(queryApiKey)

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
                Access the Demo Platform with your Api Key
              </h1>

              <div className="mb-8">
                <TextField
                  variant="outlined"
                  value={localApiKey}
                  placeholder={'Set Api Key'}
                  fullWidth
                  onChange={(e) => setLocalApiKey(e.target.value)}
                />
              </div>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => setApiKey()}
              >
                Start new demo
              </Button>
            </div>
          </div>
        </div>
      </>
    </Modal>
  )
}

export default ApiKeyModal
