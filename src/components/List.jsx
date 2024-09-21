import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import Task from "./Task";

const List = ({ lists, boardId }) => {
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    const storedTasks =
      JSON.parse(localStorage.getItem(`tasks_${boardId}`)) || {};
    setTasks(storedTasks);
  }, [boardId]);

  useEffect(() => {
    localStorage.setItem(`tasks_${boardId}`, JSON.stringify(tasks));
  }, [tasks, boardId]);

  const addTask = (listId, title, description, dueDate, assignedUser) => {
    const newTask = {
      id: tasks[listId] ? tasks[listId].length + 1 : 1,
      title,
      description,
      dueDate,
      assignedTo: assignedUser, // Assign user to task
    };
    setTasks((prevTasks) => ({
      ...prevTasks,
      [listId]: [...(prevTasks[listId] || []), newTask],
    }));
  };

  const deleteTask = (listId, taskId) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [listId]: prevTasks[listId].filter((task) => task.id !== taskId),
    }));
  };

  const moveTask = (fromListId, toListId, taskId, newPositionIndex) => {
    setTasks((prevTasks) => {
      const taskToMove = prevTasks[fromListId].find(
        (task) => task.id === taskId
      );
      const newFromList = prevTasks[fromListId].filter(
        (task) => task.id !== taskId
      );

      if (fromListId === toListId) {
        // Reordering within the same list
        const updatedTasks = [...newFromList];
        updatedTasks.splice(newPositionIndex, 0, taskToMove); // Insert task at the new position
        return {
          ...prevTasks,
          [fromListId]: updatedTasks,
        };
      }

      // Moving to a different list
      return {
        ...prevTasks,
        [fromListId]: newFromList,
        [toListId]: [...(prevTasks[toListId] || []), taskToMove],
      };
    });
  };

  return (
    <div className="flex max-md:flex-wrap gap-2">
      {lists.map((list) => (
        <DroppableList
          key={list.id}
          list={list}
          tasks={tasks[list.id] || []}
          boardId={boardId}
          moveTask={moveTask}
          addTask={addTask}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
};

const DroppableList = ({
  list,
  tasks,
  boardId,
  moveTask,
  addTask,
  deleteTask,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => moveTask(item.listId, list.id, item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`bg-gray-200 p-4 rounded-lg w-full ${
        isOver ? "border-2 border-blue-500" : ""
      }`}
    >
      <h3 className="font-semibold mb-2">{list.title}</h3>
      <TaskForm listId={list.id} onAddTask={addTask} />
      {tasks.map((task) => (
        <DraggableTask
          key={task.id}
          task={task}
          listId={list.id}
          onDelete={() => deleteTask(list.id, task.id)}
        />
      ))}
    </div>
  );
};

const DraggableTask = ({ task, listId, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, listId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`bg-white p-2 rounded shadow mb-2 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Task task={task} onDelete={onDelete} />
    </div>
  );
};

const TaskForm = ({ listId, onAddTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [assignedUser, setAssignedUser] = useState(""); // New state for assigned user

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(
      listId,
      newTaskTitle,
      newTaskDescription,
      newTaskDueDate,
      assignedUser
    );
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDueDate("");
    setAssignedUser(""); // Reset assigned user
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="Task title"
        className="border p-2 rounded"
      />
      <input
        type="text"
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
        placeholder="Task description"
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={newTaskDueDate}
        onChange={(e) => setNewTaskDueDate(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        value={assignedUser}
        onChange={(e) => setAssignedUser(e.target.value)}
        placeholder="Assign to"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Task
      </button>
    </form>
  );
};

export default List;
