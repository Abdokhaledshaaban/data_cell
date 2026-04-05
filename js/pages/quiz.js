// Quiz Page
// quiz

const quizData = {
  excel: {
    title: 'اختبار Excel',
    subtitle: 'أسئلة مركزة على الدوال، المراجع، والجداول المحورية.',
    level: 'مبتدئ - متوسط',
    time: '12 دقيقة',
    accent: '#16a34a',
    questions: [
      {
        q: 'ما وظيفة الدالة SUMIFS في Excel؟',
        options: [
          'تجمع القيم بشرط واحد فقط',
          'تجمع القيم بناءً على عدة شروط',
          'تحسب المتوسط لقائمة قيم',
          'تجمع القيم النصية فقط',
        ],
        answer: 1,
        explain: 'SUMIFS بتجمع القيم مع إمكانية تحديد أكثر من شرط.',
      },
      {
        q: 'مرجع الخلية $A$1 يعني أن المرجع:',
        options: [
          'نسبي للصف والعمود',
          'ثابت للصف والعمود',
          'ثابت للصف فقط',
          'ثابت للعمود فقط',
        ],
        answer: 1,
        explain: 'علامة $ تثبت العمود والصف معًا.',
      },
      {
        q: 'أفضل أداة لتلخيص البيانات بسرعة هي:',
        options: [
          'Conditional Formatting',
          'Pivot Table',
          'Data Validation',
          'Text to Columns',
        ],
        answer: 1,
        explain: 'Pivot Table بتلخص وتعرض البيانات في ثواني.',
      },
      {
        q: 'أي نوع مخطط مناسب لمقارنة القيم بين فئات مختلفة؟',
        options: ['Line Chart', 'Pie Chart', 'Column Chart', 'Scatter Plot'],
        answer: 2,
        explain: 'Column Chart واضح جدًا لمقارنة الفئات.',
      },
    ],
  },
  powerbi: {
    title: 'اختبار Power BI',
    subtitle: 'ركز على نمذجة البيانات وواجهات التقارير.',
    level: 'متوسط',
    time: '10 دقائق',
    accent: '#f59e0b',
    questions: [
      {
        q: 'الفرق الأساسي بين Measure وCalculated Column هو:',
        options: [
          'الـ Measure يتغير مع الفلترة والـ Column ثابتة',
          'الـ Column أسرع في الحساب دائمًا',
          'الـ Measure لا يستخدم DAX',
          'الـ Column تُستخدم فقط في الرسوم',
        ],
        answer: 0,
        explain: 'الـ Measure يعتمد على السياق، بينما العمود ثابت لكل صف.',
      },
      {
        q: 'أفضل مكان لإدارة العلاقات بين الجداول هو:',
        options: [
          'Data View',
          'Model View',
          'Report View',
          'Power Query Editor',
        ],
        answer: 1,
        explain: 'Model View هو المكان المخصص للعلاقات.',
      },
      {
        q: 'أداة Slicer تُستخدم لـ:',
        options: [
          'تصفية البيانات بصريًا',
          'تحويل البيانات',
          'إنشاء KPI',
          'ربط الجداول',
        ],
        answer: 0,
        explain: 'Slicer تسمح بتصفية التقارير بسهولة.',
      },
      {
        q: 'أفضل نوع علاقة بين جدول وقيم مرجعية هو:',
        options: [
          'Many-to-Many',
          'One-to-Many',
          'Many-to-One',
          'One-to-One دائمًا',
        ],
        answer: 1,
        explain: 'One-to-Many هو النموذج الأكثر استخدامًا.',
      },
    ],
  },
  powerquery: {
    title: 'اختبار Power Query',
    subtitle: 'تنضيف البيانات وتحويلها بطريقة احترافية.',
    level: 'مبتدئ - متوسط',
    time: '9 دقائق',
    accent: '#0ea5e9',
    questions: [
      {
        q: 'الخطوة المستخدمة لتغيير نوع البيانات هي:',
        options: [
          'Remove Rows',
          'Change Type',
          'Merge Queries',
          'Split Column',
        ],
        answer: 1,
        explain: 'Change Type هي الخطوة التي تحدد نوع العمود.',
      },
      {
        q: 'الفرق بين Append وMerge هو:',
        options: [
          'Append يدمج الصفوف، Merge يربط الأعمدة',
          'Merge يضيف الصفوف فقط',
          'Append يستخدم العلاقات',
          'لا يوجد فرق',
        ],
        answer: 0,
        explain: 'Append للصفوف المتشابهة، Merge للربط بين جداول.',
      },
      {
        q: 'لغة البرمجة المستخدمة في Power Query هي:',
        options: ['Python', 'DAX', 'M Language', 'SQL'],
        answer: 2,
        explain: 'Power Query يعتمد على لغة M.',
      },
      {
        q: 'أفضل خطوة لإزالة الأعمدة غير المطلوبة:',
        options: [
          'Remove Other Columns',
          'Keep Rows',
          'Group By',
          'Replace Values',
        ],
        answer: 0,
        explain: 'Remove Other Columns تسيب الأعمدة المهمة فقط.',
      },
    ],
  },
  analysis: {
    title: 'اختبار تحليل البيانات',
    subtitle: 'أساسيات التحليل الإحصائي واستخلاص الرؤى.',
    level: 'متوسط',
    time: '11 دقيقة',
    accent: '#0f766e',
    questions: [
      {
        q: 'ما معنى KPI في التحليل؟',
        options: [
          'مؤشر الأداء الرئيسي',
          'بيانات خام',
          'نوع من الرسوم البيانية',
          'خطأ في البيانات',
        ],
        answer: 0,
        explain: 'KPI هو مؤشر يقيس الأداء.',
      },
      {
        q: 'القيمة الشاذة (Outlier) هي:',
        options: [
          'قيمة في منتصف البيانات',
          'قيمة بعيدة جدًا عن باقي القيم',
          'قيمة مكررة',
          'قيمة مفقودة',
        ],
        answer: 1,
        explain: 'Outlier تختلف بشكل كبير عن نمط البيانات.',
      },
      {
        q: 'الارتباط (Correlation) يعني:',
        options: [
          'سبب ونتيجة',
          'علاقة بين متغيرين',
          'تكرار البيانات',
          'تنظيف البيانات',
        ],
        answer: 1,
        explain: 'Correlation يقيس العلاقة بين متغيرين بدون إثبات السبب.',
      },
      {
        q: 'أفضل خطوة قبل التحليل هي:',
        options: [
          'تصميم التقرير النهائي',
          'جمع البيانات وتنظيفها',
          'تحديد الألوان',
          'كتابة الاستنتاجات',
        ],
        answer: 1,
        explain: 'تنظيف البيانات خطوة أساسية قبل أي تحليل.',
      },
    ],
  },
};

