import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import TestScreen from './components/TestScreen';
import ResultsScreen from './components/ResultsScreen';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState(null);

  const startTest = () => {
    setCurrentScreen('test');
    setUserAnswers([]);
  };

  const completeTest = (calculatedResults) => {
    setResults(calculatedResults);
    setCurrentScreen('results');
  };

  const restartTest = () => {
    setCurrentScreen('welcome');
    setUserAnswers([]);
    setResults(null);
  };

  return (
      <div className="app">
        <header className="app-header">
          <h1>Тестирование DISC</h1>
        </header>

        <main className="app-main">
          {currentScreen === 'welcome' && (
              <WelcomeScreen onStartTest={startTest} />
          )}

          {currentScreen === 'test' && (
              <TestScreen
                  onCompleteTest={completeTest}
                  onCancelTest={() => setCurrentScreen('welcome')}
              />
          )}

          {currentScreen === 'results' && (
              <ResultsScreen
                  results={results}
                  onRestartTest={restartTest}
              />
          )}
        </main>
      </div>
  );
}

export default App;