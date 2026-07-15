//find the form and all the text boxes on the page
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const subjectInput = document.getElementById("subjectInput");
const messageInput = document.getElementById("messageInput");
const formSuccess = document.getElementById("formSuccess");

// Only run this code if the contact form actually exists on the page
if (contactForm) {
// run this when the user clicks the submit button
  contactForm.addEventListener("submit", function (e) {
    // Stop the form from refreshing the page
    e.preventDefault();

    // Run all four checks. Each one returns true (valid) or false (invalid)
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    // if all boxes are good, show the success message
    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
      formSuccess.classList.add("show");
      contactForm.reset();
      //wait 4 seconds then hide the success message
      setTimeout(function () {
        formSuccess.classList.remove("show");
      }, 4000);
    } else {
      // Make sure success message is hidden if something is invalid
      formSuccess.classList.remove("show");
    }
  });

  // check the boxes again in real time as user types
  nameInput.addEventListener("input", validateName);
  emailInput.addEventListener("input", validateEmail);
  subjectInput.addEventListener("input", validateSubject);
  messageInput.addEventListener("input", validateMessage);
}

//validation functions
// rules for the name box
function validateName() {
  const value = nameInput.value.trim();

  if (value === "") {
    showError(nameInput, "nameError", "Please enter your name.");
    return false; //bad
  }

  if (value.length < 2) {
    showError(nameInput, "nameError", "Name must be at least 2 characters.");
    return false; // bad
  }

  clearError(nameInput, "nameError");
  return true; //good
}

//rules for the email box
function validateEmail() {
  const value = emailInput.value.trim();
  // Simple email pattern: something@something.something
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    showError(emailInput, "emailError", "Please enter your email.");
    return false;
  }

  if (!emailPattern.test(value)) {
    showError(emailInput, "emailError", "Please enter a valid email address.");
    return false;
  }

  clearError(emailInput, "emailError");
  return true;
}

//rules for the subject box
function validateSubject() {
  const value = subjectInput.value.trim();

  if (value === "") {
    showError(subjectInput, "subjectError", "Please enter a subject.");
    return false;
  }

  clearError(subjectInput, "subjectError");
  return true;
}

// rules for the message box
function validateMessage() {
  const value = messageInput.value.trim();

  if (value === "") {
    showError(messageInput, "messageError", "Please write a message.");
    return false;
  }

  if (value.length < 10) {
    showError(messageInput, "messageError", "Message should be at least 10 characters.");
    return false;
  }

  clearError(messageInput, "messageError");
  return true;
}

//helper function
// Shows an error message under a field and highlights it red
function showError(inputElement, errorId, message) {
  const errorSpan = document.getElementById(errorId);
  errorSpan.textContent = message;
  inputElement.closest(".form-group").classList.add("has-error");
}

// Clears the error message and removes the red highlight
function clearError(inputElement, errorId) {
  const errorSpan = document.getElementById(errorId);
  errorSpan.textContent = "";
  inputElement.closest(".form-group").classList.remove("has-error");
}