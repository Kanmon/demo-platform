import Button from '../shared/Button'
import {
  ProductType,
  productTypeToDisplayName,
  TestingPrequalType,
  UserRole,
} from '@/types/MoreTypes'
import FormikTextInput from '../shared/FormikTextField'
import { basicCssClassUpdater } from '@/utils'
import { FormValues } from './index'
import FormikSelectInput from '../shared/FormikSelectField'

export const notInvoiceFinancingProduct = (productType: ProductType) => {
  return productType !== ProductType.ACCOUNTS_PAYABLE_FINANCING
}
interface Props {
  setShowAdditionalConfiguration: (show: boolean) => void
  handleSubmit: () => void
  isDisabled: boolean
  platformEnabledProducts: ProductType[]
}
const AdditonalConfigOptions = ({
  setShowAdditionalConfiguration,
  handleSubmit,
  platformEnabledProducts,
  isDisabled,
}: Props) => {
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Additional configurations</h1>

      <FormikTextInput
        updateContainerCss={basicCssClassUpdater('mb-4')}
        fieldName="email"
        label={'Email'}
        type="email"
        placeholder={'Enter email'}
      />
      <div className="grid gap-2 grid-cols-12 mt-4">
        <div className="col-span-6">
          <FormikSelectInput
            multiple
            fieldName="userRoles"
            label="User Roles"
            options={[
              {
                label: 'Primary Owner',
                value: UserRole.PRIMARY_OWNER,
              },
              {
                label: 'Operator',
                value: UserRole.OPERATOR,
              },
            ]}
          />
        </div>
        <div className="col-span-6">
          <FormikTextInput
            updateContainerCss={basicCssClassUpdater('mb-4')}
            fieldName="platformBusinessId"
            label={'Platform Business ID'}
          />
        </div>
        <div className="col-span-6">
          <FormikSelectInput<FormValues>
            includeNone
            label={'Prequalify for a product'}
            fieldName="prequalifyForProduct"
            options={platformEnabledProducts
              .filter(notInvoiceFinancingProduct)
              .map((productType) => ({
                label: productTypeToDisplayName[productType],
                value: productType,
              }))}
          />
        </div>
        <div className="col-span-6">
          <FormikSelectInput<FormValues>
            includeNone
            label={'Prequal Type'}
            fieldName="prequalType"
            options={[
              {
                label: 'Standard',
                value: TestingPrequalType.STANDARD,
              },
              {
                label: 'Anonymous',
                value: TestingPrequalType.ANON,
              },
            ]}
          />
        </div>
      </div>

      <div className="mt-4">
        <Button
          fullWidth
          variant="contained"
          color="primary"
          disabled={!isDisabled}
          onClick={() => handleSubmit()}
        >
          Start new demo
        </Button>
        <p
          onClick={() => setShowAdditionalConfiguration(false)}
          className="text-left text-sm hover:cursor-pointer text-[#1976d2] mt-4"
        >
          ← Hide additional configurations
        </p>
      </div>
    </>
  )
}

export default AdditonalConfigOptions
