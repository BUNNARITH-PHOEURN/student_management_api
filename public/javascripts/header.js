// header.js — show/hide auth buttons and wire logout/new-course actions
(function(){
  'use strict';
  function qs(id){ return document.getElementById(id); }

  const btnLogout = qs('btn-logout');
  const btnLogin = qs('btn-login');
  const btnNew = qs('btn-new-course');

  // Highlight the section that owns the current page, including add/edit/detail pages.
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-nav .nav-link[data-path]').forEach(link => {
    const sectionPath = link.dataset.path;
    const isCurrentSection = currentPath === sectionPath || currentPath.startsWith(sectionPath + '/');
    link.classList.toggle('active', isCurrentSection);
    if (isCurrentSection) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  // This script is only loaded on protected pages, which the server has already authenticated.
  if(btnLogout) btnLogout.style.display = 'inline-flex';
  if(btnLogin) btnLogin.style.display = 'none';
  if(btnNew) btnNew.style.display = 'inline-flex';

  if(btnLogout){
    btnLogout.addEventListener('click', function(){
      fetch('/auth/logout', { method: 'POST' })
        .finally(function(){ window.location.href = '/login'; });
    });
  }

})();