const quizTitle = document.getElementById('quizTitle');
const quizSubtitle = document.getElementById('quizSubtitle');
const quizLevel = document.getElementById('quizLevel');
const quizCount = document.getElementById('quizCount');
const quizTime = document.getElementById('quizTime');
const quizTimer = document.getElementById('quizTimer');
const quizList = document.getElementById('quizList');
const quizProgress = document.getElementById('quizProgress');
const quizResult = document.getElementById('quizResult');
const quizHint = document.getElementById('quizHint');
const quizShell = document.getElementById('quizShell');
const quizStartBanner = document.getElementById('quizStartBanner');
const startQuiz = document.getElementById('startQuiz');
const submitQuiz = document.getElementById('submitQuiz');
const resetQuiz = document.getElementById('resetQuiz');
const prevQuestion = document.getElementById('prevQuestion');
const nextQuestion = document.getElementById('nextQuestion');
const topicButtons = document.querySelectorAll('.quiz-topic-btn');

const storageKey = 'datacellQuizState';

const getStoredData = () => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : { activeTopic: 'excel', topics: {} };
  } catch (error) {
    return { activeTopic: 'excel', topics: {} };
  }
};

const setStoredData = (data) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    // ignore storage errors
  }
};

const getTopicState = (topicKey) => {
  const data = getStoredData();
  return data.topics && data.topics[topicKey] ? data.topics[topicKey] : null;
};

