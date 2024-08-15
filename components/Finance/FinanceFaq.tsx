import classNames from 'classnames'
import { FinanceFaqEntry } from './FinanceFaqEntry'

const faqItems = [
  {
    question: 'Does enrolling in the program affect my credit score?',
    answer: (
      <>
        Nope! During the onboarding process we will only conduct a soft pull on
        your credit report, which will not affect your personal credit score.
      </>
    ),
  },
  {
    question: 'Why do I need to provide my bank connection details?',
    answer: (
      <>
        Securely connecting your business bank account allows us to review your
        cashflow and determine your best loan offers.
      </>
    ),
  },
  {
    question: 'When should I expect to receive a loan offer?',
    answer: (
      <>
        Once you are enrolled into the program, we will be actively analyzing
        your financials and creating pre-approved offers that work best for your
        business needs. We do this to help you avoid debt trap. Loan offers are
        usually provided within less than 48 hours.
      </>
    ),
  },
  {
    question: 'How do I repay the loan?',
    answer: (
      <>
        <>
          At the moment we support monthly loan repayment once you agree to the
          loan payment schedule. A fixed amount will be automatically deducted
          from the bank you linked during the onboarding.
        </>
        <>
          In the near future, you can also choose to pay back the loan as a
          fixed percentage of your daily sales until the loan is fully repaid.
        </>
      </>
    ),
  },
]

export const FinanceFaq = () => {
  return (
    <div
      className={classNames(
        'pt-16 pb-4 w-full',
        'lg:pt-24 lg:flex lg:flex-col lg:items-center',
      )}
    >
      <div className={classNames('px-16', 'lg:max-w-[42rem]')}>
        <div
          className={classNames('font-bold text-4xl', 'lg:text-center lg:mb-8')}
        >
          FAQ’s
        </div>
        {faqItems.map((item, index: number) => {
          return (
            <FinanceFaqEntry
              key={`faq-${index}`}
              question={item.question}
              answer={item.answer}
            />
          )
        })}
      </div>
    </div>
  )
}
