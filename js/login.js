// myPage/js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const $ = (s) => document.querySelector(s);
  const form = $("#loginForm");
  const email = $("#email");
  const password = $("#password");
  const loginMsg = $("#loginMsg");

  function loadUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    loginMsg.textContent = "";

    const users = loadUsers();
    const found = users.find(
      (u) => u.email === email.value.trim() && u.password === password.value
    );

    if (!found) {
      loginMsg.textContent = "이메일 또는 비밀번호가 올바르지 않습니다.";
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        email: found.email,
        name: found.name,
        nickname: found.nickname,
        phone: found.phone,
      })
    );

    alert(`${found.nickname || found.name}님 환영합니다!`);
    location.href = "./main.html";
  });
});
