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
}

const ConfigPage = () => {
  const dispatch = useDispatch()
  const data = useSelector(getKanmonConnectSlice)
  const router = useRouter()
  const initialValues: FormValues = {
    useCdnSdk: data.useCdnSdk ?? false,
  }

  const saveConfigFn = (values: FormValues) => {
    const { useCdnSdk } = values
    dispatch(updateUseCdnSdk({ useCdnSdk }))
    router.push('/')
  }

  return (
    <div className="top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 bg-white text-center rounded w-[450px] md:w-[550px]">
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
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-44 text-sm font-medium text-gray-700">
                      Front end SDK Integration
                    </span>

                    <div className="w-[360px] rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
                      <div className="grid grid-cols-2 divide-x divide-gray-200">
                        <button
                          type="button"
                          onClick={() => setFieldValue('useCdnSdk', false)}
                          className={`py-2 px-3 text-sm font-medium transition-colors duration-150
                            ${
                              !values.useCdnSdk
                                ? 'bg-white text-blue-600'
                                : 'text-gray-600'
                            }`}
                        >
                          @kanmon/
                          <br />
                          web-sdk NPM
                          <br />
                          <span className="ml-1 text-[10px] text-blue-600 rounded px-1">
                            (recommended)
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFieldValue('useCdnSdk', true)}
                          className={`py-2 px-3 text-sm font-medium transition-colors duration-150
                            ${
                              values.useCdnSdk
                                ? 'bg-white text-blue-600'
                                : 'text-gray-600'
                            }`}
                        >
                          Kanmon CDN
                        </button>
                      </div>
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
