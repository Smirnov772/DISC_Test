import React from 'react';

// Выносим axisCoordinates наружу для повторного использования
const axisCoordinates = {
    D: {
        '-21': 310,
        '-14': 300,
        '-13': 280,
        '-11': 260,
        '-10': 240,
        '-9': 230,
        '-7': 220,
        '-6': 210,
        '-4': 190,
        '-3': 180,
        '-2': 170,
        '0': 160,
        '1': 150,
        '3': 130,
        '5': 120,
        '7': 100,
        '8': 900,
        '9': 80,
        '10': 70,
        '12': 60,
        '13': 50,
        '14': 40,
        '15': 30,
        '16': 20,
        '20': 10
    }, I: {
        '-19': 310,
        '-10': 300,
        '-9': 290,
        '-8': 280,
        '-7': 260,
        '-6': 240,
        '-5': 220,
        '-4': 210,
        '-3': 190,
        '-2': 180,
        '-1': 160,
        '0': 150,
        '1': 130,
        '2': 120,
        '3': 100,
        '4': 80,
        '5': 70,
        '6': 50,
        '7': 40,
        '8': 30,
        '9': 20,
        '17': 10
    }, S: {
        '-19': 310,
        '-12': 300,
        '-11': 290,
        '-10': 280,
        '-9': 260,
        '-8': 240,
        '-7': 230,
        '-6': 220,
        '-5': 200,
        '-4': 190,
        '-3': 180,
        '-2': 170,
        '-1': 160,
        '0': 140,
        '1': 130,
        '2': 120,
        '3': 110,
        '4': 90,
        '5': 80,
        '7': 70,
        '8': 60,
        '9': 50,
        '10': 30,
        '11': 20,
        '19': 10
    }, C: {
        '-16': 300,
        '-12': 290,
        '-11': 280,
        '-10': 270,
        '-9': 260,
        '-8': 250,
        '-7': 230,
        '-6': 220,
        '-5': 210,
        '-4': 190,
        '-3': 170,
        '-2': 150,
        '-1': 140,
        '0': 120,
        '1': 100,
        '2': 80,
        '3': 70,
        '4': 50,
        '5': 40,
        '6': 30,
        '7': 20,
        '15': 10
    }
};

// Вспомогательный компонент для отрисовки оси
const Axis = ({data, position, title}) => {
    const values = Object.keys(data).map(Number).sort((a, b) => a - b);

    return (<g className="axis" transform={`translate(${position}, 0)`}>
        <line x1="0" x2="0" y1="0" y2="320" stroke="black"/>
        {values.map(value => (<React.Fragment key={value}>
            <line x1="-5" x2="5" y1={data[value]} y2={data[value]} stroke="black"/>
            <text className="custom-label" x="-10" y={data[value] + 2.8} textAnchor="end">
                {value}
            </text>
        </React.Fragment>))}
        <text className="axis-title" x="0" y="-3">{title}</text>
    </g>);
};

const DiscGraph = ({data, title}) => {
    const getCoordinate = (value, axis) => {
        if (axisCoordinates[axis][value] !== undefined) {
            return axisCoordinates[axis][value];
        }

        const values = Object.keys(axisCoordinates[axis]).map(Number).sort((a, b) => a - b);
        let lowerValue = -Infinity;
        let higherValue = Infinity;

        for (const v of values) {
            if (v <= value) lowerValue = v;
            if (v >= value && v < higherValue) higherValue = v;
        }

        if (lowerValue === -Infinity) return axisCoordinates[axis][values[0]];
        if (higherValue === Infinity) return axisCoordinates[axis][values[values.length - 1]];

        const lowerY = axisCoordinates[axis][lowerValue];
        const higherY = axisCoordinates[axis][higherValue];

        return lowerY + (higherY - lowerY) * (value - lowerValue) / (higherValue - lowerValue);
    };

    const coordinates = {
        D: getCoordinate(data.D, 'D'),
        I: getCoordinate(data.I, 'I'),
        S: getCoordinate(data.S, 'S'),
        C: getCoordinate(data.C, 'C')
    };

    return (<div className="chart-wrapper">
        <svg
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 210 336"
            className="disc-chart"
        >
            <g transform="translate(15,14)">
                <style>
                    {`
              .custom-label { font-size: 9.8px; }
              .axis-title { text-align: center; font-size: 14px; font-weight: bold; text-anchor: middle; text-ag }
              .blue-line { fill: none; stroke: blue; stroke-width: 2; }
              .point-circle { fill: blue; stroke: white; stroke-width: 1; }
            `}
                </style>

                <rect
                    x="-0"
                    y="75"
                    width="180"
                    height="160"
                    fill="rgba(0, 0, 255, 0.2)"
                    stroke="none"
                />

                {/* Динамически генерируем оси */}
                <Axis data={axisCoordinates.D} position={36} title="D"/>
                <Axis data={axisCoordinates.I} position={72} title="I"/>
                <Axis data={axisCoordinates.S} position={108} title="S"/>
                <Axis data={axisCoordinates.C} position={144} title="C"/>

                <g className="axis" transform="translate(180, 0)">
                    <line x1="0" x2="0" y1="0" y2="320" stroke="black"></line>
                </g>

                <line x1="0" x2="0" y1="0" y2="320" stroke="black"></line>
                <line x1="0" x2="180" y1="320" y2="320" stroke="black"></line>
                {/*<line x1="0" x2="180" y1="264.6" y2="264.6" stroke="black" strokeDasharray="5, 5"></line>*/}
                <line x1="0" x2="180" y1="155" y2="155" stroke="black" strokeDasharray="5, 5"></line>
                {/*<line x1="0" x2="180" y1="37.8" y2="37.8" stroke="black" strokeDasharray="5, 5"></line>*/}
                <line x1="0" x2="180" y1="0" y2="0" stroke="black"></line>

                <path
                    className="blue-line"
                    d={`M36,${coordinates.D} L72,${coordinates.I} L108,${coordinates.S} L144,${coordinates.C}`}
                />

                <circle className="point-circle" cx="36" cy={coordinates.D} r="3.6"></circle>
                <circle className="point-circle" cx="72" cy={coordinates.I} r="3.6"></circle>
                <circle className="point-circle" cx="108" cy={coordinates.S} r="3.6"></circle>
                <circle className="point-circle" cx="144" cy={coordinates.C} r="3.6"></circle>

            </g>
        </svg>
        <p className="axis-title" textAnchor="middle">{title}</p>
    </div>);
};

export default DiscGraph;