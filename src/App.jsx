// src/App.js
import React, { useState } from 'react';
import './App.css';

// Вопросы для теста (каждый вопрос имеет 4 варианта с указанием типа)
const questions = [
  {
    id: 1,
    text: "В рабочей обстановке я обычно...",
    options: [
      { text: "Решителен и ориентирован на результат", type: "D" },
      { text: "Убедителен и влиятелен", type: "I" },
      { text: "Стабилен и надежен", type: "S" },
      { text: "Точен и следую правилам", type: "C" }
    ]
  },
  {
    id: 2,
    text: "При общении с другими я...",
    options: [
      { text: "Прямолинеен и откровенен", type: "D" },
      { text: "Энергичен и воодушевляю", type: "I" },
      { text: "Спокоен и терпелив", type: "S" },
      { text: "Корректен и формален", type: "C" }
    ]
  },
  {
    id: 3,
    text: "Мой подход к задачам...",
    options: [
      { text: "Соревновательный: я люблю выигрывать", type: "D" },
      { text: "Увлекательный: я люблю веселье", type: "I" },
      { text: "Последовательный: я ценю стабильность", type: "S" },
      { text: "Точный: я следую инструкциям", type: "C" }
    ]
  }
  // Добавьте больше вопросов по аналогии
];

// Описания типов личности
const typeDescriptions = {
  D: {
    title: "Доминирование (D)",
    description: "Решительный, нацеленный на результат, прямолинейный. Любит преодолевать препятствия, быстро принимает решения."
  },
  I: {
    title: "Влияние (I)",
    description: "Коммуникабельный, оптимистичный, энергичный. Любит работать с людьми, мотивирует других, избегает рутины."
  },
  S: {
    title: "Стабильность (S)",
    description: "Надежный, терпеливый, хороший слушатель. Ценит стабильность, избегает конфликтов, преданный командный игрок."
  },
  C: {
    title: "Добросовестность (C)",
    description: "Аналитичный, точный, систематичный. Следует правилам, ценит качество, предпочитает работать с фактами."
  }
};

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleAnswer = (questionId, type) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: type
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const calculateResult = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 };

    // Подсчет баллов
    Object.values(answers).forEach(type => {
      scores[type]++;
    });

    // Определение доминирующего типа
    const maxScore = Math.max(...Object.values(scores));
    const dominantType = Object.keys(scores).find(type => scores[type] === maxScore);

    setResult({
      scores,
      dominantType
    });
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  return (
      <div className="app">
        <h1>Тест DISC</h1>

        {!result ? (
            <div className="question-container">
              <div className="progress">
                Вопрос {currentQuestion + 1} из {questions.length}
              </div>

              <h2>{questions[currentQuestion].text}</h2>

              <div className="options">
                {questions[currentQuestion].options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(questions[currentQuestion].id, option.type)}
                        className="option-btn"
                    >
                      {option.text}
                    </button>
                ))}
              </div>

              {currentQuestion === questions.length - 1 && (
                  <button
                      onClick={calculateResult}
                      className="submit-btn"
                      disabled={Object.keys(answers).length !== questions.length}
                  >
                    Завершить тест
                  </button>
              )}
            </div>
        ) : (
            <div className="result-container">
              <h2>Ваш результат</h2>
              <div className="scores">
                {Object.entries(result.scores).map(([type, score]) => (
                    <div key={type} className="score-item">
                      <span className="type-label">{type}:</span>
                      <div className="score-bar-container">
                        <div
                            className={`score-bar ${type}`}
                            style={{ width: `${(score / questions.length) * 100}%` }}
                        >
                          {score}
                        </div>
                      </div>
                    </div>
                ))}
              </div>

              <div className="dominant-type">
                <h3>Ваш основной тип: {typeDescriptions[result.dominantType].title}</h3>
                <p>{typeDescriptions[result.dominantType].description}</p>
              </div>

              <button onClick={restartTest} className="restart-btn">
                Пройти тест снова
              </button>
            </div>
        )}
      </div>
  );
}

export default App;
