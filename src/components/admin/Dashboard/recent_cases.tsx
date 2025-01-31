import { Button } from "../../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"

const cases = [
  {
    id: "001",
    name: "Sarah Reading",
    amount: "$500",
    status: "Completed",
    date: "2024-01-25",
  },
  {
    id: "002",
    name: "David Anderson",
    amount: "$750",
    status: "Pending",
    date: "2024-01-24",
  },
  {
    id: "003",
    name: "Mark Stanley",
    amount: "$1000",
    status: "Processing",
    date: "2024-01-23",
  },
  {
    id: "004",
    name: "Rachel Harrison",
    amount: "$250",
    status: "Completed",
    date: "2024-01-22",
  },
]

export function RecentCases() {
  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Recent Cases</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((case_) => (
            <TableRow key={case_.id}>
              <TableCell>{case_.name}</TableCell>
              <TableCell>{case_.amount}</TableCell>
              <TableCell>{case_.date}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    case_.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : case_.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {case_.status}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

