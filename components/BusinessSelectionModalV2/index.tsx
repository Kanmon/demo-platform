import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useAsync, useAsyncFn } from 'react-use'
import { v4 } from 'uuid'
import * as Yup from 'yup'
import AdditonalConfigOptions from './additionalConfigOptions'
import { saveCredentials } from '@/store/authSlice'
import {
  KanmonClient,
  axiosWithApiKey,
  basicCssClassUpdater,
} from '../../utils'
import Button from '../shared/Button'
import FormikTextInput from '../shared/FormikTextField'
import {
  CreateBusinessAndUserRequestBody,
  CreateUserResponsePayload,
  ProductType,
  TestingPrequalType,
  UserRole,
} from '../../types/MoreTypes'
import { getApiKeyState, resetApiKey } from '../../store/apiKeySlice'
import storage from 'redux-persist/lib/storage'
import { resetStoreAction } from '@/store/store'

interface AutocompleteOption {
  email?: string
  userId: string
  platformUserId?: string
}

interface BusinessSelectionModalProps {
  open: boolean
}

const emailIsAlias = (email: string) => {
  return email.includes('+')
}

const fakeAliasOnError = (email: string) => {
  const splitEmail = email.split('@')

  return splitEmail[0] + '+alias1@' + splitEmail[1]
}

const demoFlowStartingValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .trim()
    .required('Email is required'),
})

export interface FormValues {
  email: string
  userRoles: UserRole[]
  platformBusinessId: string
  prequalifyForProduct?: ProductType
  prequalType: TestingPrequalType
}

