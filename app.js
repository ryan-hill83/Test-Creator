
const DATABASE = firebase.database()
const TESTREF = DATABASE.ref("Tests")
const QUESTREF = DATABASE.ref("Questions")
const ANSWERREF = DATABASE.ref("Answers")
const USERCATEGORYREF = DATABASE.ref("Users")

let currentJSUser = localStorage.getItem("vCurrentUser")
let currentUserID = currentJSUser
//console.log(currentUserID)
//variable element names
let textboxQuizName = document.getElementById('textboxQuizName')
let textboxQuizTimeLimit = document.getElementById('textboxQuizTimeLimit')
let btnSubmitQuizName = document.getElementById('btnSubmitQuizName')
let headerQuizName = document.getElementById('headerQuizName')
let headerTimeLimit = document.getElementById('headerTimeLimit')
//let listQuestionAndAnswer = document.getElementById('listQuestionAndAnswer')
let addMultipleChoiceQuestion = document.getElementById('addMultipleChoiceQuestion')
let backButton = document.getElementById('backButton')

let submitButton = document.getElementById('submitButton')

let logOutButton = document.getElementById("logOutButton")
let testInfo = document.getElementById('testInfo')
//testQuestionType1IDArray = []
testQuestionType2IDArray = []

backButton.addEventListener('click', function () {

  currentUserID = ""
  localStorage.setItem("vCurrentUser", currentUserID)
  document.location.href = "teacher_options.html"
})

function deleteQuestionFunction(listItem) {
  whichList = listItem.parentElement
  whichList.removeChild(listItem)

    let numberToRemove = listItem.id
    console.log(numberToRemove)
    for (let index = 0; index < testQuestionType2IDArray.length; index++) {
      console.log(numberToRemove)
      if (testQuestionType2IDArray[index] == numberToRemove) {
        console.log("same Number")
      testQuestionType2IDArray.splice(index, 1)
  }
}
  console.log(testQuestionType2IDArray)
}



function saveTestToDatabase(){
  let testTitle = headerQuizName.innerHTML
  let testTimeLimit = headerTimeLimit.innerHTML
  let uniqueTestIDRef = TESTREF.push()
  console.log(uniqueTestIDRef)
  //saveQuestionType1ToDatabase(testTitle, uniqueTestIDRef)
  saveQuestionType2ToDatabase(testTitle, uniqueTestIDRef, testTimeLimit)

}

// function saveQuestionType1ToDatabase(testTitle, uniqueTestIDRef){


//   console.log(uniqueTestIDRef.path.pieces_[1])
//   testQuestionType1IDArray.map(function () {
//     console.log(unqiueQuestionNumber)
//     let questionText = document.getElementById(unqiueQuestionNumber).childNodes[1].value
//     let mainAnswer = document.getElementById(unqiueQuestionNumber).childNodes[4].value
//     let altAnswer1 = document.getElementById(unqiueQuestionNumber).childNodes[6].value
//     let altAnswer2 = document.getElementById(unqiueQuestionNumber).childNodes[8].value
//     let altAnswer3 = document.getElementById(unqiueQuestionNumber).childNodes[10].value
//     console.log(questionText, mainAnswer, altAnswer1, altAnswer2, altAnswer3)
//     questionObject = { "question" : questionText,
//                         "Answer" : mainAnswer,
//                       "AltAnswerOne" : altAnswer1,
//                       "AltAnswerTwo": altAnswer2,
//                       "AltAnswerThree": altAnswer3}

//     uniqueTestIDRef.child(testTitle).child("Questions").child("Question Type 1").child(unqiueQuestionNumber).set(questionObject)
//     USERCATEGORIESREF.child("Teachers").child(currentUserID).child("Tests").child(uniqueTestIDRef.path.pieces_[1]).child(testTitle).child("Questions").child("Question Type 1").child(unqiueQuestionNumber).set(questionObject)
//   })

// }

