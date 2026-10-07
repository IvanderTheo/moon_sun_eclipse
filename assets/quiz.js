const questions = [
  {
    question: "Planet apa yang berada paling dekat dengan Matahari?",
    answers: ["Venus", "Merkurius", "Mars", "Bumi"],
    correct: 1,
    explanation: "Merkurius memiliki orbit paling dekat dengan Matahari."
  },
  {
    question: "Apa yang berada di antara Matahari dan Bumi saat gerhana Matahari?",
    answers: ["Mars", "Bulan", "Jupiter", "Venus"],
    correct: 1,
    explanation: "Bulan melintas di antara Matahari dan Bumi."
  },
  {
    question: "Planet terbesar di Tata Surya adalah ...",
    answers: ["Saturnus", "Neptunus", "Jupiter", "Uranus"],
    correct: 2,
    explanation: "Jupiter adalah planet terbesar di Tata Surya."
  },
  {
    question: "Mengapa Bulan dapat tampak merah saat gerhana Bulan total?",
    answers: [
      "Bulan menghasilkan cahaya merah",
      "Debu Bulan memantulkan cahaya",
      "Atmosfer Bumi membelokkan cahaya merah ke arah Bulan",
      "Matahari berubah warna"
    ],
    correct: 2,
    explanation: "Atmosfer Bumi menyaring dan membelokkan cahaya merah menuju Bulan."
  },
  {
    question: "Planet manakah yang terkenal dengan sistem cincinnya?",
    answers: ["Bumi", "Saturnus", "Merkurius", "Mars"],
    correct: 1,
    explanation: "Saturnus memiliki sistem cincin yang paling mencolok."
  }
];

const progress = document.querySelector("#quiz-progress");
const scoreElement = document.querySelector("#quiz-score");
const progressFill = document.querySelector("#progress-fill");
const questionElement = document.querySelector("#quiz-question");
const answersElement = document.querySelector("#answer-list");
const feedback = document.querySelector("#quiz-feedback");
const nextButton = document.querySelector("#next-question");

let currentQuestion = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const question = questions[currentQuestion];
  answered = false;
  progress.textContent = `Pertanyaan ${currentQuestion + 1} dari ${questions.length}`;
  scoreElement.textContent = `Skor: ${score}`;
  progressFill.style.width = `${(currentQuestion / questions.length) * 100}%`;
  questionElement.textContent = question.question;
  feedback.textContent = "";
  nextButton.disabled = true;
  nextButton.textContent = currentQuestion === questions.length - 1 ? "Lihat hasil" : "Pertanyaan berikutnya";
  answersElement.replaceChildren();

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index, button));
    answersElement.append(button);
  });
}

function chooseAnswer(answerIndex, selectedButton) {
  if (answered) return;
  answered = true;
  const question = questions[currentQuestion];
  const buttons = [...answersElement.children];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === question.correct) button.classList.add("is-correct");
  });

  if (answerIndex === question.correct) {
    score += 1;
    feedback.textContent = `Benar! ${question.explanation}`;
  } else {
    selectedButton.classList.add("is-wrong");
    feedback.textContent = `Belum tepat. ${question.explanation}`;
  }
  scoreElement.textContent = `Skor: ${score}`;
  nextButton.disabled = false;
}

function showResult() {
  progressFill.style.width = "100%";
  document.querySelector("#quiz-card").innerHTML = `
    <div class="quiz-result">
      <p class="eyebrow">Penjelajahan selesai</p>
      <h2>Skor akhirmu</h2>
      <strong>${score} / ${questions.length}</strong>
      <p class="lead">${score === questions.length ? "Luar biasa, semua jawabanmu benar!" : "Bagus! Terus jelajahi halaman belajar untuk menambah pengetahuanmu."}</p>
      <button class="button" id="restart-quiz" type="button">Ulangi kuis</button>
    </div>`;
  document.querySelector("#restart-quiz").addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    renderQuestion();
  });
}

nextButton.addEventListener("click", () => {
  if (currentQuestion === questions.length - 1) {
    showResult();
    return;
  }
  currentQuestion += 1;
  renderQuestion();
});

renderQuestion();
