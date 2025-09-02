import React from 'react';

const WelcomeScreen = ({onStartTest}) => {
    return (<div className="welcome-screen">
        <div className="container">
            <h2>Добро пожаловать в DISC</h2>

            <div className="instructions">
                <p><strong>Инструкция:</strong></p>
                <p>В каждой строке выберите одно описание, которое больше всего похоже на вас (+),
                    и одно описание, которое меньше всего похоже на вас (-).</p>
                <p>Отвечайте быстро, полагаясь на первое впечатление. Не задумывайтесь слишком долго над
                    ответами.</p>
            </div>

            {/*<div className="factors-info">*/}
            {/*    <h3>О факторах DISC:</h3>*/}
            {/*    <ul>*/}
            {/*        <li><span className="color-dot" style={{backgroundColor: '#FF3B30'}}></span>*/}
            {/*            <strong>D</strong> - Доминирование*/}
            {/*        </li>*/}
            {/*        <li><span className="color-dot" style={{backgroundColor: '#FFCC00'}}></span>*/}
            {/*            <strong>I</strong> - Влияние*/}
            {/*        </li>*/}
            {/*        <li><span className="color-dot" style={{backgroundColor: '#4CD964'}}></span>*/}
            {/*            <strong>S</strong> - Стабильность*/}
            {/*        </li>*/}
            {/*        <li><span className="color-dot" style={{backgroundColor: '#007AFF'}}></span>*/}
            {/*            <strong>C</strong> - Соответствие*/}
            {/*        </li>*/}
            {/*    </ul>*/}
            {/*</div>*/}

            <button className="btn btn-primary" onClick={onStartTest}>
                Начать тест
            </button>
        </div>
    </div>);
};

export default WelcomeScreen;