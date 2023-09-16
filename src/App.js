import React, { useEffect, useState } from "react";
import Task from "./components/Task/index.js";
import "./App.css";
import axios from 'axios';
import modelTask from './models/task';
import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Search } = Input;

export default function App() {
  const onSearch = (value, _e, info) => {    
    setTasksFiltered(
      tasks.filter((t) =>
        t.task1.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [tasksFiltered, setTasksFiltered] = useState([]);

  useEffect(() => {
    getData();
  }, []);
  

  function getData() {
    axios.get('http://localhost:7057/Task/GetTasks')
      .then(response => {
        setTasks(response.data);
        setTasksFiltered(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las tareas:', error);
      });
  }

  const handleDeleteTask = (taskId)=> {
    const updatedTasks = tasks.filter((task) => task.idTask !== taskId);
    setTasksFiltered(updatedTasks);
    setTasks(updatedTasks);
  }
  
  
  function handleAddTask() {
    const task1 = new modelTask();
    task1.task1 = newTask; 
    
    axios.post('http://localhost:7057/Task/CreateTask', task1)
      .then(response => {
        if(response.status === 200) {
          getData();
          setNewTask("");
        }
      })
      .catch(error => {
        console.error('Error al crear la tarea:', error);
      });    
  }
  
  return (
    <div className="mainDiv">
      <h1>Lista de Tareas</h1>      
      <div className="searchTask"> 
      <table>
  <tbody>
    <tr>
      <td className="addTask">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea"
        />
      </td>
      <td className="btnAddTask">
        <Button type="primary" onClick={handleAddTask} icon={<PlusOutlined />}>
          Add task
        </Button>
      </td>
      <td className="searchTask">
        <Search placeholder="input search text" onSearch={onSearch} enterButton/>
      </td>
    </tr>
  </tbody>
</table>
 <br/>
      </div>

      {tasksFiltered.map((task) => (
        <Task key={task.idTask} task={task} onDelete={handleDeleteTask} />
      ))}
    </div>
  );
}
