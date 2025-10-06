import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';

function SortableItem({ id, text, index }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="option-item">
        <div className="option-rank">{index + 1}</div>
        <div className="option-text">{text}</div>
      </div>
  );
}

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  // Базовый URL для API
  const API_BASE = 'http://localhost:5000/api';

  // Создание анонимной сессии
  useEffect(() => {
    const saved = localStorage.getItem("disc_session");

    if (saved) {
      console.log("Found saved session:", saved);
      setSessionId(saved);
    } else {
      const createSession = async () => {
        try {
          console.log("Creating new session...");
          const res = await axios.post(`${API_BASE}/session`);
          console.log("✅ Сессия создана:", res.data);
          localStorage.setItem("disc_session", res.data.sessionId);
          setSessionId(res.data.sessionId);
        } catch (error) {
          console.error("❌ Ошибка при создании сессии:", error);
          // Временное решение для разработки
          const tempSessionId = 'temp-' + Date.now();
          console.log("🔄 Using temporary session:", tempSessionId);
          localStorage.setItem("disc_session", tempSessionId);
          setSessionId(tempSessionId);
        }
      };

      createSession();
    }
  }, []);

  // Загружаем вопросы
  useEffect(() => {
    if (sessionId && sessionId.startsWith('temp-')) {
      // Для временных сессий создаем mock вопросы
      const mockQuestions = [
        {
          _id: '1',
          text: 'Вопрос 1 (mock)',
          block: 'personal',
          options: [
            { id: 'D', text: 'Прямолинейный, напористый' },
            { id: 'S', text: 'Неконфликтный, миролюбивый' },
            { id: 'C', text: 'Педантичный, аккуратный' },
            { id: 'I', text: 'Легкий в общении, оптимистичный' },
          ]
        }
      ];
      setQuestions(mockQuestions);
    } else if (sessionId) {
      axios.get(`${API_BASE}/questions`)
          .then(res => {
            console.log("✅ Questions loaded:", res.data.length);
            setQuestions(res.data);
          })
          .catch(err => {
            console.error("❌ Error loading questions:", err);
          });
    }
  }, [sessionId]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const q = questions[current];
    const questionId = q._id;
    const old = answers[questionId] || [...q.options];
    const oldIndex = old.findIndex(o => o.id === active.id);
    const newIndex = old.findIndex(o => o.id === over.id);
    const newOrder = arrayMove(old, oldIndex, newIndex);

    setAnswers(prev => ({ ...prev, [questionId]: newOrder }));

    // Для реальных сессий сохраняем на сервер
    if (!sessionId.startsWith('temp-')) {
      axios.post(`${API_BASE}/answers`, {
        sessionId,
        questionId,
        options: newOrder.map(o => o.id)
      }).catch(err => console.error('Error saving answer:', err));
    }
  };

  const finishTest = async () => {
    if (sessionId.startsWith('temp-')) {
      // Mock результат для временных сессий
      setResult({
        sessionId,
        adapted: { scores: { D: 25, I: 25, S: 25, C: 25 }, percent: { D: 25, I: 25, S: 25, C: 25 } },
        natural: { scores: { D: 25, I: 25, S: 25, C: 25 }, percent: { D: 25, I: 25, S: 25, C: 25 } },
        shareLink: `http://localhost:5000/result/${sessionId}`
      });
    } else {
      try {
        const res = await axios.get(`${API_BASE}/results/${sessionId}`);
        setResult(res.data);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    }
  };

  if (!sessionId || !questions.length) return <p>Загрузка...</p>;

  const q = questions[current];
  const currentOptions = answers[q._id] || q.options;

  return (
      <div className="app">
        {!result ? (
            <>
              <h2>{q.text}</h2>
              <p>Session: {sessionId}</p>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={currentOptions.map(o => o.id)} strategy={verticalListSortingStrategy}>
                  {currentOptions.map((o, i) => (
                      <SortableItem key={o.id} id={o.id} text={o.text} index={i} />
                  ))}
                </SortableContext>
              </DndContext>

              <div className="nav">
                {current > 0 && <button onClick={() => setCurrent(current - 1)}>Назад</button>}
                {current < questions.length - 1 ? (
                    <button onClick={() => setCurrent(current + 1)}>Далее</button>
                ) : (
                    <button onClick={finishTest}>Завершить тест</button>
                )}
              </div>
            </>
        ) : (
            <div className="result">
              <h2>Ваш результат</h2>
              <pre>{JSON.stringify(result, null, 2)}</pre>
              <a href={result.shareLink} target="_blank" rel="noreferrer">Открыть публичную ссылку</a>
            </div>
        )}
      </div>
  );
}

export default App;