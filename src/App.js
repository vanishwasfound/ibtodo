import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FocusMode from './FocusMode';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #1e1e1e;
  min-height: 100vh;
  color: #f0f2f5;
  position: relative;
  box-sizing: border-box;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  color: #f0f2f5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #555;
  width: 250px;
  font-size: 1rem;
  background-color: #333;
  color: #f0f2f5;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #555;
  width: 270px;
  font-size: 1rem;
  background-color: #333;
  color: #f0f2f5;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #28a745;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 600px;
`;

const TaskCard = styled(motion.div)`
  background-color: #333;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskTitle = styled.h3`
  margin: 0;
  color: #f0f2f5;
`;

const TaskCategory = styled.span`
  padding: 5px 10px;
  border-radius: 5px;
  background-color: ${(props) => props.color || '#ccc'};
  color: white;
  font-size: 0.9rem;
`;

const TaskTimeLeft = styled.p`
  margin: 0;
  color: #aaa;
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  background-color: #dc3545;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c82333;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #28a745;
  font-size: 1rem;
  margin-top: 20px;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

function calculateTimeLeft(time) {
  const difference = +new Date(time) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    timeLeft = {
      days,
      hours,
      minutes,
    };
  }

  return timeLeft;
}

const categories = [
  { value: 'Essay/Long writeups', color: '#007bff' },
  { value: 'Project (IA)/ Submission', color: '#17a2b8' },
  { value: 'Homework/Assignment', color: '#ffc107' },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState(categories[0].value);

  const notify = (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach((task) => {
        const timeLeft = calculateTimeLeft(task.time);

        if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
          notify(`Task "${task.task}" is due now!`);
        } else if (timeLeft.days === 0 && timeLeft.hours === 1 && timeLeft.minutes === 0) {
          notify(`Task "${task.task}" is due in 1 hour!`);
        } else if (timeLeft.days === 0 && timeLeft.hours === 10 && timeLeft.minutes === 0) {
          notify(`Task "${task.task}" is due in 10 hours!`);
        } else if (timeLeft.days === 1 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
          notify(`Task "${task.task}" is due in 1 day!`);
        }
      });
    }, 60000); 

    return () => clearInterval(interval);
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();

    if (!task || !time || !category) {
      notify('Please fill out all fields.');
      return;
    }

    const newTask = {
      id: tasks.length + 1,
      task,
      time,
      category,
    };

    setTasks([...tasks, newTask]);
    setTask('');
    setTime('');
    setCategory(categories[0].value);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getCategoryColor = (category) => {
    const foundCategory = categories.find((cat) => cat.value === category);
    return foundCategory ? foundCategory.color : '#ccc';
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Container>
              <ToastContainer />
              <Header>To-Do List</Header>
              <Form onSubmit={addTask}>
                <Input
                  type="text"
                  placeholder="Task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
                <Input
                  type="datetime-local"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.value}
                    </option>
                  ))}
                </Select>
                <Button type="submit">Add Task</Button>
              </Form>
              <TaskList>
                <AnimatePresence>
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                    >
                      <TaskHeader>
                        <TaskTitle>{task.task}</TaskTitle>
                        <TaskCategory color={getCategoryColor(task.category)}>
                          {task.category}
                        </TaskCategory>
                      </TaskHeader>
                      <TaskTimeLeft>
                        Time left: {moment(task.time).fromNow(true)}
                      </TaskTimeLeft>
                      <DeleteButton onClick={() => deleteTask(task.id)}>Delete</DeleteButton>
                    </TaskCard>
                  ))}
                </AnimatePresence>
              </TaskList>
              <NavLink to="/focus-mode">Go to Focus Mode</NavLink>
              <footer> Created by Vansh Trivedi</footer>
            </Container>
          }
        />
        <Route path="/focus-mode" element={<FocusMode tasks={tasks} />} />
      </Routes>
    </Router>
  );
}

export default App;
