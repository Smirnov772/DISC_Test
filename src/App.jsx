import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
import './App.css';

// Компонент для сортируемого элемента
const SortableItem = ({ id, text, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
      <div
          ref={setNodeRef}
          style={style}
          className={`option-item ${isDragging ? 'dragging' : ''}`}
          {...attributes}
          {...listeners}
      >
        <div className="option-rank">{index + 1}</div>
        <div className="option-text">{text}</div>
      </div>
  );
};
const MemoizedSortableItem = React.memo(SortableItem);

// Вопросы для теста
const questions = [
  // ========== АДАПТИРОВАННЫЕ (РАБОТА) - учитываются только 1 и 2 места ==========
  {
    id: 1,
    text: "В рабочей обстановке я обычно...",
    block: "adapted",
    options: [
      { id: 'a1-1', text: "Быстро принимаю решения", type: "D" },
      { id: 'a1-2', text: "Вдохновляю коллег на работу", type: "I" },
      { id: 'a1-3', text: "Спокойно выполняю рутину", type: "S" },
      { id: 'a1-4', text: "Анализирую данные перед действием", type: "C" }
    ]
  },
  {
    id: 2,
    text: "При решении рабочих задач...",
    block: "adapted",
    options: [
      { id: 'a2-1', text: "Фокусируюсь на результате", type: "D" },
      { id: 'a2-2', text: "Ищу креативные подходы", type: "I" },
      { id: 'a2-3', text: "Действую по проверенному плану", type: "S" },
      { id: 'a2-4', text: "Следую инструкциям", type: "C" }
    ]
  },
  {
    id: 3,
    text: "В командной работе я...",
    block: "adapted",
    options: [
      { id: 'a3-1', text: "Беру на себя лидерство", type: "D" },
      { id: 'a3-2', text: "Создаю позитивную атмосферу", type: "I" },
      { id: 'a3-3', text: "Поддерживаю гармонию в коллективе", type: "S" },
      { id: 'a3-4', text: "Обеспечиваю точность выполнения", type: "C" }
    ]
  },
  {
    id: 4,
    text: "Мой подход к рабочим конфликтам...",
    block: "adapted",
    options: [
      { id: 'a4-1', text: "Решаю проблемы напрямую", type: "D" },
      { id: 'a4-2', text: "Убеждаю через обаяние", type: "I" },
      { id: 'a4-3', text: "Ищу компромисс", type: "S" },
      { id: 'a4-4', text: "Опираюсь на правила компании", type: "C" }
    ]
  },
  {
    id: 5,
    text: "При работе с дедлайнами я...",
    block: "adapted",
    options: [
      { id: 'a5-1', text: "Действую быстро и решительно", type: "D" },
      { id: 'a5-2', text: "Мотивирую команду на ускорение", type: "I" },
      { id: 'a5-3', text: "Сохраняю спокойный темп", type: "S" },
      { id: 'a5-4', text: "Точно рассчитываю время", type: "C" }
    ]
  },
  {
    id: 6,
    text: "В роли руководителя я...",
    block: "adapted",
    options: [
      { id: 'a6-1', text: "Ставлю амбициозные цели", type: "D" },
      { id: 'a6-2', text: "Вдохновляю подчиненных", type: "I" },
      { id: 'a6-3', text: "Создаю стабильную атмосферу", type: "S" },
      { id: 'a6-4', text: "Разрабатываю четкие инструкции", type: "C" }
    ]
  },
  {
    id: 7,
    text: "При внедрении изменений в работе...",
    block: "adapted",
    options: [
      { id: 'a7-1', text: "Действую быстро и решительно", type: "D" },
      { id: 'a7-2', text: "Увлекаю новыми возможностями", type: "I" },
      { id: 'a7-3', text: "Внедряю постепенно и осторожно", type: "S" },
      { id: 'a7-4', text: "Тщательно анализирую последствия", type: "C" }
    ]
  },
  {
    id: 8,
    text: "Мой стиль ведения переговоров...",
    block: "adapted",
    options: [
      { id: 'a8-1', text: "Напористый и прямой", type: "D" },
      { id: 'a8-2', text: "Убедительный и харизматичный", type: "I" },
      { id: 'a8-3', text: "Тактичный и дипломатичный", type: "S" },
      { id: 'a8-4', text: "Логичный и аргументированный", type: "C" }
    ]
  },
  {
    id: 9,
    text: "При решении сложных проблем...",
    block: "adapted",
    options: [
      { id: 'a9-1', text: "Беру ответственность на себя", type: "D" },
      { id: 'a9-2', text: "Мобилизую команду на решение", type: "I" },
      { id: 'a9-3', text: "Сохраняю спокойствие и выдержку", type: "S" },
      { id: 'a9-4', text: "Анализирую все возможные варианты", type: "C" }
    ]
  },
  {
    id: 10,
    text: "В рабочем общении я предпочитаю...",
    block: "adapted",
    options: [
      { id: 'a10-1', text: "Краткость и конкретику", type: "D" },
      { id: 'a10-2', text: "Эмоциональность и образность", type: "I" },
      { id: 'a10-3', text: "Дружелюбный тон", type: "S" },
      { id: 'a10-4', text: "Факты и цифры", type: "C" }
    ]
  },
  {
    id: 11,
    text: "При планировании работы...",
    block: "adapted",
    options: [
      { id: 'a11-1', text: "Фокусируюсь на главных целях", type: "D" },
      { id: 'a11-2', text: "Оставляю место для импровизации", type: "I" },
      { id: 'a11-3', text: "Создаю стабильный график", type: "S" },
      { id: 'a11-4', text: "Детально прорабатываю каждый этап", type: "C" }
    ]
  },
  {
    id: 12,
    text: "Мой подход к рабочему риску...",
    block: "adapted",
    options: [
      { id: 'a12-1', text: "Вижу возможности в риске", type: "D" },
      { id: 'a12-2', text: "Эмоционально вовлекаюсь в рискованные проекты", type: "I" },
      { id: 'a12-3', text: "Предпочитаю проверенные пути", type: "S" },
      { id: 'a12-4', text: "Просчитываю все варианты", type: "C" }
    ]
  },
  {
    id: 13,
    text: "При оценке своей работы...",
    block: "adapted",
    options: [
      { id: 'a13-1', text: "Сравниваю с конкурентами", type: "D" },
      { id: 'a13-2', text: "Ориентируюсь на обратную связь коллег", type: "I" },
      { id: 'a13-3', text: "Ценю стабильность результатов", type: "S" },
      { id: 'a13-4', text: "Анализирую объективные показатели", type: "C" }
    ]
  },
  {
    id: 14,
    text: "В профессиональном развитии я...",
    block: "adapted",
    options: [
      { id: 'a14-1', text: "Стремлюсь к карьерному росту", type: "D" },
      { id: 'a14-2', text: "Ищу вдохновляющие направления", type: "I" },
      { id: 'a14-3', text: "Развиваюсь постепенно", type: "S" },
      { id: 'a14-4', text: "Систематически повышаю квалификацию", type: "C" }
    ]
  },

  // ========== ЕСТЕСТВЕННЫЕ (ЖИЗНЬ) - учитываются только 3 и 4 места ==========
  {
    id: 15,
    text: "В свободное время я обычно...",
    block: "natural",
    options: [
      { id: 'n1-1', text: "Планирую активный отдых", type: "D" },
      { id: 'n1-2', text: "Ищу новые впечатления", type: "I" },
      { id: 'n1-3', text: "Предпочитаю привычные занятия", type: "S" },
      { id: 'n1-4', text: "Занимаюсь хобби, требующим внимания", type: "C" }
    ]
  },
  {
    id: 16,
    text: "В общении с друзьями я...",
    block: "natural",
    options: [
      { id: 'n2-1', text: "Беру инициативу в свои руки", type: "D" },
      { id: 'n2-2', text: "Душа компании", type: "I" },
      { id: 'n2-3', text: "Спокойный слушатель", type: "S" },
      { id: 'n2-4', text: "Общаюсь на глубокие темы", type: "C" }
    ]
  },
  {
    id: 17,
    text: "При решении бытовых вопросов...",
    block: "natural",
    options: [
      { id: 'n3-1', text: "Действую быстро", type: "D" },
      { id: 'n3-2', text: "Ищу креативные решения", type: "I" },
      { id: 'n3-3', text: "Следую привычному порядку", type: "S" },
      { id: 'n3-4', text: "Продумываю все детали", type: "C" }
    ]
  },
  {
    id: 18,
    text: "В семейных отношениях я...",
    block: "natural",
    options: [
      { id: 'n4-1', text: "Беру ответственность за решения", type: "D" },
      { id: 'n4-2', text: "Создаю праздничную атмосферу", type: "I" },
      { id: 'n4-3', text: "Обеспечиваю стабильность", type: "S" },
      { id: 'n4-4', text: "Действую по принципам и правилам", type: "C" }
    ]
  },
  {
    id: 19,
    text: "Мой подход к личным финансам...",
    block: "natural",
    options: [
      { id: 'n5-1', text: "Инвестирую в перспективные проекты", type: "D" },
      { id: 'n5-2', text: "Позволяю себе спонтанные покупки", type: "I" },
      { id: 'n5-3', text: "Экономно распределяю бюджет", type: "S" },
      { id: 'n5-4', text: "Тщательно планирую расходы", type: "C" }
    ]
  },
  {
    id: 20,
    text: "В стрессовых жизненных ситуациях...",
    block: "natural",
    options: [
      { id: 'n6-1', text: "Концентрируюсь на решении", type: "D" },
      { id: 'n6-2', text: "Ищу поддержку у друзей", type: "I" },
      { id: 'n6-3', text: "Сохраняю спокойствие", type: "S" },
      { id: 'n6-4', text: "Анализирую причины и последствия", type: "C" }
    ]
  },
  {
    id: 21,
    text: "При планировании отдыха...",
    block: "natural",
    options: [
      { id: 'n7-1', text: "Выбираю активные приключения", type: "D" },
      { id: 'n7-2', text: "Ищу новые впечатления", type: "I" },
      { id: 'n7-3', text: "Предпочитаю проверенные места", type: "S" },
      { id: 'n7-4', text: "Тщательно разрабатываю маршрут", type: "C" }
    ]
  },
  {
    id: 22,
    text: "Мое отношение к домашним делам...",
    block: "natural",
    options: [
      { id: 'n8-1', text: "Делаю быстро и эффективно", type: "D" },
      { id: 'n8-2', text: "Превращаю в игру или развлечение", type: "I" },
      { id: 'n8-3', text: "Выполняю по привычке", type: "S" },
      { id: 'n8-4', text: "Подхожу систематически", type: "C" }
    ]
  },
  {
    id: 23,
    text: "В личном развитии я...",
    block: "natural",
    options: [
      { id: 'n9-1', text: "Ставлю амбициозные цели", type: "D" },
      { id: 'n9-2', text: "Ищу вдохновляющие занятия", type: "I" },
      { id: 'n9-3', text: "Развиваюсь в комфортном темпе", type: "S" },
      { id: 'n9-4', text: "Систематически работаю над собой", type: "C" }
    ]
  },
  {
    id: 24,
    text: "При общении с незнакомцами...",
    block: "natural",
    options: [
      { id: 'n10-1', text: "Легко начинаю разговор", type: "D" },
      { id: 'n10-2', text: "Быстро нахожу общие темы", type: "I" },
      { id: 'n10-3', text: "Предпочитаю слушать", type: "S" },
      { id: 'n10-4', text: "Общаюсь сдержанно", type: "C" }
    ]
  },
  {
    id: 25,
    text: "Мой подход к здоровью...",
    block: "natural",
    options: [
      { id: 'n11-1', text: "Ставлю спортивные рекорды", type: "D" },
      { id: 'n11-2', text: "Пробую разные методики", type: "I" },
      { id: 'n11-3', text: "Соблюдаю привычный режим", type: "S" },
      { id: 'n11-4', text: "Слежу по показателям и анализам", type: "C" }
    ]
  },
  {
    id: 26,
    text: "В спорах с близкими...",
    block: "natural",
    options: [
      { id: 'n12-1', text: "Отстаиваю свою позицию", type: "D" },
      { id: 'n12-2', text: "Стараюсь разрядить обстановку", type: "I" },
      { id: 'n12-3', text: "Ищу компромисс", type: "S" },
      { id: 'n12-4', text: "Апеллирую к фактам", type: "C" }
    ]
  },
  {
    id: 27,
    text: "При выборе хобби...",
    block: "natural",
    options: [
      { id: 'n13-1', text: "Выбираю конкурентные виды", type: "D" },
      { id: 'n13-2', text: "Ищу творческие занятия", type: "I" },
      { id: 'n13-3', text: "Предпочитаю спокойные увлечения", type: "S" },
      { id: 'n13-4', text: "Выбираю требующие точности", type: "C" }
    ]
  },
  {
    id: 28,
    text: "В личных отношениях...",
    block: "natural",
    options: [
      { id: 'n14-1', text: "Беру инициативу", type: "D" },
      { id: 'n14-2', text: "Дарю яркие эмоции", type: "I" },
      { id: 'n14-3', text: "Создаю стабильность", type: "S" },
      { id: 'n14-4', text: "Выстраиваю глубокую связь", type: "C" }
    ]
  }
];
console.log(25-5/5)
const typeDescriptions = {
  D: {
    title: "Доминирование (D)",
    description: "Вы решительны, нацелены на результат и прямолинейны. Любите преодолевать препятствия, быстро принимаете решения.",
    strengths: [
      "Сильное лидерство",
      "Быстрое принятие решений",
      "Ориентация на результат",
      "Решительность в сложных ситуациях"
    ],
    challenges: [
      "Может быть нетерпеливым",
      "Иногда излишне прямолинеен",
      "Склонен к конфронтации",
      "Может игнорировать чувства других"
    ],
    careers: [
      "Предприниматель",
      "Топ-менеджер",
      "Руководитель проекта",
      "Военный руководитель"
    ],
    color: "#e74c3c"
  },
  I: {
    title: "Влияние (I)",
    description: "Вы коммуникабельны, оптимистичны и энергичны. Любите работать с людьми, мотивируете других, избегаете рутины.",
    strengths: [
      "Отличные коммуникативные навыки",
      "Энтузиазм и позитивная энергия",
      "Умение вдохновлять других",
      "Гибкость и адаптивность"
    ],
    challenges: [
      "Может быть неорганизованным",
      "Склонен к излишнему оптимизму",
      "Не любит детали и рутину",
      "Может говорить больше, чем слушать"
    ],
    careers: [
      "Маркетолог",
      "PR-специалист",
      "Тренер",
      "Актер/Ведущий"
    ],
    color: "#f39c12"
  },
  S: {
    title: "Стабильность (S)",
    description: "Вы надежны, терпеливы и умеете слушать. Цените стабильность, избегаете конфликтов, преданны как командный игрок.",
    strengths: [
      "Надежность и преданность",
      "Отличные навыки слушания",
      "Терпение в сложных ситуациях",
      "Умение поддерживать гармонию"
    ],
    challenges: [
      "Сопротивляется изменениям",
      "Избегает конфликтов даже когда это нужно",
      "Может быть слишком уступчивым",
      "С трудом выражает собственные потребности"
    ],
    careers: [
      "Педагог",
      "Социальный работник",
      "Администратор",
      "Медсестра/Врач"
    ],
    color: "#27ae60"
  },
  C: {
    title: "Добросовестность (C)",
    description: "Вы аналитичны, точны и систематичны. Следуете правилам, цените качество, предпочитаете работать с фактами.",
    strengths: [
      "Высокая точность и аккуратность",
      "Аналитическое мышление",
      "Системный подход к задачам",
      "Внимание к деталям"
    ],
    challenges: [
      "Может быть перфекционистом",
      "Склонен к излишней критичности",
      "Избегает рисков и неопределенности",
      "Медленно принимает решения"
    ],
    careers: [
      "Аналитик данных",
      "Инженер",
      "Бухгалтер/Аудитор",
      "Исследователь"
    ],
    color: "#3498db"
  }
};

