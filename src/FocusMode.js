import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Styled Components
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1e1e1e;
  color: #f0f2f5;
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 50px; // Space between timer and task list
`;

const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  background-color: #333;
  border-radius: 10px;
`;

const Timer = styled.div`
  font-size: 4rem; // Increased size of the clock
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #28a745; // Changed color to green
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 10px;

  &:hover {
    background-color: #218838;
  }
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #555;
  width: 200px;
  font-size: 1rem;
  background-color: #333;
  color: #f0f2f5;
  margin-bottom: 20px;
`;

const TaskCard = styled.div`
  background-color: #333;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  color: #f0f2f5;
`;

const FocusMode = ({ tasks }) => {
  const [seconds, setSeconds] = useState(0);
  const [studyTime, setStudyTime] = useState(null);
  const [studyLimit, setStudyLimit] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (studyTime) {
      timer = setInterval(() => {
        const now = new Date();
        const elapsedTime = Math.floor((now - studyTime) / 1000);
        setSeconds(elapsedTime);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [studyTime]);

  useEffect(() => {
    if (studyLimit && studyTime) {
      const limitInSeconds = moment.duration(studyLimit).asSeconds();
      if (seconds >= limitInSeconds) {
        stopTimer();
        alert('Study time limit reached!');
      }
    }
  }, [seconds, studyLimit, studyTime]);

  const startTimer = () => {
    setStudyTime(new Date());
  };

  const stopTimer = () => {
    setStudyTime(null);
  };

  const resetTimer = () => {
    setSeconds(0);
    setStudyTime(null);
  };

  return (
    <Container>
      <TimerContainer>
        <h1>Focus Mode</h1>
        <Timer>
          {Math.floor(seconds / 3600).toString().padStart(2, '0')}:
          {Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')}:
          {(seconds % 60).toString().padStart(2, '0')}
        </Timer>
        <Input
          type="text"
          placeholder="Set study time eg. 00:00:15 (15 seconds)"
          value={studyLimit}
          onChange={(e) => setStudyLimit(e.target.value)}
        />
        {!studyTime ? (
          <Button onClick={startTimer}>Start</Button>
        ) : (
          <Button onClick={stopTimer}>Stop</Button>
        )}
        <Button onClick={resetTimer}>Reset</Button>
        <Button onClick={() => navigate('/')}>Go Back to Todo List</Button>
      </TimerContainer>
      <TaskListContainer>
        <h2>Task List</h2>
        {tasks.map((task) => (
          <TaskCard key={task.id}>
            <h3>{task.task}</h3>
            <p>{task.category}</p>
            <p>Deadline: {moment(task.time).format('YYYY-MM-DD HH:mm:ss')}</p>
          </TaskCard>
        ))}
      </TaskListContainer>
    </Container>
  );
};

export default FocusMode;