const saveState = () => {
  const data = getStoredData();
  data.activeTopic = currentTopic;
  if (!data.topics) {
    data.topics = {};
  }
  data.topics[currentTopic] = {
    index: currentIndex,
    answers: userAnswers,
    locked: isLocked,
    remainingSeconds,
    started: hasStarted,
    resultMessage: quizResult ? quizResult.textContent : '',
  };
  setStoredData(data);
};

const clearTopicState = (topicKey) => {
  const data = getStoredData();
  if (data.topics && data.topics[topicKey]) {
    delete data.topics[topicKey];
  }
  data.activeTopic = topicKey;
  setStoredData(data);
};

let currentTopic = 'excel';
let currentIndex = 0;
let userAnswers = [];
let isLocked = false;
let hasStarted = false;
let timerId = null;
let remainingSeconds = 0;

const setAccent = (color) => {
  document.documentElement.style.setProperty('--quiz-accent', color);
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const updateTimerDisplay = () => {
  if (!quizTimer) return;
  quizTimer.textContent = `الوقت المتبقي: ${formatTime(remainingSeconds)}`;
  const timerItem = quizTimer.closest('.quiz-meta-item');
  if (timerItem) {
    timerItem.classList.toggle(
      'is-urgent',
      remainingSeconds <= 30 && !isLocked
    );
  }
};

const showReadyTimer = () => {
  if (!quizTimer) return;
  quizTimer.textContent = 'جاهز للبدء';
  const timerItem = quizTimer.closest('.quiz-meta-item');
  if (timerItem) {
    timerItem.classList.remove('is-urgent');
  }
};

const updateStartUI = () => {
  const isPaused = !hasStarted && !isLocked;
  if (quizShell) {
    quizShell.classList.toggle('is-paused', isPaused);
  }
  if (startQuiz) {
    startQuiz.classList.toggle('d-none', !isPaused);
  }
  if (submitQuiz) {
    submitQuiz.disabled = isPaused || isLocked;
  }
};

const clearTimer = () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
};

const startTimer = (seconds) => {
  clearTimer();
  remainingSeconds = seconds;
  updateTimerDisplay();
  timerId = setInterval(() => {
    if (isLocked) {
      return;
    }
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      updateTimerDisplay();
      clearTimer();
      gradeQuiz(true);
      return;
    }
    updateTimerDisplay();
    saveState();
  }, 1000);
};

const updateProgress = () => {
  const total = quizData[currentTopic].questions.length;
  const answered = userAnswers.filter((ans) => ans !== null).length;
  const percent = Math.round((answered / total) * 100);
  quizProgress.style.width = `${percent}%`;
};

const getScoreSummary = (topic) => {
  let correct = 0;
  let answered = 0;

  topic.questions.forEach((item, index) => {
    const selectedValue = userAnswers[index];
    if (selectedValue !== null) {
      answered += 1;
      if (selectedValue === item.answer) {
        correct += 1;
      }
    }
  });

  const total = topic.questions.length;
  const percent = Math.round((correct / total) * 100);
  const unanswered = total - answered;

  let message = `نتيجتك: ${correct} من ${total} (${percent}%).`;
  if (unanswered > 0) {
    message += ` عندك ${unanswered} سؤال بدون إجابة.`;
  }

  if (percent >= 75) {
    message += ' ممتاز! مستواك قوي.';
  } else if (percent >= 50) {
    message += ' كويس جدًا، ركز على الملاحظات.';
  } else {
    message += ' محتاج شوية مراجعة، ابدأ بالكورسات الأساسية.';
  }

  return { message, percent, correct, total, unanswered };
};

