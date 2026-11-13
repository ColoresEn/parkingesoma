import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITodo } from "@/interfaces";
import TodosTableActions from "./TodosTableActions";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";

interface IProps {
  todos: ITodo[];
}

export default function TodosTable({ todos }: IProps) {
  return (
    <Table className="font-bold bg-white border border-violet-800">
      <TableCaption className="font-bold text-violet-600 ">A list of your todos.</TableCaption>
      <TableHeader className="bg-violet-400 ">
        <TableRow>
          {/* <TableHead>ID</TableHead> */}
          <TableHead className="font-bold text-black">Title</TableHead>
          <TableHead className="font-bold text-black">Status</TableHead>
          <TableHead className="font-bold text-black">Created At</TableHead>
          <TableHead className="font-bold text-black">Updated At</TableHead>
          <TableHead className="text-right ont-bold text-black">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-black border border-violet-600">
        {todos.map((todo) => (
          <TableRow key={todo?.id} className="border border-violet-800">
            {/* <TableCell className="font-medium">{todo?.id}</TableCell> */}
            <TableCell className={todo.completed ? "line-through" : ""}>
              {todo?.title}
            </TableCell>
            <TableCell>
              {todo?.completed ? (
                <Badge>Completed</Badge>
              ) : (
                <Badge variant="secondary">Uncompleted</Badge>
              )}
            </TableCell>
            <TableCell>{dayjs(todo.createdAt).format("MMMM D YYYY")}</TableCell>
            <TableCell>{dayjs(todo.updatedAt).format("MMMM D YYYY, H:MM A")}</TableCell>
            <TableCell className="flex items-center justify-end space-x-2">
              <TodosTableActions todo={todo} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="bg-violet-300 text-black">
        <TableRow>
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell className="text-right">
            {!todos.length ? "YOU DON'T HAVE ANY TODO YET!" : todos.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
