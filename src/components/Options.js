function Options({ question, dispatch, answer }) {
  //Cannot use 'answer' directly in conditions because answer may equal to 0
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, index) => {
        return (
          <button
            className={`btn btn-option ${index === answer ? 'answer' : ''} 
            ${index === answer && index !== question.correctOption ? 'wrong' : ''} 
            ${hasAnswered && index === question.correctOption ? 'correct' : ''}
         `}
            key={index}
            onClick={() => {
              dispatch({ type: 'newAnswer', payload: index });
            }}
            disabled={hasAnswered}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default Options;