const updateNavButtons = () => {
  const total = quizData[currentTopic].questions.length;
  const isPaused = !hasStarted && !isLocked;
  prevQuestion.disabled = isPaused || currentIndex === 0;
  nextQuestion.disabled = isPaused || currentIndex === total - 1;
};

const renderQuestion = () => {
  const topic = quizData[currentTopic];
  const item = topic.questions[currentIndex];

  const options = item.options
    .map((opt, optIndex) => {
      return `
                <label class="quiz-option" data-index="${optIndex}">
                  <input type="radio" name="q-${currentIndex}" value="${optIndex}">
                  <span class="custom-radio"></span>
                  <span>${opt}</span>
                </label>
              `;
    })
    .join('');

  quizList.innerHTML = `
            <div class="quiz-question" id="question-${currentIndex}">
              <h5>${currentIndex + 1}. ${item.q}</h5>
              <div class="quiz-options">${options}</div>
              <p class="quiz-explain">${item.explain}</p>
            </div>
          `;

  const selectedValue = userAnswers[currentIndex];
  if (selectedValue !== null) {
    const selectedInput = quizList.querySelector(
      `input[value="${selectedValue}"]`
    );
    if (selectedInput) {
      selectedInput.checked = true;
    }
  }

  const inputs = quizList.querySelectorAll('input[type="radio"]');
  const shouldDisable = isLocked || !hasStarted;
  if (shouldDisable) {
    inputs.forEach((input) => {
      input.disabled = true;
    });
  }

  if (isLocked) {
    const correctOption = quizList.querySelector(
      `.quiz-option[data-index="${item.answer}"]`
    );
    if (correctOption) {
      correctOption.classList.add('correct');
    }

    if (selectedValue !== null && selectedValue !== item.answer) {
      const wrongOption = quizList.querySelector(
        `.quiz-option[data-index="${selectedValue}"]`
      );
      if (wrongOption) {
        wrongOption.classList.add('wrong');
      }
    }

    const questionEl = quizList.querySelector('.quiz-question');
    if (questionEl) {
      questionEl.classList.add('show-explain');
    }
  }

  updateNavButtons();
};

const renderQuiz = (topicKey) => {
  const topic = quizData[topicKey];
  if (!topic) return;
  currentTopic = topicKey;

  const total = topic.questions.length;
  const durationSeconds = (parseInt(topic.time, 10) || 10) * 60;
  const stored = getTopicState(topicKey);
  let storedResultMessage = '';

  if (
    stored &&
    Array.isArray(stored.answers) &&
    stored.answers.length === total
  ) {
    currentIndex = Math.min(stored.index ?? 0, total - 1);
    userAnswers = stored.answers.map((value) =>
      value === null || typeof value === 'number' ? value : null
    );
    isLocked = !!stored.locked;
    hasStarted =
      typeof stored.started === 'boolean' ? stored.started : isLocked;
    storedResultMessage = stored.resultMessage || '';
    const storedRemaining =
      typeof stored.remainingSeconds === 'number'
        ? stored.remainingSeconds
        : durationSeconds;
    if (storedRemaining > 0) {
      remainingSeconds = storedRemaining;
    } else {
      remainingSeconds = isLocked ? 0 : durationSeconds;
    }
  } else {
    currentIndex = 0;
    userAnswers = Array(total).fill(null);
    isLocked = false;
    hasStarted = false;
    remainingSeconds = durationSeconds;
  }

  if (isLocked) {
    hasStarted = true;
  }

  topicButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.topic === topicKey);
  });

  setAccent(topic.accent);

  quizTitle.textContent = topic.title;
  quizSubtitle.textContent = topic.subtitle;
  quizLevel.textContent = topic.level;
  quizCount.textContent = `${topic.questions.length} أسئلة`;
  quizTime.textContent = topic.time;

  quizResult.classList.remove('show');
  quizResult.textContent = '';
  quizHint.textContent = !hasStarted && !isLocked
    ? 'اضغط ابدأ الامتحان لبدء العد والإجابة على الأسئلة.'
    : 'اختار إجابة لكل سؤال علشان النتيجة تكون دقيقة.';

  if (isLocked) {
    const { message } = getScoreSummary(topic);
    quizResult.textContent = storedResultMessage || message;
    quizResult.classList.add('show');
    quizHint.textContent = 'تم اظهار الإجابات الصحيحة باللون الأخضر.';
    submitQuiz.disabled = true;
    resetQuiz.classList.remove('d-none');
    clearTimer();
    updateTimerDisplay();
  } else {
    submitQuiz.disabled = !hasStarted;
    resetQuiz.classList.add('d-none');
    if (hasStarted) {
      startTimer(remainingSeconds);
    } else {
      clearTimer();
      showReadyTimer();
    }
  }

  updateProgress();
  renderQuestion();
  updateStartUI();
  saveState();
};

