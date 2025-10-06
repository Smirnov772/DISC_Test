import React from "react";

const WelcomeScreen = ({ onStartTest }) => {
  return (
    <div className="welcome-screen">
      <div className="container">
        <h2>Добро пожаловать в DISC</h2>

        <div className="instructions">
          <p>
            <strong>Инструкция:</strong>
          </p>
          <p>
            В каждой строке выберите одно описание, которое больше всего похоже
            на вас (+), и одно описание, которое меньше всего похоже на вас (-).
          </p>
          <p>
            Отвечайте быстро, полагаясь на первое впечатление. Не задумывайтесь
            слишком долго над ответами.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onStartTest}>
          Начать тест
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
