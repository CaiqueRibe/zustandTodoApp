import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export type Todo = {
   id: number
   title: string
   completed: boolean
}

interface TodoStore {
   todos: Todo[] | []
   addTodo: (todo: Todo) => void
   removeTodo: (id: number) => void
   toggleTodo: (id: number) => void
   editTodo: (id: number, title: string) => void
   loadTodos: () => Promise<void>
   resetStore: () => void
}

export const useTodoStore = create<TodoStore>()(
   persist(
      devtools((set) => ({
         todos: [],

         loadTodos: async () => {
            const res = await fetch("https://jsonplaceholder.typicode.com/todos")
            const data: Todo[] = await res.json()
            set({ todos: data }, false, "LoadingInfo")
         },

         resetStore: () => set({ todos: [] }),

         addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] }), false, "AddTask"),

         removeTodo: (id) =>
            set(
               (state) => ({
                  todos: state.todos.filter((todos) => todos.id !== id),
               }),
               false,
               "RemoveTodo"
            ),

         toggleTodo: (id) =>
            set(
               (state) => ({
                  todos: state.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
               }),
               false,
               "ToggleTodo"
            ),

         editTodo: (id, title) =>
            set(
               (state) => ({ todos: state.todos.map((todo) => (todo.id === id ? { ...todo, title } : todo)) }),
               false,
               "EditTodo"
            ),
      })),
      {
         name: "todo-store",
      }
   )
)
