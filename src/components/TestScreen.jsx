import React, {useState} from 'react';
import {questions, NEUTRAL_FACTOR} from '../data/questions';

const TestScreen = ({onCompleteTest, onCancelTest}) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill({
        plus: null, minus: null,

    }));

    const handleAnswerSelect = (type, descriptorIndex) => {
        const newAnswers = [...answers];
        const currentAnswer = {...newAnswers[currentQuestion]};

        // Если уже выбран этот дескриптор для другого типа, снимаем выбор
        if (type === 'plus' && currentAnswer.minus === descriptorIndex) {
            currentAnswer.minus = null;
        }
        if (type === 'minus' && currentAnswer.plus === descriptorIndex) {
            currentAnswer.plus = null;
        }

        // Устанавливаем новый выбор
        currentAnswer[type] = currentAnswer[type] === descriptorIndex ? null : descriptorIndex;
        newAnswers[currentQuestion] = currentAnswer;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateResults();
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const calculateResults = () => {
        const scores = {
            D: {plus: 0, minus: 0},
            I: {plus: 0, minus: 0},
            S: {plus: 0, minus: 0},
            C: {plus: 0, minus: 0},
            [NEUTRAL_FACTOR]: {plus: 0, minus: 0}
        };

        answers.forEach((answer, questionIndex) => {
            if (answer.plus !== null) {
                const descriptor = questions[questionIndex].descriptors[answer.plus];
                const factor = descriptor.factor || NEUTRAL_FACTOR;

                const line = descriptor.line;

                // Учитываем все ответы plus, кроме тех, у которых line === "down"
                if (line !== "down") {
                    scores[factor].plus += 1;
                }
                console.log(descriptor, factor, line);
            }
            if (answer.minus !== null) {
                const descriptor = questions[questionIndex].descriptors[answer.minus];
                const factor = descriptor.factor || NEUTRAL_FACTOR;

                const line = descriptor.line;

                // Учитываем все ответы minus, кроме тех, у которых line === "up"
                if (line !== "up") {
                    scores[factor].minus += 1;
                }
            }
        });

        // Рассчитываем итоговые значения, исключая нейтральные ответы
        const results = {
            D: scores.D.plus - scores.D.minus,
            I: scores.I.plus - scores.I.minus,
            S: scores.S.plus - scores.S.minus,
            C: scores.C.plus - scores.C.minus
        };

        onCompleteTest({
            scores: results, details: {
                D: {plus: scores.D.plus, minus: scores.D.minus},
                I: {plus: scores.I.plus, minus: scores.I.minus},
                S: {plus: scores.S.plus, minus: scores.S.minus},
                C: {plus: scores.C.plus, minus: scores.C.minus},
                [NEUTRAL_FACTOR]: {
                    plus: scores[NEUTRAL_FACTOR].plus, minus: scores[NEUTRAL_FACTOR].minus
                }
            }
        });
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentQ = questions[currentQuestion];

    return (<div className="test-screen">
        <div className="container">
            <div className="progress-bar">
                <div className="progress" style={{width: `${progress}%`}}></div>
            </div>

            <div className="question-counter">
                Вопрос {currentQuestion + 1} из {questions.length}
            </div>

            <div className="instructions">
                <p>Выберите в каждой строке:</p>
                <ul>
                    <li><strong>+</strong> - характеристика, которая больше всего похожа на вас</li>
                    <li><strong>-</strong> - характеристика, которая меньше всего похожа на вас</li>
                </ul>
            </div>

            <div className="question-block">
                <div className="question-title">Выберите характеристики:</div>

                {currentQ.descriptors.map((descriptor, index) => (<div
                    key={index}
                    className={`descriptor ${!descriptor.factor ? 'neutral' : ''}`}
                >
                    <div className="descriptor-text">
                        {descriptor.text}
                        {!descriptor.factor && <span className="neutral-badge"> (не учитывается)</span>}
                    </div>
                    <div className="descriptor-actions">
                        <button
                            className={`btn-select plus ${answers[currentQuestion].plus === index ? 'selected' : ''}`}
                            onClick={() => handleAnswerSelect('plus', index)}
                        >
                            +
                        </button>
                        <button
                            className={`btn-select minus ${answers[currentQuestion].minus === index ? 'selected' : ''}`}
                            onClick={() => handleAnswerSelect('minus', index)}
                        >
                            -
                        </button>
                    </div>
                </div>))}
            </div>

            <div className="navigation">
                <button className="btn btn-secondary" onClick={onCancelTest}>
                    Отмена
                </button>

                <div>
                    {currentQuestion > 0 && (<button className="btn btn-secondary" onClick={handlePrevious}>
                        Назад
                    </button>)}

                    <button
                        className="btn btn-primary"
                        onClick={handleNext}
                        disabled={!answers[currentQuestion].plus || !answers[currentQuestion].minus}
                    >
                        {currentQuestion === questions.length - 1 ? 'Завершить' : 'Далее'}
                    </button>
                </div>
            </div>
        </div>
    </div>);
};

export default TestScreen;