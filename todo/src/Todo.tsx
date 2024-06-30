/**
 * v0 by Vercel.
 * @see https://v0.dev/t/A9IIyYhRywj
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState, useMemo, ComponentPropsWithRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { randText, randBoolean } from "@ngneat/falso";

type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};
type TodoDraft = Pick<Todo, "title" | "description">;
type TodoFilter = "all" | "completed" | "pending";

const generateTodo = (): Todo => ({
  id: crypto.randomUUID(),
  completed: randBoolean(),
  description: randText(),
  title: randText(),
});

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<TodoDraft>({
    title: "",
    description: "",
  });
  const [filter, setFilter] = useState<TodoFilter>("all");
  const addTodo = () => {
    const title = newTodo.title.trim();
    if (title) {
      setTodos((prevTodos) => [
        ...prevTodos,
        {
          id: crypto.randomUUID(),
          title: title,
          description: newTodo.description,
          completed: false,
        },
      ]);
      setNewTodo({ title: "", description: "" });
    }
  };
  const add1kTodos = () =>
    setTodos((prevTodos) => [
      ...prevTodos,
      ...Array.from({ length: 1_000 }, () => generateTodo()),
    ]);
  const toggleTodoStatus = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "pending":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <h1 className="text-2xl font-bold">Todo List</h1>
      </header>
      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Add a new todo"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            maxLength={200}
          />
          <Input
            type="text"
            placeholder="Description"
            value={newTodo.description}
            maxLength={500}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }
          />
          <Button onClick={addTodo}>Add</Button>
          <Button onClick={add1kTodos}>Add 1k todos</Button>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {filter === "all"
                  ? "All"
                  : filter === "completed"
                    ? "Completed"
                    : "Pending"}
                <ChevronDownIcon className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("pending")}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTodos.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell
                    className={cn({
                      "line-through text-muted-foreground": todo.completed,
                    })}
                  >
                    {todo.title}
                  </TableCell>
                  <TableCell
                    className={cn({
                      "line-through text-muted-foreground": todo.completed,
                    })}
                  >
                    {todo.description}
                  </TableCell>
                  <TableCell>
                    {todo.completed ? (
                      <Badge variant="secondary">Completed</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleTodoStatus(todo.id)}
                    >
                      {todo.completed ? (
                        <UndoIcon className="w-4 h-4" />
                      ) : (
                        <CheckIcon className="w-4 h-4" />
                      )}
                      <span className="sr-only">
                        {todo.completed
                          ? "Mark as pending"
                          : "Mark as completed"}
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ChevronDownIcon(props: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function UndoIcon(props: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}
