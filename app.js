const state = {
  signupEmail: "",
  signupPassword: "",
  loginEmail: "",
  loginPassword: "",
  privacyChecked: false,
  currentScreen: "welcomeScreen"
};

const screens = ["welcomeScreen", "signupScreen", "loginScreen"];

function showScreen(screenId) {
  screens.forEach((id) => {
    document.getElementById(id).classList.toggle("active", id === screenId);
  });
  state.currentScreen = screenId;
}

function setInputState(input) {
  if (!input) return;
  const key = input.id;
  if (input.type === "checkbox") {
    state[key] = input.checked;
  } else {
    state[key] = input.value;
  }
}

function restoreState() {
  screens.forEach((screenId) => {
    const screen = document.getElementById(screenId);
    if (!screen) return;
    screen.querySelectorAll("input").forEach((input) => {
      if (input.id in state) {
        if (input.type === "checkbox") {
          input.checked = state[input.id];
        } else {
          input.value = state[input.id];
        }
      }
    });
  });
}

function clearErrors(formId) {
  const form = document.getElementById(formId);
  form.querySelectorAll(".input-error").forEach((error) => {
    error.textContent = "";
  });
}

function validateSignupForm() {
  clearErrors("signupScreen");
  let valid = true;
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const privacy = document.getElementById("privacyCheck").checked;
  const emailError = document.getElementById("signupEmailError");
  const passwordError = document.getElementById("signupPasswordError");
  const privacyError = document.getElementById("privacyError");

  if (!email) {
    emailError.textContent = "Please enter your email.";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.textContent = "Use a valid email address.";
    valid = false;
  }

  if (!password) {
    passwordError.textContent = "Enter a password.";
    valid = false;
  } else if (password.length < 8) {
    passwordError.textContent = "Password must be 8+ characters.";
    valid = false;
  }

  if (!privacy) {
    privacyError.textContent = "You must agree to the privacy policy.";
    valid = false;
  }

  return valid;
}

function validateLoginForm() {
  clearErrors("loginScreen");
  let valid = true;
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const emailError = document.getElementById("loginEmailError");
  const passwordError = document.getElementById("loginPasswordError");

  if (!email) {
    emailError.textContent = "Please enter your email.";
    valid = false;
  }

  if (!password) {
    passwordError.textContent = "Enter your password.";
    valid = false;
  }

  return valid;
}

function togglePassword(event) {
  const targetId = event.currentTarget.dataset.target;
  const input = document.getElementById(targetId);
  if (!input) return;
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  event.currentTarget.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
  event.currentTarget.textContent = isPassword ? "🙈" : "👁";
}

function bindEvents() {
  document.getElementById("goToSignup").addEventListener("click", () => showScreen("signupScreen"));
  document.getElementById("goToLogin").addEventListener("click", () => showScreen("loginScreen"));
  document.getElementById("signupToLogin").addEventListener("click", () => showScreen("loginScreen"));
  document.getElementById("loginToSignup").addEventListener("click", () => showScreen("signupScreen"));
  // back buttons on inner screens
  const backSignup = document.getElementById("backFromSignup");
  if (backSignup) backSignup.addEventListener("click", () => showScreen("welcomeScreen"));
  const backLogin = document.getElementById("backFromLogin");
  if (backLogin) backLogin.addEventListener("click", () => showScreen("welcomeScreen"));

  document.getElementById("signupSubmit").addEventListener("click", () => {
    if (validateSignupForm()) {
      const success = document.getElementById("signupSuccess");
      success.textContent = "Account created! Continue to login whenever you like.";
      success.style.color = "#3f3d56";
    }
  });

  document.getElementById("loginSubmit").addEventListener("click", () => {
    if (validateLoginForm()) {
      const success = document.getElementById("loginSuccess");
      success.textContent = "Logged in successfully. Welcome back!";
      success.style.color = "#3f3d56";
    }
  });

  document.querySelectorAll(".icon-toggle").forEach((button) => {
    button.addEventListener("click", togglePassword);
  });

  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => setInputState(input));
    input.addEventListener("change", () => setInputState(input));
  });
}

restoreState();
bindEvents();

window.addEventListener("beforeunload", () => {
  document.querySelectorAll("input").forEach((input) => setInputState(input));
});
