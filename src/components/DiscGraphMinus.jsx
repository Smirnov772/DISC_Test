import React from 'react';

// Выносим axisCoordinates наружу для повторного использования
const axisCoordinates = {
    D: {
        0: 10,
        1: 50,
        2: 80,
        3: 110,
        4: 130,
        5: 150,
        6: 160,
        7: 180,
        8: 190,
        9: 210,
        10: 220,
        11: 230,
        12: 240,
        13: 260,
        14: 270,
        15: 280,
        16: 290,
        21: 300
    },
    I: {
        0: 10,
        1: 60,
        2: 90,
        3: 110,
        4: 140,
        5: 170,
        6: 200,
        7: 230,
        8: 240,
        9: 260,
        10: 280,
        11: 290,
        19: 310
    },
    S: {
        0: 10,
        1: 20,
        2: 60,
        3: 80,
        4: 100,
        5: 120,
        6: 140,
        7: 180,
        8: 200,
        9: 220,
        10: 240,
        11: 260,
        12: 280,
        13: 290,
        19: 300
    },
    C: {
        0: 10,
        1: 20,
        2: 70,
        3: 90,
        4: 110,
        5: 130,
        6: 150,
        7: 170,
        8: 190,
        9: 210,
        10: 240,
        11: 260,
        12: 280,
        13: 290,
        16: 300
    }
};

// Константы для улучшения читаемости
const AXIS_POSITIONS = {
    D: 36,
    I: 72,
    S: 108,
    C: 144
};

const DASHED_LINE_POSITIONS = [155];

// Вспомогательный компонент для отрисовки оси
const Axis = ({ data, position, title }) => {
    const values = Object.keys(data).map(Number).sort((a, b) => a - b);

    return (
        <g className="axis" transform={`translate(${position}, 0)`}>
            <line x1="0" x2="0" y1="0" y2="320" stroke="black" />
            {values.map(value => (
                <React.Fragment key={value}>
                    <line x1="-5" x2="5" y1={data[value]} y2={data[value]} stroke="black" />
                    <text className="custom-label" x="-10" y={data[value] + 2.8} textAnchor="end">
                        {value}
                    </text>
                </React.Fragment>
            ))}
            <text className="axis-title" x="0" y="-4">{title}</text>
        </g>
    );
};

const DiscGraphMinus = ({ data, title }) => {
    // Функция для получения координаты Y на основе значения и оси
    const getCoordinate = (value, axis) => {
        // Если значение есть в таблице, возвращаем его
        if (axisCoordinates[axis][value] !== undefined) {
            return axisCoordinates[axis][value];
        }

        // Иначе находим ближайшие значения и интерполируем
        const values = Object.keys(axisCoordinates[axis]).map(Number).sort((a, b) => a - b);

        // Находим ближайшее меньшее и большее значение
        let lowerValue = -Infinity;
        let higherValue = Infinity;

        for (const v of values) {
            if (v <= value) lowerValue = v;
            if (v >= value && v < higherValue) higherValue = v;
        }

        // Если значение за пределами диапазона, возвращаем крайнее значение
        if (lowerValue === -Infinity) return axisCoordinates[axis][values[0]];
        if (higherValue === Infinity) return axisCoordinates[axis][values[values.length - 1]];

        // Интерполируем линейно
        const lowerY = axisCoordinates[axis][lowerValue];
        const higherY = axisCoordinates[axis][higherValue];

        return lowerY + (higherY - lowerY) * (value - lowerValue) / (higherValue - lowerValue);
    };

    // Получаем координаты для каждой точки данных
    const coordinates = {
        D: getCoordinate(data.D, 'D'),
        I: getCoordinate(data.I, 'I'),
        S: getCoordinate(data.S, 'S'),
        C: getCoordinate(data.C, 'C')
    };

    return (
        <div className="chart-wrapper">
            <svg
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 210 336"
                className="disc-chart"
            >
                <g transform="translate(15,14)">
                    <style>
                        {`
              .custom-label { font-size: 9.8px; }
              .axis-title { text-align:center; font-size: 14px; font-weight: bold; text-anchor: middle; }
              .blue-line { fill: none; stroke: blue; stroke-width: 2; }
              .point-circle { fill: blue; stroke: white; stroke-width: 1; }
            `}
                    </style>

                    {/* Область заливки для графика */}
                    <rect
                        x="-0"
                        y="75"
                        width="180"
                        height="160"
                        fill="rgba(0, 0, 255, 0.2)"
                        stroke="none"
                    />

                    {/* Динамически генерируем оси */}
                    <Axis data={axisCoordinates.D} position={AXIS_POSITIONS.D} title="D" />
                    <Axis data={axisCoordinates.I} position={AXIS_POSITIONS.I} title="I" />
                    <Axis data={axisCoordinates.S} position={AXIS_POSITIONS.S} title="S" />
                    <Axis data={axisCoordinates.C} position={AXIS_POSITIONS.C} title="C" />

                    {/* Дополнительная ось */}
                    <g className="axis" transform="translate(180, 0)">
                        <line x1="0" x2="0" y1="0" y2="320" stroke="black"></line>
                    </g>

                    {/* Границы графика */}
                    <line x1="0" x2="0" y1="0" y2="320" stroke="black"></line>
                    <line x1="0" x2="180" y1="320" y2="320" stroke="black"></line>

                    {/* Пунктирные линии */}
                    {DASHED_LINE_POSITIONS.map((position) => (
                        <line
                            key={position}
                            x1="0"
                            x2="180"
                            y1={position}
                            y2={position}
                            stroke="black"
                            strokeDasharray="5, 5"
                        />
                    ))}

                    <line x1="0" x2="180" y1="0" y2="0" stroke="black"></line>

                    {/* Линия графика */}
                    <path
                        className="blue-line"
                        d={`M${AXIS_POSITIONS.D},${coordinates.D} L${AXIS_POSITIONS.I},${coordinates.I} L${AXIS_POSITIONS.S},${coordinates.S} L${AXIS_POSITIONS.C},${coordinates.C}`}
                    />

                    {/* Точки данных */}
                    <circle className="point-circle" cx={AXIS_POSITIONS.D} cy={coordinates.D} r="3.6"></circle>
                    <circle className="point-circle" cx={AXIS_POSITIONS.I} cy={coordinates.I} r="3.6"></circle>
                    <circle className="point-circle" cx={AXIS_POSITIONS.S} cy={coordinates.S} r="3.6"></circle>
                    <circle className="point-circle" cx={AXIS_POSITIONS.C} cy={coordinates.C} r="3.6"></circle>

                    {/* Заголовок */}
                </g>
            </svg>
                    <p className="axis-title" x="90" y="323.4" textAnchor="middle">{title}</p>
        </div>
    );
};

export default DiscGraphMinus;