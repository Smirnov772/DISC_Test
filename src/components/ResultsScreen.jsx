import React from 'react';
import DiscGraph from './DiscGraph.jsx';
import {factorNames, factorColors, NEUTRAL_FACTOR} from '../data/questions';
import DiscGraphPlus from "./DiscGraphPlus.jsx";
import DiscGraphMinus from "./DiscGraphMinus.jsx";

const ResultsScreen = ({results, onRestartTest}) => {
    const {scores, details} = results;

    // Функция для извлечения данных для графиков
    const getGraphData = () => {
        const realityData = {...scores};
        const maskingData = {};
        const pressureData = {};
        Object.keys(details).forEach(factor => {
            maskingData[factor] = details[factor].plus || 0;
            pressureData[factor] = details[factor].minus || 0;
        });
        return {maskingData, pressureData, realityData};
    };

    const {maskingData, pressureData, realityData} = getGraphData();

    const getInterpretation = (scores) => {
        const sortedFactors = Object.entries(scores)
            .sort((a, b) => b[1] - a[1]);

        const primaryFactor = sortedFactors[0][0];
        const secondaryFactor = sortedFactors[1][0];
        const primaryScore = sortedFactors[0][1];
        const secondaryScore = sortedFactors[1][1];

        // Определяем доминирующий стиль
        let styleDescription = '';
        let combinationDescription = '';

        // Описания отдельных стилей
        const styleDescriptions = {
            D: "Доминирующий тип (D): Вы ориентированы на результат, прямолинейны, решительны и любите challenges.",
            I: "Влияющий тип (I): Вы общительны, оптимистичны, энергичны и любите работать с людьми.",
            S: "Стабильный тип (S): Вы надежны, терпеливы, доброжелательны и предпочитаете стабильность.",
            C: "Сознательный тип (C): Вы аналитичны, точны, осторожны и следуете правилам."
        };

        // Описания комбинаций стилей
        const combinationDescriptions = {
            DI: "Комбинация D и I: Вы энергичный и амбициозный лидер, который мотивирует других на достижение целей.",
            DS: "Комбинация D и S: Вы практичный и надежный руководитель, который стабильно движется к цели.",
            DC: "Комбинация D и C: Вы стратегический мыслитель, который тщательно анализирует перед принятием решений.",
            ID: "Комбинация I и D: Вы харизматичный лидер, умеющий вдохновлять и направлять людей.",
            IS: "Комбинация I и S: Вы дружелюбный командный игрок, создающий позитивную атмосферу.",
            IC: "Комбинация I и C: Вы креативный и организованный специалист, умеющий работать с деталями.",
            SD: "Комбинация S и D: Вы стабильный и решительный исполнитель, надежный в кризисных ситуациях.",
            SI: "Комбинация S и I: Вы поддерживающий и дипломатичный коллега, умеющий находить компромиссы.",
            SC: "Комбинация S и C: Вы методичный и осторожный работник, обеспечивающий качественный результат.",
            CD: "Комбинация C и D: Вы системный аналитик, умеющий принимать жесткие решения на основе данных.",
            CI: "Комбинация C и I: Вы точный и коммуникабельный специалист, внимательный к деталям и людям.",
            CS: "Комбинация C и S: Вы консервативный и надежный сотрудник, соблюдающий процедуры и стандарты."
        };

        // Проверяем наличие значимой комбинации (разница менее 5 баллов)
        if (primaryScore - secondaryScore < 5) {
            const combination = primaryFactor + secondaryFactor;
            combinationDescription = combinationDescriptions[combination] ||
                `Комбинация ${primaryFactor} и ${secondaryFactor}: Вы сочетаете качества ${factorNames[primaryFactor]} и ${factorNames[secondaryFactor]} стилей.`;
        }

        styleDescription = styleDescriptions[primaryFactor];

        return {
            primary: `Ваш основной стиль: ${factorNames[primaryFactor]}`,
            description: combinationDescription
                ? <>{styleDescription}<br/><br/>{combinationDescription}</>
                : styleDescription
        };
    };

    const interpretation = getInterpretation(scores);

    return (<div className="results-screen">
        <div className="container">
            <h2>Ваши результаты DISC</h2>
            <div className="discChart">
                <DiscGraphPlus
                    data={maskingData}
                    title="МАСКИРОВКА"
                />
                <DiscGraphMinus
                    data={pressureData}
                    title="ПОД ДАВЛЕНИЕМ"
                />
                <DiscGraph
                    data={realityData}
                    title="РЕАЛЬНОСТЬ"
                />
            </div>

            <div className="results-interpretation">
                <h3>Интерпретация результатов</h3>
                <p><strong>{interpretation.primary}</strong></p>
                <p>{interpretation.description}</p>
            </div>

            <div className="factors-detail">
                <h3>Детализация по факторам:</h3>
                <table className="factors-table">
                    <thead>
                    <tr>
                        <th>Фактор</th>
                        <th>МАСКИРОВКА</th>
                        <th>ПОД ДАВЛЕНИЕМ</th>
                        <th>РЕАЛЬНОСТЬ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(scores).map(([factor, score]) => (<tr key={factor}>
                        <td className="factor-label" style={{color: factorColors[factor]}}>
                            {factorNames[factor]} ({factor})
                        </td>
                        <td className="factor-value plus-count"
                        >{details[factor].plus}</td>
                        <td className="factor-value minus-count"
                        >{details[factor].minus}</td>
                        <td className="factor-value total-score"
                        >{score}</td>
                    </tr>))}
                    </tbody>
                </table>
            </div>

            <button className="btn btn-primary" onClick={onRestartTest}>
                Пройти тест снова
            </button>
        </div>
    </div>);
};

export default ResultsScreen;