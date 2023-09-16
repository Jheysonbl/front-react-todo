import "./Task.css";
import React, { useState } from "react";
import axios from 'axios';
import { Button, Checkbox, Input } from 'antd';


export default function Task({task, onDelete} ) {
  const [IsEditStatus, setIsEditStatus] = useState(false);
  const [TaskDescription, setTaskDescription] = useState(task.task1);
  const [TaskCompleted, setTaskCompleted] = useState(task.isCompleted);
  const [TaskDescriptionInitial, setTaskDescriptionInitial] = useState(
    task.task1
  );
  const [size, setSize] = useState('small');

  const onChange = (e) => {
    task.isCompleted = !task.isCompleted;
      updateTaskCompleted();
      setTaskCompleted(task.isCompleted);
  };

  function updateTaskCompleted () {    
    axios.post('http://localhost:7057/Task/EditTasks', task)
      .then(() => {
      })
      .catch(error => {
        console.error('Error al actualizar la tarea:', error);
      });
  };

  function handleEditTask() {
    setIsEditStatus(true);
  }
  function handleDeleteTask() {
    task.isDeleted = true;
    updateTaskCompleted(); 
    onDelete(task.idTask);
  }

  function handleSaveEditTask() {
    setIsEditStatus(false);
    task.task1 = TaskDescription;
    updateTaskCompleted();
  }
  function handleCancelEditTask() {
    setIsEditStatus(false);
    setTaskDescription(TaskDescriptionInitial);
  }

  return (
    <div className="taskContainer">
      <div className="task">
      <Checkbox onChange={onChange} checked={task.isCompleted}></Checkbox>

        {IsEditStatus && (
          <Input
          className="editDescription"
          size="small"
            type="text"
            value={TaskDescription}
            onChange={(e) => setTaskDescription(e.target.value.toUpperCase())}
          />
        )}

        {!IsEditStatus && (
          <span className={`taskDescription ${task.isCompleted && "completed"}`}>
            {TaskDescription}
          </span>
        )}
      </div>
      <div className="taskActions">
        {IsEditStatus && (
          <>
            <Button onClick={handleSaveEditTask} type="primary" size={size}>Save task</Button>
            <Button onClick={handleCancelEditTask} size={size}>Cancel</Button>
          </>
        )}

        {!IsEditStatus && <Button onClick={handleEditTask} size={size}>Edit task</Button>}

        <Button onClick={handleDeleteTask} type="primary" size={size}>Delete task</Button>
      </div>
    </div>
  );
}
