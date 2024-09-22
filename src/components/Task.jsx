import React, { useState } from 'react';

const Task = ({ task, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate);
  const [assignedUser, setAssignedUser] = useState(task.assignedTo);

  const handleSave = () => {
    const updatedTask = {
      ...task,
      title: editedTitle,
      description: editedDescription,
      dueDate: editedDueDate,
      assignedTo: assignedUser,
    };
    onSave(updatedTask); // Call the onSave function to update the task in the parent
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-2 rounded shadow mb-2">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border p-1 rounded mb-1"
          />
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="border p-1 rounded mb-1"
          />
          <input
            type="date"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
            className="border p-1 rounded mb-1"
          />
          <input
            type="text"
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
            placeholder="Assign to"
            className="border p-1 rounded mb-1"
          />
          <button onClick={handleSave} className="bg-green-500 text-white p-1 rounded">
            Save
          </button>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          <p>{task.description}</p>
          <p>Due: {task.dueDate}</p>
          <p>Assigned to: {assignedUser || 'Unassigned'}</p> {/* Display assigned user */}
          <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white p-1 rounded mr-1">
            Edit
          </button>
          <button onClick={() => onDelete(task.id)} className="bg-red-500 text-white p-1 rounded">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Task;