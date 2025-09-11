import { Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import {
  getKanmonConnectSlice,
  updateUseCdnSdk,
} from '../../store/kanmonConnectSlice'
import Button from '@/components/shared/Button'
import { useRouter } from 'next/router'

interface FormValues {
  useCdnSdk: boolean
  enableV2View: boolean
}

const ConfigPage = () => {
  const dispatch = useDispatch()
  const data = useSelector(getKanmonConnectSlice)
  const router = useRouter()
  const initialValues: FormValues = {
    useCdnSdk: data.useCdnSdk ?? false,
    enableV2View: data.enableV2View ?? false,
  }

  const saveConfigFn = (values: FormValues) => {
    const { useCdnSdk, enableV2View } = values
    dispatch(updateUseCdnSdk({ useCdnSdk, enableV2View }))
    router.push('/')
  }

  return (
    <div className="top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 bg-white text-center rounded w-[450px] md:w-[650px]">
      <div className="p-12">
        <Formik
          onSubmit={saveConfigFn}
          initialValues={initialValues}
          validateOnMount={true}
        >
          {({ isValid, handleSubmit, isSubmitting, values, setFieldValue }) => {
            return (
              <div className="mt-4">
                <h1 className="text-xl font-semibold mb-8">Configurations</h1>
                <Form>
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

                    <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 text-sm font-medium ml-1">
                      <button
                        type="button"
                        onClick={() => setFieldValue('enableV2View', (!values.enableV2View))}
                        className={`px-5 py-1 rounded-md transition-colors duration-150
                          ${values.enableV2View ? 'bg-white text-blue-600 border border-gray-300' : 'text-gray-600'}
                        `}
                      >
                        Enable V2 Styling
                      </button>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    variant="contained"
                    disabled={!isValid || isSubmitting}
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
      </div>
    </div>
  )
}

export default ConfigPage
