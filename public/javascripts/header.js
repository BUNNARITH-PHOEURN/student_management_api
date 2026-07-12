// header.js — show/hide auth buttons and wire logout/new-course actions
(function(){
  'use strict';
  function qs(id){ return document.getElementById(id); }

  const btnLogout = qs('btn-logout');
  const btnLogin = qs('btn-login');
  const btnNew = qs('btn-new-course');

  // Determine auth state by token presence (client-side check)
  const token = (function(){ try{ return localStorage.getItem('sms_token') || localStorage.getItem('token') || localStorage.getItem('auth_token'); }catch(e){ return null; } })();

  if(token){
    if(btnLogout) btnLogout.style.display = 'inline-block';
    if(btnLogin) btnLogin.style.display = 'none';
    if(btnNew) btnNew.style.display = 'inline-block';
  } else {
    if(btnLogout) btnLogout.style.display = 'none';
    if(btnLogin) btnLogin.style.display = 'inline-block';
    if(btnNew) btnNew.style.display = 'none';
  }

  if(btnLogout){
    btnLogout.addEventListener('click', function(){
      try{ localStorage.removeItem('sms_token'); localStorage.removeItem('token'); localStorage.removeItem('auth_token'); }catch(e){}
      window.location.href = '/login';
    });
  }

})();
