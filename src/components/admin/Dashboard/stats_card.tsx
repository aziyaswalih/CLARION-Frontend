interface StatsCardProps {
    title: string
    amount: string
    color: string
  }
  
  export function StatsCard({ title, amount, color }: StatsCardProps) {
    return (
      <div className={`p-6 rounded-lg ${color}`}>
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <p className="text-2xl font-bold text-white mt-2">{amount}</p>
      </div>
    )
  }
  
  