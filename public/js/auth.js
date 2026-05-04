document.addEventListener('DOMContentLoaded', () => {
  const translations = {
    en: {
      appTitle: 'INP Inventory',
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      loginBtn: 'Login',
      registerBtn: 'Create Account',
      backToStore: 'Back to Store'
    },
    es: {
      appTitle: 'Inventario INP',
      login: 'Iniciar Sesión',
      register: 'Registro',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      username: 'Nombre de Usuario',
      loginBtn: 'Entrar',
      registerBtn: 'Crear Cuenta',
      backToStore: 'Volver a la Tienda'
    }
  };

  let currentLang = localStorage.getItem('inp_lang') || 'en';
  
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const msgBox = document.getElementById('msg-box');

  const btnEn = document.getElementById('lang-en');
  const btnEs = document.getElementById('lang-es');

  setLanguage(currentLang);

  btnEn.addEventListener('click', () => setLanguage('en'));
  btnEs.addEventListener('click', () => setLanguage('es'));

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    hideMsg();
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    hideMsg();
  });

  function showMsg(msg, isError = false) {
    msgBox.textContent = msg;
    msgBox.className = isError ? 'error-msg' : 'success-msg';
  }

  function hideMsg() {
    msgBox.className = 'hidden';
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMsg();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const result = DB.login(email, password);
      
      if (!result.success) throw new Error(result.error);
      
      localStorage.setItem('inp_token', result.token);
      localStorage.setItem('inp_user', JSON.stringify(result.user));
      
      if (result.user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    } catch (err) {
      showMsg(err.message, true);
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMsg();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
      const result = DB.register({ username, email, password });
      
      if (!result.success) throw new Error(result.error);
      
      localStorage.setItem('inp_token', result.token);
      localStorage.setItem('inp_user', JSON.stringify(result.user));
      
      window.location.href = 'index.html';
    } catch (err) {
      showMsg(err.message, true);
    }
  });

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('inp_lang', lang);

    if (lang === 'en') {
      btnEn.classList.add('active');
      btnEs.classList.remove('active');
    } else {
      btnEs.classList.add('active');
      btnEn.classList.remove('active');
    }

    const t = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });

    // Specific elements for auth
    tabLogin.textContent = t.login;
    tabRegister.textContent = t.register;
    
    // Login form
    loginForm.querySelector('label:nth-of-type(1)').textContent = t.email;
    loginForm.querySelector('label:nth-of-type(2)').textContent = t.password;
    loginForm.querySelector('button').textContent = t.loginBtn;
    
    // Register form
    registerForm.querySelector('label:nth-of-type(1)').textContent = t.username;
    registerForm.querySelector('label:nth-of-type(2)').textContent = t.email;
    registerForm.querySelector('label:nth-of-type(3)').textContent = t.password;
    registerForm.querySelector('button').textContent = t.registerBtn;
    
    const backBtn = document.querySelector('header a');
    if (backBtn) backBtn.innerHTML = `<i class="fa-solid fa-store"></i> ${t.backToStore}`;
  }
});
