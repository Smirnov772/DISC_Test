import React from "react";
import DiscGraph from "./DiscGraph.jsx";
import {
  factorNames,
  factorColors,
  styleDescriptions,
  combinationDescriptions,
  NEUTRAL_FACTOR,
} from "../data/questions";
import DiscGraphPlus from "./DiscGraphPlus.jsx";
import DiscGraphMinus from "./DiscGraphMinus.jsx";

const ResultsScreen = ({ results, onRestartTest }) => {
  const { scores, details } = results;

  const getGraphData = () => {
    const realityData = { ...scores };
    const maskingData = {};
    const pressureData = {};
    Object.keys(details).forEach((factor) => {
      maskingData[factor] = details[factor].plus || 0;
      pressureData[factor] = details[factor].minus || 0;
    });
    return { maskingData, pressureData, realityData };
  };

  const { maskingData, pressureData, realityData } = getGraphData();

  const getInterpretation = (scores) => {
    const sortedFactors = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    const primaryFactor = sortedFactors[0][0];
    const secondaryFactor = sortedFactors[1][0];
    const primaryScore = sortedFactors[0][1];
    const secondaryScore = sortedFactors[1][1];

    let styleDescription = "";
    let combinationDescription = "";

    if (primaryScore - secondaryScore < 5) {
      const combination = primaryFactor + secondaryFactor;
      combinationDescription =
        combinationDescriptions[combination] ||
        `Комбинация ${primaryFactor} и ${secondaryFactor}: Вы сочетаете качества ${factorNames[primaryFactor]} и ${factorNames[secondaryFactor]} стилей.`;
    }

    styleDescription = styleDescriptions[primaryFactor];

    return {
      primary: `Ваш основной стиль: ${factorNames[primaryFactor]}`,
      description: combinationDescription ? (
        <>
          {styleDescription}
          <br />
          <br />
          {combinationDescription}
        </>
      ) : (
        styleDescription
      ),
    };
  };

  const interpretation = getInterpretation(scores);

  return (
    <div className="results-screen">
      <div className="container">
        <h2>Ваши результаты DISC</h2>
        <div className="discChart">
          <DiscGraphPlus data={maskingData} title="МАСКИРОВКА" />
          <DiscGraphMinus data={pressureData} title="ПОД ДАВЛЕНИЕМ" />
          <DiscGraph data={realityData} title="РЕАЛЬНОСТЬ" />
        </div>

        <div className="results-interpretation">
          <h3>Интерпретация результатов</h3>
          <p>
            <strong>{interpretation.primary}</strong>
          </p>
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
              {Object.entries(scores).map(([factor, score]) => (
                <tr key={factor}>
                  <td
                    className="factor-label"
                    style={{ color: factorColors[factor] }}
                  >
                    {factorNames[factor]} ({factor})
                  </td>
                  <td className="factor-value plus-count">
                    {details[factor].plus}
                  </td>
                  <td className="factor-value minus-count">
                    {details[factor].minus}
                  </td>
                  <td className="factor-value total-score">{score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="btn btn-primary" onClick={onRestartTest}>
          Пройти тест снова
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
