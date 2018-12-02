let testContainer = document.getElementById("testContainer")
let testsList = document.getElementById("testsList")
let resultsContainer = document.getElementById("resultsContainer")
let resultsList = document.getElementById("resultsList")
let viewTestsBtn = document.getElementById("viewTestsBtn")
const database = firebase.database()
const testsRef = database.ref("Tests")
const usersRef =  database.ref("Users")

let currentJSUser = localStorage.getItem("vCurrentUser")
let currentUserID = currentJSUser

firebase.auth().onAuthStateChanged(function(user) {
if (user) {
  viewTestsBtn.addEventListener('click', function () {
 usersRef.on('value',function(snapshot){
     testsList.innerHTML = ''
     snapshot.forEach(function(childSnapshot){
       if (childSnapshot.key == currentUserID){
       childSnapshot.forEach(function(childChildSnapshot){
         if (childChildSnapshot.key == "Tests"){
           childChildSnapshot.forEach(function(childChildChildSnapshot){
             key = childChildChildSnapshot.key
             value = childChildChildSnapshot.val()
       testsList.innerHTML += `<li><a href="#" onclick="javascript:showResults()">${value}</a> ${key}</li>`
     })
     }
     })
   }
     })
   })
 })
}
})

function showResults(){

  firebase.auth().onAuthStateChanged(function(user) {
   if (user) {
    usersRef.on('value',function(snapshot){
        resultsList.innerHTML = ''
        snapshot.forEach(function(childSnapshot){
          if (childSnapshot.key == currentUserID){
          childSnapshot.forEach(function(childChildSnapshot){
            if (childSnapshot.val().AccountType == "Teacher" ){
              childChildSnapshot.forEach(function(childChildChildSnapshot){
                const yourStudents = childSnapshot.val().Students
                Object.keys(yourStudents).forEach(studentKey => {
                  console.log(studentKey)
                  snapshot.forEach(function(childSnapshot){
                      if (studentKey == childSnapshot.key){
                        let name = childSnapshot.val().FirstName + " " + childSnapshot.val().LastName
                        studentObj = yourStudents[studentKey]
                        Object.keys(studentObj.Tests).forEach(studentTestId => {
                            const studentTestScore = studentObj.Tests[studentTestId]
                            resultsList.innerHTML = `<li>Name: ${name} &emsp; Score: ${studentTestScore}</li>`
                        })
                      }
                  })
                  })
            })
           }
         })
        }
      })
    })
  }
})
}


let logOutButton = document.getElementById("logOutButton")

logOutButton.addEventListener('click', function () {
currentUserID = ""
 localStorage.setItem("vCurrentUser", currentUserID)
 document.location.href = "index.html"
})
