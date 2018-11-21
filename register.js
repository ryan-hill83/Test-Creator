let userID

const DATABASE = firebase.database()
let userCategoryRef = DATABASE.ref("Users")

let btnSelectLogin = document.getElementById("btnSelectLogin")
let btnSelectRegister = document.getElementById("btnSelectRegister")

let regLogin = document.getElementById("regLogin")

btnSelectLogin.addEventListener('click', function () {

  login()
})

btnSelectRegister.addEventListener('click', function () {

register()

})






function register() {
  regLogin.innerHTML = `<h3>Register User</h3>
  <div>
    <label>Enter Email as Username</label>
    <input type="email" id="emailTextBox" placeholder="Enter your e-mail address as username"/>
    <input type="email" id="emailTextBox2" placeholder="Confirm e-mail address" />
  </div>
  <div>
    <label>Create Password</label>
    <input type="password" id="passwordTextBox" placeholder="Create a password"/>
    <input type="password" id="passwordTextBox2" placeholder="Confirm password"/>
  </div>
  <div>
    <label>Enter Name</label>
    <input type ="textbox" id="firstNameTextBox" placeholder="First Name"/>
    <input type ="textbox" id="lastNameTextBox" placeholder="Last Name"/>
  </div>
   <div>
    <label>School Name</label>
    <input type ="textbox" id="schoolNameTextBox" placeholder="Enter School"/>
  </div>
  <div>
    <label>Select Account Type</label><br>
    <input type="radio" value="teacher" name="accountType"> Teacher</input>
    <input type="radio" value="student" name="accountType"> Student</input>
  </div>
  <div>
    <button id="btnRegister">Register</button>
  </div>`

    let emailTextBox = document.getElementById("emailTextBox")
    let emailTextBox2 = document.getElementById("emailTextBox2")
    let passwordTextBox = document.getElementById("passwordTextBox")
    let passwordTextBox2 = document.getElementById("passwordTextBox2")
    let firstNameTextBox = document.getElementById("firstNameTextBox")
    let lastNameTextBox = document.getElementById("lastNameTextBox")
    let schoolNameTextBox = document.getElementById("schoolNameTextBox")


    let btnRegister = document.getElementById("btnRegister")





    btnRegister.addEventListener('click', function () {

      let email = emailTextBox.value
      let email2 = emailTextBox2.value
      let password = passwordTextBox.value
      let password2 = passwordTextBox2.value
      let firstName = firstNameTextBox.value
      let lastName = lastNameTextBox.value
      let schoolName = schoolNameTextBox.value
      let radioValue = document.querySelector('input[name="accountType"]:checked').value

      function saveUser(userID) {
        if (radioValue === "student") {
          saveStudent(userID)
        }
        else {
          saveTeacher(userID)
        }
      }

      function saveTeacher(userID) {

        let currentUser = { UserID: userID,
                            FirstName : firstName,
                            LastName: lastName,
                            School: schoolName,
                            AccountType : "Teacher",
                          }
        userCategoryRef.child(userID).set(currentUser)
      }
      function saveStudent(userID) {
        let currentUser = { UserID: userID,
                            FirstName: firstName,
                            LastName: lastName,
                            School: schoolName,
                            AccountType: "Student" }
        userCategoryRef.child(userID).set(currentUser)
      }
      // create a new user using email and password
      if (email === email2 && password === password2) {

          firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (user) {
              console.log("User created")
              console.log(user)
              let userID = user.user.uid
              console.log(userID)
              login()
              saveUser(userID)

            })
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              if (errorCode === "auth/email-already-in-use") {
              
                userPreRegisterMessage()
              }
            })
          }
      else if (email !== email2){
        alert("Emails do not match")
      }
      else if (password !== password2) {
        alert("Passwords do not match")
      }
    })
  }

function login() {

  regLogin.innerHTML = `<h3>Login User</h3>
<label>Username</label>
<input type="email" id="loginEmailTextBox" placeholder="Enter email address" />
<label>Password</label>
<input type="password" id="loginPasswordTextBox" placeholder="Enter password" />
<button id="btnLogin">Login</button>
</body>`

  let loginEmailTextBox = document.getElementById("loginEmailTextBox")
  let loginPasswordTextBox = document.getElementById("loginPasswordTextBox")
  let btnLogin = document.getElementById("btnLogin")

  btnLogin.addEventListener('click', function () {

    let email = loginEmailTextBox.value
    let password = loginPasswordTextBox.value

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (user) {
        console.log("User Signed In Successfully!!")
        userID = user.user.uid
        localStorage.setItem("vCurrentUser", userID)
        appDirector(userID)
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
        if (errorCode === "auth/user-not-found") {
        userNotRegistedMessage()
      } else {
          alert("Invalid password")
      }
      })
  })

}

function userPreRegisterMessage() {
  regLogin.insertAdjacentHTML('beforeend', `<div>User Already Registered</div>
  <button id="btnSelectLogin">Login</button>`)
  let btnSelectLogin = document.getElementById("btnSelectLogin")
  btnSelectLogin.addEventListener('click', function () {

    login()
  })
}

function userNotRegistedMessage() {
  regLogin.insertAdjacentHTML('beforeend', `<div>User Not Registered</div>
  <button id="btnSelectRegister">Register</button>`)
  let btnSelectRegister = document.getElementById("btnSelectRegister")
  btnSelectRegister.addEventListener('click', function () {

    login()
  })
}

 function appDirector(userID) {
     userCategoryRef.on('value', function (snapshot){
       //console.log(snapshot.val())
       snapshot.forEach(function (childSnapshot){
        //console.log(childSnapshot.val())
         //console.log(childSnapshot.val().userID)
         //console.log(userID)
         let userID2 = childSnapshot.val().UserID
         //console.log(userID2)
         //console.log(childSnapshot.val().AccountType)
         if (userID2 == userID) {
           let loginAccountType = childSnapshot.val().AccountType
           if (loginAccountType == "Student") {
             testTakerApp()
           }
           else {
             teacherOptions()
           }
         }
        })
      })
    }

function teacherOptions(){
  document.location.href = "teacher_options.html"
}
function testTakerApp() {
  document.location.href = "student.html"
}
