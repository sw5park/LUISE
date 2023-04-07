import React, { useState } from 'react';
import Tree from 'react-d3-tree';
import axios from 'axios';
import './App.css';

interface Task {
  taskId: number;
  task_name: string;
  status: 'Incomplete' | 'Complete';
  result?: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { taskId: 1, task_name: 'Task 1', status: 'Incomplete' },
    { taskId: 2, task_name: 'Task 2', status: 'Complete' },
    { taskId: 3, task_name: 'Task 3', status: 'Incomplete' },
  ]);

  const treeData = tasks.map((task, index) => ({
    name: `Task ${task.taskId} - ${task.task_name}: ${task.status}` + (task.result ? ` (Result: ${task.result})` : ''),
    children: index < tasks.length - 1 ? [] : undefined,
  }));

  const executePythonScript = async () => {
    try {
      const response = await axios.get("http://localhost:5000/execute-script");
      const result = response.data.result;
      console.log("Result from Python script:", result);
      // Handle the result as needed
    } catch (error) {
      console.error("Error executing Python script:", error);
    }
  };

  const simulateTaskCreation = () => {
    const newTasks: Task[] = [
      { taskId: 4, task_name: 'New Task 1', status: 'Incomplete' },
      { taskId: 5, task_name: 'New Task 2', status: 'Incomplete' },
      { taskId: 6, task_name: 'New Task 3', status: 'Complete', result: 'Result 6' },
    ];

    setTasks((prevTasks) => [...prevTasks, ...newTasks]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Status Visualization</h1>
        <div style={{ width: '100%', height: '500px' }}>
          <Tree data={treeData} />
        </div>
        <button onClick={executePythonScript}>Execute Python Script</button>
        <button onClick={simulateTaskCreation}>Simulate Task Creation</button>
      </header>
    </div>
  );
}

export default App;
