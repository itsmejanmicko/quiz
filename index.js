const quiz_api = "https://quizapi.io/api/v1/questions?apiKey=H0WIkAg4wptwreWZ4xhugQDnj1UzkazO8tsTG8xd&limit=10";

const questionsDiv = document.getElementById("questions");
const nextQuestions = document.getElementById("next-button");
const number_of_questions = document.querySelector(".number-of-question");
const timeLeftSpan = document.querySelector(".time-left");

let correctAnswer = 0;
let questions = [];
let currentQuestionIndex = 0;
let timer;
let timeLeft = 10;

function startTimer() {
    timeLeft = 10;
    timeLeftSpan.textContent = `${timeLeft}s`;
    
    timer = setInterval(() => {
        timeLeft--;
        timeLeftSpan.textContent = `${timeLeft}s`;

        if (timeLeft === 0) {
            clearInterval(timer);
            checkAnswerAndMoveNext();
        }
    }, 1000);
}

setTimeout(() => {
    fetch(quiz_api, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
       questions = data;  
       if (questions.length > 0) {
           displayQuestion(questions[currentQuestionIndex]);
       }
    })
    .catch(error => {
    });
}, 1000);  

function displayQuestion(question) {
    clearInterval(timer);
    startTimer();

    questionsDiv.innerHTML = "";  
    const questionElement = document.createElement("div");
    questionElement.textContent = question.question;
    questionElement.className = "text-lg font-bold mb-4";
    questionsDiv.appendChild(questionElement);

    const optionsList = document.createElement("ul");
    optionsList.className = "list-none pl-6";
    for (const [key, answer] of Object.entries(question.answers)) {
        if (answer) {  
            const optionItem = document.createElement("li");
            optionItem.className = "mb-2 flex items-center";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = key;
            checkbox.className = "mr-2 answer-checkbox";

            const answerText = document.createElement("span");
            answerText.textContent = answer;

            optionItem.appendChild(checkbox);
            optionItem.appendChild(answerText);
            optionsList.appendChild(optionItem);
        }
    }
    questionsDiv.appendChild(optionsList);

    number_of_questions.textContent = `${currentQuestionIndex + 1} of ${questions.length}`;
}

function checkAnswerAndMoveNext() {
    const selectedAnswers = Array.from(document.querySelectorAll(".answer-checkbox:checked")).map(checkbox => checkbox.value);
    
    const correctAnswers = questions[currentQuestionIndex].correct_answers;
    const correctKeys = Object.keys(correctAnswers).filter(key => correctAnswers[key] === "true").map(key => key.replace("_correct", ""));

    const isCorrect = selectedAnswers.length === correctKeys.length && selectedAnswers.every(answer => correctKeys.includes(answer));
    if (isCorrect) {
        correctAnswer++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion(questions[currentQuestionIndex]);
    } else {
        alert(`End of quiz! You scored ${correctAnswer} out of ${questions.length}.`);
        currentQuestionIndex = 0;  
        correctAnswer = 0;
    }
}

nextQuestions.addEventListener("click", () => {
    clearInterval(timer);
    checkAnswerAndMoveNext();
});