// Описания комбинаций типов
const combinationDescriptions = {
  'DI': {
    title: "Лидер-Вдохновитель",
    description: "Вы сочетаете решительность D с харизмой I. Отлично мотивируете команды на достижение амбициозных целей."
  },
  'DS': {
    title: "Практичный Лидер",
    description: "Сила D и стабильность S делают вас надежным руководителем, который умеет достигать целей системно."
  },
  'DC': {
    title: "Стратегический Решатель",
    description: "Сочетание D и C создает аналитического лидера, способного принимать сложные решения на основе данных."
  },
  'ID': {
    title: "Предприниматель",
    description: "Ваша энергия I и решительность D позволяют вам создавать новые проекты и вдохновлять других на их реализацию."
  },
  'IS': {
    title: "Душа компании",
    description: "Социальность I и стабильность S делают вас отличным коммуникатором, создающим гармоничную атмосферу."
  },
  'IC': {
    title: "Творческий Аналитик",
    description: "Вы сочетаете креативность I с аналитичностью C, что позволяет создавать инновационные, но продуманные решения."
  },
  'SD': {
    title: "Надежный Исполнитель",
    description: "Стабильность S и решительность D помогают вам системно достигать поставленных целей."
  },
  'SI': {
    title: "Поддерживающий Лидер",
    description: "Ваша стабильность S и коммуникабельность I делают вас естественным лидером, который заботится о команде."
  },
  'SC': {
    title: "Методичный Профессионал",
    description: "Сочетание S и C создает надежного специалиста, работающего по проверенным методикам с высоким качеством."
  },
  'CD': {
    title: "Системный Лидер",
    description: "Аналитичность C и решительность D позволяют вам создавать эффективные системы для достижения целей."
  },
  'CI': {
    title: "Точный Коммуникатор",
    description: "Вы сочетаете аналитичность C с коммуникабельностью I, что позволяет вам точно доносить сложные идеи."
  },
  'CS': {
    title: "Методичный Исполнитель",
    description: "Ваша точность C и стабильность S делают вас идеальным исполнителем для сложных, требующих точности задач."
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('adapted');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const initialAnswers = {};
    questions.forEach(question => {
      initialAnswers[question.id] = [...question.options];
    });
    return initialAnswers;
  });
  const [result, setResult] = useState(null);

  const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      }),
      useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    document.body.classList.remove('dragging-active');

    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const questionId = questions[currentQuestion].id;
      setAnswers(prev => {
        const oldOptions = prev[questionId] || [...questions[currentQuestion].options];

        const oldIndex = oldOptions.findIndex(opt => opt.id === active.id);
        const newIndex = oldOptions.findIndex(opt => opt.id === over.id);

        return {
          ...prev,
          [questionId]: arrayMove(oldOptions, oldIndex, newIndex)
        };
      });
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    const adaptedScores = { D: 0, I: 0, S: 0, C: 0 };
    const naturalScores = { D: 0, I: 0, S: 0, C: 0 };

    Object.entries(answers).forEach(([questionId, options]) => {
      const question = questions.find(q => q.id == questionId);

      options.forEach((option, index) => {
        // Для всех ответов начисляем баллы по убывающей шкале
        // 1 место: 4 балла, 2 место: 3 балла, 3 место: 2 балла, 4 место: 1 балл
        const points = 4 - index;

        if (question.block === "adapted") {
          adaptedScores[option.type] += points;
        } else if (question.block === "natural") {
          naturalScores[option.type] += points;
        }
      });
    });

    const calculateProfile = (scores) => {
      const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
      const percentages = {
        D: Math.round((scores.D / totalScore) * 100),
        I: Math.round((scores.I / totalScore) * 100),
        S: Math.round((scores.S / totalScore) * 100),
        C: Math.round((scores.C / totalScore) * 100)
      };

      const sortedTypes = Object.entries(scores)
          .sort((a, b) => b[1] - a[1])
          .map(item => item[0]);

      return {
        scores: { ...scores },
        percentages,
        dominantType: sortedTypes[0],
        secondaryType: sortedTypes[1],
        combination: `${sortedTypes[0]}${sortedTypes[1]}`,
        sortedTypes
      };
    };

    setResult({
      adapted: calculateProfile(adaptedScores),
      natural: calculateProfile(naturalScores)
    });
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setActiveTab('adapted');
  };

  const currentQ = questions[currentQuestion];
  const questionId = currentQ.id;
  const currentOptions = answers[questionId] || currentQ.options;

  return (
      <div className="app">
        <h1>Тест DISC</h1>

        {!result ? (
            <div className="question-container">
              <div className="progress">
                Вопрос {currentQuestion + 1} из {questions.length}
              </div>

              <h2>{currentQ.text}</h2>
              <p className="instructions">
                Перетащите варианты ответов, расположив их в порядке от наиболее к наименее подходящему:
              </p>

              <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  onDragStart={() => {
                    document.body.classList.add('dragging-active');
                  }}
                  onDragCancel={() => {
                    document.body.classList.remove('dragging-active');
                  }}
              >
                <SortableContext
                    items={currentOptions.map(opt => opt.id)}
                    strategy={verticalListSortingStrategy}
                >
                  <div className="options">
                    {currentOptions.map((option, index) => (
                        <MemoizedSortableItem
                            key={option.id}
                            id={option.id}
                            text={option.text}
                            index={index}
                        />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="navigation-buttons">
                <button
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestion === 0}
                    className="nav-btn prev-btn"
                >
                  Назад
                </button>

                {currentQuestion === questions.length - 1 ? (
                    <button
                        onClick={calculateResult}
                        className="submit-btn"
                    >
                      Завершить тест
                    </button>
                ) : (
                    <button
                        onClick={goToNextQuestion}
                        className="nav-btn next-btn"
                    >
                      Далее
                    </button>
                )}
              </div>
            </div>
        ) : (
            <div className="result-container">
              <h2>Ваш профиль DISC</h2>

              <div className="result-tabs">
                <button
                    className={activeTab === 'adapted' ? 'active' : ''}
                    onClick={() => setActiveTab('adapted')}
                >
                  Адаптивное поведение
                </button>
                <button
                    className={activeTab === 'natural' ? 'active' : ''}
                    onClick={() => setActiveTab('natural')}
                >
                  Естественное поведение
                </button>
              </div>

              <div className="scores-chart">
                <h3>Распределение баллов ({activeTab === 'adapted' ? 'работа' : 'жизнь'}):</h3>
                {result[activeTab].sortedTypes.map(type => (
                    <div key={type} className="score-row">
                      <div className="type-header" >
                        {type}: {result[activeTab].percentages[type]}%
                      </div>
                      <div className="score-bar-container">
                        <div
                            className="score-bar"
                            style={{
                              width: `${result[activeTab].percentages[type]}%`,
                              backgroundColor: typeDescriptions[type].color
                            }}
                        ></div>
                      </div>
                      <div className="score-value">{result[activeTab].scores[type]} баллов</div>
                    </div>
                ))}
              </div>

              <div className="profile-summary">
                <h3>Основной тип: {typeDescriptions[result[activeTab].dominantType].title}</h3>
                <p>{typeDescriptions[result[activeTab].dominantType].description}</p>

                <h4>Сочетание: {combinationDescriptions[result[activeTab].combination]?.title || 'Не определено'}</h4>
                <p>{combinationDescriptions[result[activeTab].combination]?.description || 'Описание сочетания отсутствует'}</p>
              </div>

              <div className="type-details">
                <h3>Сильные стороны:</h3>
                <ul>
                  {typeDescriptions[result[activeTab].dominantType].strengths.map((item, index) => (
                      <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>Возможные сложности:</h3>
                <ul>
                  {typeDescriptions[result[activeTab].dominantType].challenges.map((item, index) => (
                      <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>Рекомендуемые профессии:</h3>
                <div className="careers">
                  {typeDescriptions[result[activeTab].dominantType].careers.map((career, index) => (
                      <span key={index} className="career-tag">{career}</span>
                  ))}
                </div>
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
