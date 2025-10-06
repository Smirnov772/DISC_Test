import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function ResultPage() {
    const { sessionId } = useParams();
    const [result, setResult] = useState(null);

    useEffect(() => {
        axios.get(`/api/results/${sessionId}`).then((res) => setResult(res.data));
    }, [sessionId]);

    if (!result) return <div className="loading">Загрузка результатов...</div>;

    const colors = {
        D: "#ff4d4f", // красный
        I: "#ffbe0b", // жёлтый
        S: "#06d6a0", // зелёный
        C: "#118ab2", // синий
    };

    const formatData = (obj) =>
        Object.entries(obj.percent).map(([k, v]) => ({ name: k, value: v, fill: colors[k] }));

    return (
        <div className="result-page">
            <header className="result-header">
                <img src="/disc-logo.png" alt="DISC" className="logo" />
                <h1>
                    <span style={{ color: "#ff4d4f" }}>DISC</span>: результаты
                </h1>
            </header>

            <p className="intro">
                Графики ниже отображают ваш поведенческий стиль.
                <br />
                Это основа для формирования персональных рекомендаций.
            </p>

            <div className="charts-container">
                <div className="chart-block">
                    <img src="/bear1.png" alt="natural" className="bear" />
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={formatData(result.natural)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="value" />
                        </BarChart>
                    </ResponsiveContainer>
                    <p>естественный стиль</p>
                </div>

                <div className="chart-block">
                    <img src="/bear2.png" alt="adapted" className="bear" />
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={formatData(result.adapted)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="value" />
                        </BarChart>
                    </ResponsiveContainer>
                    <p>адаптированный стиль</p>
                </div>
            </div>

            <section className="next-steps">
                <h2>Что дальше?</h2>
                <p>
                    Расшифровку полученных результатов (стиль коммуникации, сильные стороны
                    и зоны роста, а также вашу роль в команде) мы подготовим в виде индивидуального отчета.
                </p>
                <p>
                    Чтобы мы могли его сформировать, пожалуйста, сделайте скриншот графиков
                    и отправьте его на нашу почту:
                </p>
                <a href="mailto:razvitiye@detmir.ru" className="email-btn">
                    razvitiye@detmir.ru
                </a>
            </section>
        </div>
    );
}
