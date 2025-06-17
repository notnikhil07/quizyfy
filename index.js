const quiz = document.querySelector("#quiz");
const answerElm = document.querySelectorAll(".answer");
const [questionElm, option_1, option_2, option_3, option_4] = document.querySelectorAll(
  "#question, #option_1, #option_2, #option_3, #option_4"
);

const startScreen = document.querySelector("#startScreen");
const quizstartBtn = document.querySelector("#quizstartBtn");
const difficultSelect = document.querySelector(".difficult_select");
const difBtn = document.querySelector(".dif_sub");
const submitBtn = document.querySelector("#submit");
const quizSection = document.querySelector('.quiz_section');
const showDif = document.querySelector('.show_dif');

let difficultyValue; // Global variable
let quizData = [];
let currentQuiz = 0;
let score = 0;

// Start button: show difficulty selection
quizstartBtn.addEventListener('click', () => {
  startScreen.style.display = 'none';
  difficultSelect.style.display = 'block';
});

// Difficulty Submit button
difBtn.addEventListener("click", () => {
  const selectedLevel = document.querySelector("input[name='level']:checked");
  difficultyValue = selectedLevel ? selectedLevel.value : null;

  if (!difficultyValue) {
    alert("Please select a difficulty level!");
    return;
  }

  if (difficultyValue == 1) showDif.innerText = "Easy";
  else if (difficultyValue == 2) showDif.innerText = "Medium";
  else if (difficultyValue == 3) showDif.innerText = "Hard";

  difficultSelect.style.display = 'none';
  quizSection.style.display = 'block';

  fetchQuizData(); // Now call it here
});

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const loadQuiz = () => {
  const { question, option } = quizData[currentQuiz];
  questionElm.innerHTML = `${currentQuiz + 1}: ${question}`;
  option.forEach((curOption, index) => {
    window[`option_${index + 1}`].innerText = curOption;
  });
};

const getSelectedOption = () => {
  return Array.from(answerElm).findIndex((curElem) => curElem.checked);
};

const deselectedAnswers = () => {
  answerElm.forEach((curElem) => (curElem.checked = false));
};

submitBtn.addEventListener("click", () => {
  const selectedIndex = getSelectedOption();
  if (selectedIndex === quizData[currentQuiz].correct) {
    score++;
  }
  currentQuiz++;
  if (currentQuiz < quizData.length) {
    deselectedAnswers();
    loadQuiz();
  } else {
    quiz.innerHTML = `
      <div class="result">
        <h2>Your score: ${score}/${quizData.length} Correct Answers</h2>
        <p>🏆 Congratulations on completing the quiz! 🎉</p>
        <button class="reload-button" onclick="location.reload()">Play Again ▶️</button>
      </div>
    `;
  }
});

const fetchQuizData = async () => {
  let url = "";

  if (difficultyValue == 1) {
    url = "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";
  } else if (difficultyValue == 2) {
    url = "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple";
  } else if (difficultyValue == 3) {
    url = "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple";
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    quizData = data.results.map((item) => {
      const options = [...item.incorrect_answers];
      const correctIndex = Math.floor(Math.random() * 4);
      options.splice(correctIndex, 0, item.correct_answer);
      return {
        question: item.question,
        option: options,
        correct: correctIndex
      };
    });

    loadQuiz();
  } catch (error) {
    console.error("Failed to load quiz data:", error);
  }
};
