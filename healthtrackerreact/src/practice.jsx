import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  todoitem: [{ id: 1, text: "Item1" }]
};

export const TodoSlicer = createSlice({
  name: "To-Do",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newtodoitem = {
        id: nanoid(),
        text: action.payload
      };
      state.todoitem.push(newtodoitem);
    },
    deleteTodo: (state, action) => {
      state.todoitem = state.todoitem.filter(
        item => item.id !== action.payload
      );
    }
  }
});

export const { addTodo, deleteTodo } = TodoSlicer.actions;
export default TodoSlicer.reducer;

