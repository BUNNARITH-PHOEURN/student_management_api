// auth.js — handles login/register UI, validation, and API calls
(function(){
  'use strict';

  // Helpers
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  const alerts = $('#alerts');

  function showAlert(type, message){
    alerts.innerHTML = '';
    const el = document.createElement('div');
    el.className = 'alert ' + (type === 'error' ? 'error' : 'success');
    el.textContent = message;
    alerts.appendChild(el);
    // auto dismiss
    setTimeout(()=>{ if(el.parentNode) el.parentNode.removeChild(el); }, 6000);
  }

  // Form elements
  const loginForm = $('#login-form');
  const registerForm = $('#register-form');
  const toRegister = $('#to-register');
  const toLogin = $('#to-login');

  // Toggle function with fade
  function showForm(form){
    [loginForm, registerForm].forEach(f => {
      if(f === form){
        f.classList.remove('hidden');
        f.style.opacity = '1';
      } else {
        f.classList.add('hidden');
      }
    });
  }

  // Toggle links
  toRegister.addEventListener('click', (e)=>{ e.preventDefault(); showForm(registerForm); });
  toLogin.addEventListener('click', (e)=>{ e.preventDefault(); showForm(loginForm); });

  // Password toggles
  function togglePassword(buttonId, inputId){
    const btn = $(buttonId); const inp = $(inputId);
    btn.addEventListener('click', ()=>{
      const type = inp.getAttribute('type') === 'password' ? 'text' : 'password';
      inp.setAttribute('type', type);
      btn.querySelector('i').classList.toggle('fa-eye-slash');
    });
  }
  togglePassword('#login-toggle','#login-password');
  togglePassword('#reg-toggle','#reg-password');

  // Simple inline validators
  function setError(input, message){
    const err = document.querySelector(`.error[data-for="${input.id}"]`);
    if(err) err.textContent = message || '';
  }

  function validateLogin(){
    let ok = true;
    const email = $('#login-email'); const pw = $('#login-password');
    setError(email,''); setError(pw,'');
    if(!email.value || !/\S+@\S+\.\S+/.test(email.value)){ setError(email,'Please enter a valid email'); ok=false; }
    if(!pw.value || pw.value.length < 6){ setError(pw,'Password must be at least 6 characters'); ok=false; }
    return ok;
  }

  function validateRegister(){
    let ok = true;
    const name = $('#reg-name'); const email = $('#reg-email'); const pw = $('#reg-password'); const conf = $('#reg-confirm');
    setError(name,''); setError(email,''); setError(pw,''); setError(conf,'');
    if(!name.value || name.value.trim().length < 2){ setError(name,'Enter your full name'); ok=false; }
    if(!email.value || !/\S+@\S+\.\S+/.test(email.value)){ setError(email,'Please enter a valid email'); ok=false; }
    if(!pw.value || pw.value.length < 6){ setError(pw,'Password must be at least 6 characters'); ok=false; }
    if(pw.value !== conf.value){ setError(conf,'Passwords do not match'); ok=false; }
    return ok;
  }

  // Submit handlers using fetch
  loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(!validateLogin()) return;

    const data = {
      email: $('#login-email').value.trim(),
      password: $('#login-password').value
    };

    try{
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      const body = await res.json();
      if(!res.ok){
        showAlert('error', body.message || body.error || 'Login failed');
        return;
      }
      // success
      if(body.token) localStorage.setItem('sms_token', body.token);
      showAlert('success', body.message || 'Login successful');
      // short delay then redirect to courses view
      setTimeout(()=>{ window.location.href = '/courses'; }, 800);
    }catch(err){
      showAlert('error','Network error — please try again');
      console.error(err);
    }
  });

  registerForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(!validateRegister()) return;

    const data = {
      student_name: $('#reg-name').value.trim(),
      email: $('#reg-email').value.trim(),
      password: $('#reg-password').value
    };

    try{
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      const body = await res.json();
      if(!res.ok){
        showAlert('error', body.message || body.error || 'Registration failed');
        return;
      }
      showAlert('success', body.message || 'Registered successfully');
      // auto switch to login
      setTimeout(()=>{ showForm(loginForm); $('#login-email').value = data.email; }, 900);
    }catch(err){
      showAlert('error','Network error — please try again');
      console.error(err);
    }
  });

  // Accessibility: allow toggles via keyboard
  $$('#to-register, #to-login').forEach(el=>el.addEventListener('keydown', (e)=>{ if(e.key==='Enter') e.target.click(); }));

  // Initialize
  showForm(loginForm);
})();
