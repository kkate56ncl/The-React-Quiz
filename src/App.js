import React, { useEffect, useReducer } from 'react';

import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartText from './components/StartText';
import Question from './components/Question';
import NexButton from './components/NexButton';
import Progress from './components/Progres';
import FinishScreen from './components/FinishScreen';
import Footer from './components/Footer';
import Timer from './components/Timer';

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  //"loading", "ready","active","error","finished","restart"
  status: 'loading',
  //index of questions
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  remainingTime: null,
};

//reducer must be a PURE function. Takes current state and action, returns the next state.
//State update logic and defined outside of the component function
function reducer(state, action) {
  //action object describes how to update state
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };

    case 'dataFailed':
      return { ...state, status: 'error' };

    case 'start':
      return {
        ...state,
        status: 'active',
        remainingTime: state.questions.length * SECS_PER_QUESTION,
      };

    case 'newAnswer':
      const curQuestion = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === curQuestion.correctOption
            ? state.points + curQuestion.points
            : state.points,
      };

    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore ? state.points : state.highscore,
      };

    case 'restart':
      return { ...initialState, status: 'ready', questions: state.questions };

    case 'tick':
      return {
        ...state,
        remainingTime: state.remainingTime - 1,
        status: state.remainingTime === 0 ? 'finished' : state.status,
      };

    default:
      throw new Error('Action Unknown');
  }
}
function App() {
  //dispatch function triggers state updates by sending actions from event handlers to reducer
  const [{ questions, status, index, answer, points, highscore, remainingTime }, dispatch] =
    useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const totalPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(function () {
    //use json-server to create a fake API
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartText numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              totalPoints={totalPoints}
            />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <Footer>
              <Timer dispatch={dispatch} remainingTime={remainingTime} />
              <NexButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}

        {status === 'finished' && (
          <FinishScreen
            points={points}
            totalPoints={totalPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
