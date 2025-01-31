import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", amount: 1000 },
  { name: "Feb", amount: 2000 },
  { name: "Mar", amount: 1500 },
  { name: "Apr", amount: 3000 },
  { name: "May", amount: 2500 },
]

export function TransactionsChart() {
  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Yearly Transactions</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