const BusinessSelectionModalV2 = ({ open }: BusinessSelectionModalProps) => {
  const [showAdditionalConfiguration, setShowAdditionalConfiguration] =
    useState(false)

  const [selectedUser, setSelectedUser] = useState<AutocompleteOption | null>(
    null,
  )

  const [anonSuccess, setAnonSuccess] = useState(false)

  const { apiKey } = useSelector(getApiKeyState)

  const dispatch = useDispatch()

  const [{ error: createBusinessError }, createBusiness] = useAsyncFn(
    async (body: CreateBusinessAndUserRequestBody) => {
      const connectUrl = `/api/create_business_v2`

      const axiosResponse = await axiosWithApiKey(
        apiKey,
      ).post<CreateUserResponsePayload>(connectUrl, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = axiosResponse.data

      return response
    },
    [],
  )

  const {
    value: existingBusinesses = [],
    error: existingBusinessesError,
    loading: existingBusinessesLoading,
  } = useAsync(async () => {
    if (apiKey) {
      const kanmonClient = new KanmonClient(apiKey)

      const response = await kanmonClient.getBusinesses()

      const businesses = response.businesses

      const businessIds = businesses.map((b) => b.id).join(',')

      const userResponse = await kanmonClient.getUsers({ businessIds })

      const matchingPrimaryUsers = userResponse.users.filter((u) =>
        u.roles?.includes(UserRole.PRIMARY_OWNER),
      )

      return matchingPrimaryUsers
        .map((u) => {
          return {
            // Temporary
            email: u.email as unknown as string,
            platformUserId: u.platformUserId,
            userId: u.id,
          }
        })
        .filter((biz) => biz.email || biz.platformUserId)
    }

    return []
  }, [apiKey])

  const error = existingBusinessesError || (createBusinessError as any)
  const loading = existingBusinessesLoading

  const onStartWithNewBusinessClick = async ({
    prequalifyForProduct,
    email,
    platformBusinessId,
    userRoles,
    prequalType,
  }: {
    email: string
    prequalifyForProduct?: ProductType
    platformBusinessId: string
    userRoles: UserRole[]
    prequalType: TestingPrequalType
  }) => {
    const results = await createBusiness({
      email,
      prequalifyForProduct,
      platformBusinessId,
      userRoles,
      prequalType,
    })
    if (prequalType !== TestingPrequalType.ANON) {
      dispatch(saveCredentials({ userId: results.id, email }))
    } else {
      setAnonSuccess(true)
      // Close after 5 seconds
      setTimeout(() => {
        setAnonSuccess(false)
      }, 5000)
    }
  }

  const onExistingBusinessSelect = () => {
    if (!selectedUser) return

    dispatch(
      saveCredentials({
        userId: selectedUser.userId,
        email: selectedUser.email,
      }),
    )
  }

  useAsync(async () => {
    if (error) {
      const errorResponse = await error.response.json()

      if (errorResponse.errorCode === 'ForbiddenException') {
        storage.removeItem('persist:kanmonDemo')
        dispatch(resetApiKey())
        return
      }
    }
  }, [error])

  const renderErrorAlert = ({ email }: { email: string }) => {
    if (!error) return null

    if (
      error.response.errorCode ===
      'BusinessOwnerAlreadyExistsWithEmailException'
    ) {
      return (
        <div className="text-left my-4">
          <Alert severity="error" className="flex justify-center">
            Looks like this email has been used before!
            {emailIsAlias(email) ? (
              <div>Please try a new alias!</div>
            ) : (
              <div>
                We recommend using an alias, which can be done using a + symbol.
                <br />
                For example: <br />
                {fakeAliasOnError(email)}
              </div>
            )}
          </Alert>
        </div>
      )
    }

    if (
      error.response.errorCode ===
      'PrimaryBusinessOwnerAlreadyExistsForBusinessException'
    ) {
      return (
        <div className="text-left my-4">
          <Alert severity="error" className="flex justify-center">
            Looks like this business already has a primary owner. If you want to
            create a new user for this business, try selecting another role.
          </Alert>
        </div>
      )
    }

    return (
      <div className="my-4 text-left">
        <Alert severity="error">
          Something went wrong. We’re looking into the issue and apologize for
          the inconvenience.
        </Alert>
      </div>
    )
  }

  const buildInitialValues = (): FormValues => {
    return {
      email: `demo+${v4().slice(0, 18)}@kanmonhq.com`,
      userRoles: [UserRole.PRIMARY_OWNER],
      platformBusinessId: v4(),
      prequalifyForProduct: undefined,
      prequalType: TestingPrequalType.STANDARD,
    }
  }

  const initialValues: FormValues = buildInitialValues()

  if (loading) return null

  return (
    <Modal open={open}>
      <>
        <div className="top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 bg-white text-center rounded w-[450px] md:w-[550px]">
          {anonSuccess && (
            <div className="h-12 w-full bg-emerald-600 text-white flex items-center justify-center gap-8 font-semibold">
              <span>Successful Anonymous Prequal!</span>
            </div>
          )}
          <div className="pt-12">
            <div className="mt-4 px-12">
              <Formik
                onSubmit={(values, helpers) => {
                  onStartWithNewBusinessClick({
                    email: values.email,
                    userRoles: values.userRoles,
                    platformBusinessId: values.platformBusinessId,
                    prequalifyForProduct: values.prequalifyForProduct,
                    prequalType: values.prequalType,
                  })
                  // Reset the form after its succesful
                  helpers.resetForm({ values: buildInitialValues() })
                }}
                initialValues={initialValues}
                validationSchema={demoFlowStartingValidationSchema}
                validateOnMount={true}
              >
                {({ isValid, values, handleSubmit }) => {
                  return (
                    <>
                      <Form>
                        {/* Anon user screen*/}
                        {existingBusinesses.length === 0 && (
                          <>
                            {!showAdditionalConfiguration ? (
                              <>
                                {/* quick start  */}
                                <h1 className="text-xl font-semibold mb-8">
                                  Start the process by creating a business
                                </h1>
                                <FormikTextInput
                                  updateContainerCss={basicCssClassUpdater(
                                    'mb-4',
                                  )}
                                  fieldName="email"
                                  label={'Email'}
                                  type="email"
                                  placeholder={'Enter email'}
                                />

                                <Button
                                  fullWidth
                                  disabled={!isValid}
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSubmit()}
                                >
                                  Start new demo
                                </Button>

                                <p
                                  onClick={() => {
                                    setShowAdditionalConfiguration(true)
                                    setSelectedUser(null)
                                  }}
                                  className="text-left text-sm hover:cursor-pointer text-[#1976d2] mt-4"
                                >
                                  Show additional configurations →
                                </p>
                              </>
                            ) : (
                              <AdditonalConfigOptions
                                setShowAdditionalConfiguration={
                                  setShowAdditionalConfiguration
                                }
                                handleSubmit={handleSubmit}
                                isValid={isValid}
                              />
                            )}
                          </>
                        )}

                        {/* Auth'd user screen */}
                        {existingBusinesses.length > 0 && (
                          <>
                            {!showAdditionalConfiguration ? (
                              <>
                                <h1 className="text-xl font-semibold mb-8">
                                  Select an existing business
                                </h1>
                                <Autocomplete<AutocompleteOption>
                                  options={existingBusinesses}
                                  onChange={(
                                    _event,
                                    value: AutocompleteOption | null,
                                  ) => {
                                    setSelectedUser(value)
                                  }}
                                  getOptionLabel={(o: AutocompleteOption) =>
                                    o.email || o.platformUserId || o.userId
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="select a business"
                                    />
                                  )}
                                />

                                <div className="mt-6">
                                  <Button
                                    fullWidth
                                    disabled={!selectedUser}
                                    variant="contained"
                                    color="primary"
                                    onClick={onExistingBusinessSelect}
                                  >
                                    Select existing business
                                  </Button>
                                </div>

                                <div className="my-6 flex justify-center items-center">
                                  <hr
                                    className="inline-block bg-gray-200"
                                    style={{ height: '2px', width: '200px' }}
                                  />
                                  <span className="text-xl mx-4"> OR </span>
                                  <hr
                                    className="inline-block bg-gray-200"
                                    style={{ height: '2px', width: '200px' }}
                                  />
                                </div>

                                <Button
                                  fullWidth
                                  disabled={!isValid}
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleSubmit()}
                                >
                                  Start new demo
                                </Button>

                                <p
                                  onClick={() => {
                                    setShowAdditionalConfiguration(true)
                                    setSelectedUser(null)
                                  }}
                                  className="text-left text-sm hover:cursor-pointer text-[#1976d2] mt-4"
                                >
                                  Show additional configurations →
                                </p>
                              </>
                            ) : (
                              <AdditonalConfigOptions
                                setShowAdditionalConfiguration={
                                  setShowAdditionalConfiguration
                                }
                                handleSubmit={handleSubmit}
                                isValid={isValid}
                              />
                            )}
                          </>
                        )}
                      </Form>

                      {renderErrorAlert({ email: values.email })}
                    </>
                  )
                }}
              </Formik>
            </div>
            <div className="flex items-center justify-end pt-8 pb-4 pr-4">
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  dispatch(resetStoreAction(true))
                }}
              >
                Remove Api Key
              </Button>
            </div>
          </div>
        </div>
      </>
    </Modal>
  )
}

export default BusinessSelectionModalV2