function saveQuestionType2ToDatabase(testTitle, uniqueTestIDRef, testTimeLimit) {


  console.log(uniqueTestIDRef.path.pieces_[1])
  testQuestionType2IDArray.map(function (unqiueQuestionNumber) {
    let questionText = document.getElementById("multipleChoiceQuestion" + unqiueQuestionNumber).value
    let choiceA = document.getElementById("multipleChoiceAnswerOne" + unqiueQuestionNumber).value
    let choiceB = document.getElementById("multipleChoiceAnswerTwo" + unqiueQuestionNumber).value
    let choiceC = document.getElementById("multipleChoiceAnswerThree" + unqiueQuestionNumber).value
    let choiceD = document.getElementById("multipleChoiceAnswerFour" + unqiueQuestionNumber).value

    let choiceACheckbox = document.getElementById("checkboxMultipleChoiceAnswerOne" + unqiueQuestionNumber).checked
    let choiceBCheckbox = document.getElementById("checkboxMultipleChoiceAnswerTwo" + unqiueQuestionNumber).checked
    let choiceCCheckbox = document.getElementById("checkboxMultipleChoiceAnswerThree" + unqiueQuestionNumber).checked
    let choiceDCheckbox = document.getElementById("checkboxMultipleChoiceAnswerFour" +unqiueQuestionNumber).checked
    let answer
    if (choiceACheckbox == true){
      answer = choiceA
      }
    else if (choiceBCheckbox == true){
      answer = choiceB
      }
    else if (choiceCCheckbox == true){
      answer = choiceC
      }
    else if (choiceDCheckbox == true) {
      answer = choiceD
      }


    console.log(questionText, choiceA, choiceB, choiceC, choiceD)
    questionMultipleChoiceObject = {
      "ChoiceA": choiceA,
      "ChoiceB": choiceB,
      "ChoiceC": choiceC,
      "ChoiceD": choiceD,
      "question": questionText,
      "testID": uniqueTestIDRef.path.pieces_[1]
    }
    answerMultipleChoiceObject = {"Answer": answer}
    let uniqueTestID = { Test: uniqueTestIDRef.path.pieces_[1]}
    uniqueTestIDRef.set(testTitle)
    QUESTREF.child(unqiueQuestionNumber).set(questionMultipleChoiceObject)
    ANSWERREF.child(unqiueQuestionNumber).set(answerMultipleChoiceObject)
    USERCATEGORYREF.child(currentUserID).child("Tests").child(uniqueTestIDRef.path.pieces_[1]).set(testTitle + "!*!" + testTimeLimit)

    testInfo.innerHTML = `<p>The test ID is <u>${uniqueTestIDRef.path.pieces_[1]}</u><br> Your teacher ID is <u>${currentUserID}</u><br>The student will need to input these codes to take the test.</p>`
  })

}

submitButton.addEventListener('click', function() {
  saveTestToDatabase()
  testQuestionType2IDArray = []
  listQuestionAndAnswer.innerHTML = ""
  headerQuizName.innerHTML = ""
  headerTimeLimit.innerHTML = ""
})

btnSubmitQuizName.addEventListener('click', function() {
  quizName = textboxQuizName.value
  timeLimit = textboxQuizTimeLimit.value
  headerQuizName.innerHTML = quizName
  headerTimeLimit.innerHTML = timeLimit
})

// addQuestion.addEventListener('click', function() {

//   let number = Math.floor(Math.random() * 100000000000000000000)


//   enterQuestionAndAnswer = `
// <li class="questionType1LI" id="${number}">
//   <input type="text" id="quizQuestion" placeholder="Question"/><br>
//   <input type="text" id="quizAnswer" placeholder="Answer" required/>
//   <input type="text" id="quizAlternativeAnswer" placeholder="Alternative answer (optional)" />
//   <input type="text" id="quizAlternativeAnswer" placeholder="Alternative answer (optional)" />
//   <input type="text" id="quizAlternativeAnswer" placeholder="Alternative answer (optional)" />
//   <button id="deleteQuestion" onclick="deleteQuestionFunction(this.parentElement)">remove question</button>
// </li>`

//   testQuestionType1IDArray.push(number)

//   listQuestionAndAnswer.insertAdjacentHTML('beforeend', enterQuestionAndAnswer)


// })

addMultipleChoiceQuestion.addEventListener('click', function() {

let number = Math.floor(Math.random() * 100000000000000000000)

  enterMultipleChoice = `
<li li class="questionType2LI" id="${number}">
  <input type="text" class="multipleChoiceQuestion" id="multipleChoiceQuestion${number}" placeholder="Question"/><br>A.
  <input type="checkbox" class="checkboxMultipleChoiceAnswerOne" id="checkboxMultipleChoiceAnswerOne${number}"/>
  <input type="text" class="multipleChoiceAnswerOne" id="multipleChoiceAnswerOne${number}" placeholder="Answer" /><br>B.
  <input type="checkbox" class="checkboxMultipleChoiceAnswerTwo" id="checkboxMultipleChoiceAnswerTwo${number}"/>
  <input type="text" class="multipleChoiceAnswerTwo" id="multipleChoiceAnswerTwo${number}" placeholder="Answer" /><br>C.
  <input type="checkbox" class="checkboxMultipleChoiceAnswerThree" id="checkboxMultipleChoiceAnswerThree${number}"/>
  <input type="text" class="multipleChoiceAnswerThree" id="multipleChoiceAnswerThree${number}" placeholder="Answer" /><br>D.
  <input type="checkbox" class="checkboxMultipleChoiceAnswerFour" id="checkboxMultipleChoiceAnswerFour${number}"/>
  <input type="text" class="multipleChoiceAnswerFour" id="multipleChoiceAnswerFour${number}" placeholder="Answer" /><br>
  <button class="deleteQuestion" id="deleteQuestion${number}" onclick="deleteQuestionFunction(this.parentElement)">Remove Question</button>
</li>`

  testQuestionType2IDArray.push(number)



  listQuestionAndAnswer.insertAdjacentHTML('beforeend', enterMultipleChoice)
})

logOutButton.addEventListener('click', function () {

  currentUserID = ""
  localStorage.setItem("vCurrentUser", currentUserID)
  document.location.href = "index.html"
})
