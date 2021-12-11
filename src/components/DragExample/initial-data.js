const initialData = {
  tasks: {
    "task-1": { id: 1, content: "Do my room." },
    "task-2": { id: 2, content: "Do my homework." },
    "task-3": { id: 3, content: "Clean the hedgehog." },
    "task-4": { id: 4, content: "Clean Mariano the dog." },
  },

  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
  },

  columnOrder: ["column-1"],
};

export default initialData;
