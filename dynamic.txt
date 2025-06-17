const quizData = [
  {
    question: "What does HTML stand for?",
    option: [
      "Hypertext Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Mark Language",
      "Hyper Tool Markup Language"
    ],
    correct: 0
  },
  {
    question: "Which HTML tag is used to define a hyperlink?",
    option: [
      "<link>",
      "<href>",
      "<a>",
      "<url>"
    ],
    correct: 2
  },
  {
    question: "Which tag is used to insert an image in HTML?",
    option: [
      "<image>",
      "<pic>",
      "<img>",
      "<src>"
    ],
    correct: 2
  },
  {
    question: "Which tag is used to create a numbered list?",
    option: [
      "<ul>",
      "<ol>",
      "<li>",
      "<dl>"
    ],
    correct: 1
  },
  {
    question: "What is the correct HTML element for inserting a line break?",
    option: [
      "<break>",
      "<br>",
      "<lb>",
      "<newline>"
    ],
    correct: 1
  }
];



const quiz = document.querySelector("#quiz");
const answerElm = document.querySelectorAll(".answer");
const [questionElm, option_1, option_2, option_3, option_4 ] = document.querySelectorAll(
    "#question, .option_1, .option_2, .option_3, .option_4"
);


const submitBtn = document.querySelector("#submit");

let currentQuiz = 0;
let score = 0;

 
const loadQuiz = ()=>{
    const {question, option} = quizData[currentQuiz];
    console.log(question);

    questionElm.innerText = `  ${currentQuiz + 1}: ${question}`;

    option.forEach(
        (curOption, index) => (window[`option_${index + 1}`].innerText = curOption)
    );
};

loadQuiz();


const getSelectedOption = () => {
    let answerElement = Array.from(answerElm);
    return answerElement.findIndex((curElem) => curElem.checked);
}

const deselectedAnswers = () => {
    answerElm.forEach((curElem) => curElem.checked =     false);
};

submitBtn.addEventListener("click", () =>{
    const getSelectedOptionIndex = getSelectedOption();
    console.log(getSelectedOptionIndex);

    if(getSelectedOptionIndex == quizData[currentQuiz].correct){
        score = score + 1;
    }

    currentQuiz++;

    if(currentQuiz<quizData.length){
        deselectedAnswers();
        loadQuiz()
    }
    else{
        quiz.innerHTML = `
        <div class = "result">
        <h2> Your score : ${score}/${quizData.length} Correct Answers</h2> 
        <p>🏆Congratulations on completing the quiz!🎉</p>
        <button class="reload-button" onclick = "location.reload()">Play Again▶️ </button>
        </div>
        `;
    }
});