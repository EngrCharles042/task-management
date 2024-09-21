import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import List from "./List";

const Board = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  const defaultLists = [
    { id: 1, title: "To Do" },
    { id: 2, title: "In Progress" },
    { id: 3, title: "Done" },
  ];

  useEffect(() => {
    const storedBoards = JSON.parse(localStorage.getItem("boards"));
    if (storedBoards) {
      setBoards(storedBoards);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  const addBoard = () => {
    if (newBoardTitle.trim()) {
      const newBoard = {
        id: Date.now(), // Use a unique id based on the current timestamp
        title: newBoardTitle,
        lists: defaultLists,
      };
      setBoards([...boards, newBoard]);
      setNewBoardTitle("");
    }
  };

  const deleteBoard = (boardId) => {
    setBoards((prevBoards) =>
      prevBoards.filter((board) => board.id !== boardId)
    );
  };

  const moveBoard = (fromIndex, toIndex) => {
    const updatedBoards = [...boards];
    const [movedBoard] = updatedBoards.splice(fromIndex, 1);
    updatedBoards.splice(toIndex, 0, movedBoard);
    setBoards(updatedBoards);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Management Boards</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          placeholder="New board title"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={addBoard}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Board
        </button>
      </div>
      <div className="flex flex-col space-y-10">
        {boards.length === 0 ? (
          <p className="text-gray-500">
            No boards added yet. Create a new board!
          </p>
        ) : (
          boards.map((board, index) => (
            <DraggableBoard
              key={board.id}
              board={board}
              index={index}
              moveBoard={moveBoard}
              deleteBoard={deleteBoard}
            />
          ))
        )}
      </div>
    </div>
  );
};

const DraggableBoard = ({ board, index, moveBoard, deleteBoard }) => {
  const [, drag] = useDrag({
    type: "BOARD",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "BOARD",
    hover(item) {
      if (item.index !== index) {
        moveBoard(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="bg-gray-100 p-4 rounded-lg relative"
    >
      <h2 className="font-semibold text-lg mb-2">{board.title}</h2>
      <button
        onClick={() => deleteBoard(board.id)}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
      >
        Delete
      </button>

      <List lists={board.lists} boardId={board.id} />
    </div>
  );
};

export default Board;
