import React from 'react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import ReactLoading from 'react-loading';
import './styles/index.css';
import { CheckCircleIcon, MinusSquareIcon } from './icons';


const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState({});

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
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`)
     .then(response => response.json())
     .then(data => {
        setTasks(data);
      })
     .catch(error => console.error('Error fetching tasks:', error));
  }

  const handleMarkDone = (taskId) => {
    setIsLoading(prevIsLoading => ({
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
      setIsLoading(prevIsLoading => ({
        ...prevIsLoading,
        [taskId]: false,
      }))
    })
  }

  return (
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
            placeholder="Select user"
            styles={customStyles}
          />
        </div>
      </div>

      <div className='tasks-container'>
        <div className='tasks-label'>
          <p>Tasks<span className="line"></span></p>
        </div>
        <div className='tasks'>
          {tasks.sort((a, b) => {
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
                  disabled={isLoading[task.id]}
                >
                    {isLoading[task.id] ? <div className='spinner'></div> : null}
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
  );
}

export default App;

const customStyles = {
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