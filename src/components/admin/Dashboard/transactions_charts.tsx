import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", amount: 1000 },
  { name: "Feb", amount: 2000 },
  { name: "Mar", amount: 1500 },
  { name: "Apr", amount: 3000 },
  { name: "May", amount: 2500 },
];

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
  );
}

// "use client"

// import { TrendingUp } from "lucide-react"
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card"
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "../../../components/ui/chart"

// type ChartConfig = {
//   desktop: {
//     label: string
//     color: string
//   }
//   mobile: {
//     label: string
//     color: string
//   }
//   other: {
//     label: string
//     color: string
//   }
// }
// const chartData = [
//   { month: "January", desktop: 186, mobile: 80, other: 45 },
//   { month: "February", desktop: 305, mobile: 200, other: 100 },
//   { month: "March", desktop: 237, mobile: 120, other: 150 },
//   { month: "April", desktop: 73, mobile: 190, other: 50 },
//   { month: "May", desktop: 209, mobile: 130, other: 100 },
//   { month: "June", desktop: 214, mobile: 140, other: 160 },
// ]

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "hsl(var(--chart-1))",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "hsl(var(--chart-2))",
//   },
//   other: {
//     label: "Other",
//     color: "hsl(var(--chart-3))",
//   },
// } satisfies ChartConfig

// export function TransactionsChart() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Area Chart - Stacked Expanded</CardTitle>
//         <CardDescription>
//           Showing total visitors for the last 6months
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer>
//           <AreaChart
//             accessibilityLayer
//             data={chartData}
//             margin={{
//               left: 12,
//               right: 12,
//               top: 12,
//             }}
//             stackOffset="expand"
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip>
//               <ChartTooltipContent indicator="line" />
//             </ChartTooltip>
//             <Area
//               dataKey="other"
//               type="natural"
//               fill="var(--color-other)"
//               fillOpacity={0.1}
//               stroke="var(--color-other)"
//               stackId="a"
//             />
//             <Area
//               dataKey="mobile"
//               type="natural"
//               fill="var(--color-mobile)"
//               fillOpacity={0.4}
//               stroke="var(--color-mobile)"
//               stackId="a"
//             />
//             <Area
//               dataKey="desktop"
//               type="natural"
//               fill="var(--color-desktop)"
//               fillOpacity={0.4}
//               stroke="var(--color-desktop)"
//               stackId="a"
//             />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter>
//         <div className="flex w-full items-start gap-2 text-sm">
//           <div className="grid gap-2">
//             <div className="flex items-center gap-2 font-medium leading-none">
//               Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//             </div>
//             <div className="flex items-center gap-2 leading-none text-muted-foreground">
//               January - June 2024
//             </div>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }
