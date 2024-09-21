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
        id: boards.length + 1,
        title: newBoardTitle,
        lists: defaultLists, // Set predefined lists
      };
      setBoards([...boards, newBoard]);
      setNewBoardTitle("");
    }
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
        {boards.length === 0 ? ( // Check if there are no boards
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
            />
          ))
        )}
      </div>
    </div>
  );
};

const DraggableBoard = ({ board, index, moveBoard }) => {
  // useDrag hook for making the board draggable
  const [, drag] = useDrag({
    type: "BOARD",
    item: { index },
  });

  // useDrop hook for allowing the board to be dropped and reordered
  const [, drop] = useDrop({
    accept: "BOARD",
    hover(item) {
      if (item.index !== index) {
        moveBoard(item.index, index);
        item.index = index; // Update dragged item's index
      }
    },
  });

  // Combine drag and drop ref, attaching it to a native DOM element like div
  return (
    <div
      ref={(node) => drag(drop(node))}
      className="bg-gray-100 p-4 rounded-lg"
    >
      <h2 className="font-semibold text-lg mb-2">{board.title}</h2>
      <List lists={board.lists} boardId={board.id} />
    </div>
  );
};

export default Board;