const gradeQuiz = (auto = false) => {
  if (isLocked) return;
  if (!hasStarted && !auto) return;
  clearTimer();

  const topic = quizData[currentTopic];
  const { message } = getScoreSummary(topic);

  quizResult.textContent = message;
  quizResult.classList.add('show');
  quizHint.textContent = 'تم اظهار الإجابات الصحيحة باللون الأخضر.';
  if (auto && quizTimer) {
    quizTimer.textContent = 'انتهى الوقت';
    const timerItem = quizTimer.closest('.quiz-meta-item');
    if (timerItem) {
      timerItem.classList.remove('is-urgent');
    }
  }

  isLocked = true;
  hasStarted = true;
  submitQuiz.disabled = true;
  resetQuiz.classList.remove('d-none');
  renderQuestion();
  updateStartUI();
  saveState();
};

const resetQuizState = () => {
  clearTopicState(currentTopic);
  renderQuiz(currentTopic);
};

topicButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    renderQuiz(btn.dataset.topic);
    window.scrollTo({
      top: document.getElementById('quizSection').offsetTop - 70,
      behavior: 'smooth',
    });
  });
});

quizList.addEventListener('change', (e) => {
  if (isLocked || !hasStarted) return;
  if (e.target.matches('input[type="radio"]')) {
    userAnswers[currentIndex] = parseInt(e.target.value, 10);
    updateProgress();
    saveState();
  }
});

prevQuestion.addEventListener('click', () => {
  if (!hasStarted) return;
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderQuestion();
    saveState();
  }
});

nextQuestion.addEventListener('click', () => {
  if (!hasStarted) return;
  const total = quizData[currentTopic].questions.length;
  if (currentIndex < total - 1) {
    currentIndex += 1;
    renderQuestion();
    saveState();
  }
});

submitQuiz.addEventListener('click', gradeQuiz);
resetQuiz.addEventListener('click', resetQuizState);
if (startQuiz) {
  startQuiz.addEventListener('click', () => {
    if (isLocked) return;
    if (!hasStarted) {
      hasStarted = true;
      if (remainingSeconds <= 0) {
        const topic = quizData[currentTopic];
        remainingSeconds = (parseInt(topic.time, 10) || 10) * 60;
      }
      startTimer(remainingSeconds);
      quizHint.textContent = 'اختار إجابة لكل سؤال علشان النتيجة تكون دقيقة.';
      updateStartUI();
      renderQuestion();
      saveState();
    }
  });
}

const storedData = getStoredData();
if (storedData.activeTopic && quizData[storedData.activeTopic]) {
  currentTopic = storedData.activeTopic;
}

renderQuiz(currentTopic);
