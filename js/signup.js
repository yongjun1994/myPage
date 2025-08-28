// myPage/js/signup.js
document.addEventListener("DOMContentLoaded", () => {
  const $ = (s) => document.querySelector(s);

  // Fields
  const form = $("#signupForm");
  const email = $("#email");
  const password = $("#password");
  const confirmPassword = $("#confirmPassword");
  const name = $("#name");
  const nickname = $("#nickname");
  const phone = $("#phone");
  const postcode = $("#postcode");
  const roadAddress = $("#roadAddress");
  const detailAddress = $("#detailAddress");

  // Hints / Msg
  const msgEmail = $("#msg-email");
  const msgPw = $("#msg-password");
  const msgPw2 = $("#msg-confirmPassword");
  const msgName = $("#msg-name");
  const msgNick = $("#msg-nickname");
  const msgPhone = $("#msg-phone");
  const msgAgree = $("#msg-agree");
  const signupMsg = $("#signupMsg");

  // Password show/hide
  $("#togglePw1").addEventListener("click", () =>
    togglePassword(password, "#togglePw1")
  );
  $("#togglePw2").addEventListener("click", () =>
    togglePassword(confirmPassword, "#togglePw2")
  );

  function togglePassword(input, btnSel) {
    const btn = document.querySelector(btnSel);
    const isPw = input.type === "password";
    input.type = isPw ? "text" : "password";
    btn.textContent = isPw ? "숨기기" : "보기";
  }

  // Phone: auto hyphen
  phone.addEventListener("input", () => {
    const onlyNum = phone.value.replace(/\D/g, "");
    phone.value = formatPhone(onlyNum);
    validatePhone();
  });

  function formatPhone(v) {
    // 02, 050, 010 등 다양성 고려 간단 포맷팅
    if (v.startsWith("02")) {
      if (v.length <= 2) return v;
      if (v.length <= 5) return `${v.slice(0, 2)}-${v.slice(2)}`;
      if (v.length <= 9)
        return `${v.slice(0, 2)}-${v.slice(2, 5)}-${v.slice(5)}`;
      return `${v.slice(0, 2)}-${v.slice(2, 6)}-${v.slice(6, 10)}`;
    } else {
      if (v.length <= 3) return v;
      if (v.length <= 7) return `${v.slice(0, 3)}-${v.slice(3)}`;
      if (v.length <= 11)
        return `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7)}`;
      return `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7, 11)}`;
    }
  }

  // Kakao Postcode
  $("#btnPostcode").addEventListener("click", () => {
    // eslint-disable-next-line no-undef
    new daum.Postcode({
      oncomplete: (data) => {
        postcode.value = data.zonecode || "";
        roadAddress.value = data.roadAddress || data.jibunAddress || "";
        detailAddress.focus();
      },
    }).open();
  });

  // Agreements
  const agreeAll = $("#agreeAll");
  const agreeItems = document.querySelectorAll(".agree-item");

  agreeAll.addEventListener("change", () => {
    agreeItems.forEach((i) => (i.checked = agreeAll.checked));
    validateAgreements();
  });

  agreeItems.forEach((i) =>
    i.addEventListener("change", () => {
      const allChecked = [...agreeItems].every((x) => x.checked);
      agreeAll.checked = allChecked;
      validateAgreements();
    })
  );

  // Validation rules
  const rules = {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    password: (v) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v),
    confirmPassword: (v) => v === password.value && v.length > 0,
    name: (v) => v.trim().length >= 2,
    nickname: (v) => v.trim().length >= 2,
    phone: (v) => /^\d{2,3}-\d{3,4}-\d{4}$/.test(v),
  };

  // Live validations
  email.addEventListener("input", validateEmail);
  password.addEventListener("input", validatePassword);
  confirmPassword.addEventListener("input", validateConfirm);
  name.addEventListener("input", validateName);
  nickname.addEventListener("input", validateNickname);

  function setHint(el, ok, msgOk = "좋아요", msgBad = "") {
    el.textContent = ok ? msgOk : msgBad;
    el.classList.toggle("ok", ok);
    el.classList.toggle("err", !ok);
  }

  function validateEmail() {
    const ok = rules.email(email.value.trim());
    setHint(
      msgEmail,
      ok,
      "사용 가능한 이메일 형식입니다.",
      "이메일 형식이 올바르지 않습니다."
    );
    return ok;
  }
  function validatePassword() {
    const ok = rules.password(password.value);
    setHint(msgPw, ok, "안전한 비밀번호예요.", "문자+숫자 포함 8자 이상");
    if (confirmPassword.value) validateConfirm();
    return ok;
  }
  function validateConfirm() {
    const ok = rules.confirmPassword(confirmPassword.value);
    setHint(
      msgPw2,
      ok,
      "비밀번호가 일치합니다.",
      "비밀번호가 일치하지 않습니다."
    );
    return ok;
  }
  function validateName() {
    const ok = rules.name(name.value);
    setHint(msgName, ok, "좋아요", "이름은 2자 이상");
    return ok;
  }
  function validateNickname() {
    const ok = rules.nickname(nickname.value);
    setHint(msgNick, ok, "좋아요", "닉네임은 2자 이상");
    return ok;
  }
  function validatePhone() {
    const ok = rules.phone(phone.value);
    setHint(msgPhone, ok, "좋아요", "휴대폰 번호 형식이 올바르지 않습니다.");
    return ok;
  }
  function validateAgreements() {
    const requiredOk = [...agreeItems]
      .filter((i) => i.dataset.required === "true")
      .every((i) => i.checked);
    setHint(msgAgree, requiredOk, "", "(필수) 항목에 동의해 주세요.");
    return requiredOk;
  }

  function validateAll() {
    return (
      validateEmail() &&
      validatePassword() &&
      validateConfirm() &&
      validateName() &&
      validateNickname() &&
      validatePhone() &&
      validateAgreements()
    );
  }

  function loadUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
  }
  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    signupMsg.textContent = "";

    if (!validateAll()) {
      signupMsg.textContent = "필수 항목을 올바르게 입력/동의해 주세요.";
      return;
    }

    const users = loadUsers();
    const dupEmail = users.some((u) => u.email === email.value.trim());
    const dupNickname = users.some((u) => u.nickname === nickname.value.trim());

    if (dupEmail) {
      signupMsg.textContent = "이미 등록된 이메일입니다.";
      return;
    }
    if (dupNickname) {
      signupMsg.textContent = "이미 사용 중인 닉네임입니다.";
      return;
    }

    const user = {
      email: email.value.trim(),
      password: password.value, // 데모: 평문 저장 (실서비스는 해시 필요)
      name: name.value.trim(),
      nickname: nickname.value.trim(),
      phone: phone.value.trim(),
      address: {
        postcode: postcode.value.trim(),
        roadAddress: roadAddress.value.trim(),
        detailAddress: detailAddress.value.trim(),
      },
      agree: {
        tos: $("#agreeTos").checked,
        privacy: $("#agreePrivacy").checked,
        marketing: $("#agreeMarketing").checked,
      },
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    saveUsers(users);

    alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
    location.href = "./login.html";
  });
});
