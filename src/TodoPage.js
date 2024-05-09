import React from 'react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import Favicon from "react-favicon";
import './styles/index.css';
import { CheckCircleIcon, MinusSquareIcon } from './icons';
import {Helmet} from "react-helmet";


const TodoPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isTasksLoading, setIsTasksLoading] = useState({});
  const [isMarkDoneLoading, setIsMarkDoneLoading] = useState({});

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
     .then(response => response.json())
     .then(data => setUsers(data))
     .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    setCompletedTasks(tasks.filter(task => task.completed === true));
  }, [tasks]);

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    setIsTasksLoading(prevIdLoading => ({
      ...prevIdLoading,
      [userId]: true,
    }))
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`)
     .then(response => response.json())
     .then(data => {
        setTasks(data);
      })
     .catch(error => console.error('Error fetching tasks:', error))
     .finally(() => {
      setIsTasksLoading(prevIdLoading => ({
       ...prevIdLoading,
        [userId]: false,
      }))
     })
  }

  const handleMarkDone = (taskId) => {
    setIsTasksLoading(prevIsLoading => ({
      ...prevIsLoading,
      [taskId]: true,
    }))

    fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completed: true
      })
    })
    .then(response => response.json())
    .then(() => {
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          task.completed = !task.completed;
        }
        return task;
      });
      setTasks(updatedTasks);
    })
    .catch(error => {
      console.error('Error marking task as done:', error)
    })
    .finally(() => {
      setIsMarkDoneLoading(prevIsLoading => ({
        ...prevIsLoading,
        [taskId]: false,
      }))
    })
  }

  return (
    <div className='TodoPage'>
      <Helmet>
        <title>GEEK Up Todo Web</title>
      </Helmet>
      <Favicon url={'https://images.glints.com/unsafe/160x0/glints-dashboard.s3.amazonaws.com/company-logo/e4173d2419fe012e9d7632c45c2c98d1.png'} />
    
      <div className='body'>
        <div className='select-user-container'>
          <div className='select-user-label'>
            <p>User<span className="line"></span></p>
          </div>
          <div className='select-user'>
            <Select
              value={selectedUser}
              onChange={option => handleUserSelect(option.userId)}
              options={users.map(user => (
                { value: user.name, label: user.name, userId: user.id}
              ))}
              isSearchable={true}
              placeholder={selectedUser ? users.filter(user => user.id === selectedUser)[0].name : "Select user"}
              styles={selectUserStyle}
            />
          </div>
        </div>

        <div className='tasks-container'>
          <div className='tasks-label'>
            <p>Tasks<span className="line"></span></p>
          </div>
          <div className='tasks'>
            {!selectedUser ? <p className='no-data'>No data</p> : isTasksLoading[selectedUser] ? <div className='spinner tasks-loading'></div> :
            tasks.sort((a, b) => {
              if (a.completed === true && b.completed === false) return 1;
              if (a.completed === false && b.completed === true) return -1;
              return 0;
            } )
            .map(task => (
              <div className='task-item' key={task.id}>
                <div className='title'>
                  {task.completed ? <CheckCircleIcon /> : <MinusSquareIcon />}
                  <p>{task.title}</p>
                </div>
                <div className='mark-done-container'>
                  {!task.completed ? 
                  <button 
                    className='mark-done-btn' 
                    onClick={() => handleMarkDone(task.id)}
                    disabled={isMarkDoneLoading[task.id]}
                  >
                      {isMarkDoneLoading[task.id] ? <div className='spinner'></div> : null}
                      <p>Mark done</p>
                  </button> : null}
                </div>
              </div>
            ))}
          </div>
          <div className='tasks-analysis'>
            <p>Done {completedTasks.length}/{tasks.length} tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoPage;

const selectUserStyle = {
  control: (provided) => ({
    ...provided,
    borderRadius: '6px',
    width: '230px',
    fontSize: '14px',
    fontFamily: "Roboto",
    
  }),
  option: (provided, state) => ({
    ...provided,
    width: '230px',
    color: 'rgb(0,0,0)',
    backgroundColor: state.isSelected ? 'rgb(63,150,254,0.25)' : 'white',
    '&:hover': {
      backgroundColor: state.isSelected ? 'rgb(63,150,254,0.25)' : 'rgb(239,239,239, 0.5)',
    },
  }),
};