interface Props {
  question: string
  answer: React.ReactNode
}

export const FinanceFaqEntry: React.FC<Props> = ({ question, answer }) => {
  return (
    <div className="py-14">
      <div className="font-bold text-xl mb-8 lg:text-3xl">{question}</div>
      <div className="text-base">{answer}</div>
    </div>
  )
}
