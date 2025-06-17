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
const scoreSection = document.querySelector(".score_section");
const totalQuestion = document.querySelector("#total");
const correctAns = document.querySelector("#correct");
const incorrectAns = document.querySelector("#incorrect");


const showDif = document.querySelector('.show_dif');
const startingMinutes = 1;
let time = startingMinutes*60

const countDownEl = document.querySelector(".countdown");



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
  setInterval(updateCountdown, 1000);


function updateCountdown(){
  let minutes = Math.floor(time/60);
  let seconds = time%60;

  minutes = minutes <= 1? '0' + minutes : minutes;
  seconds = seconds<10? '0' + seconds : seconds;
  
  countDownEl.innerHTML = `${minutes}: ${seconds}`;

  if (time <= 0) {
    clearInterval(countdownInterval);
    countDownEl.innerHTML = "00:00";


  }
  else if (time <= 5) {
    countDownEl.style.backgroundColor = "red";
  }
  else if (time <= 15) {
    countDownEl.style.backgroundColor = "orange";
  }
  else if (time <= 25) {
    countDownEl.style.backgroundColor = "yellow";
  }
  time--;
}
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
    quizSection.style.display = "none";
    scoreSection.style.display = "block";
    totalQuestion.innerText = "10";
    correctAns.innerText = `${score}`;
    incorrectAns.innerText = `${10-score}`;
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
