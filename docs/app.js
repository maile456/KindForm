(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const icons = () => window.lucide?.createIcons();
  const menu = $('#mobile-nav'); const menuButton = $('#menu-toggle');
  function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded','false'); }
  menuButton.addEventListener('click',() => { const open = menu.hidden; menu.hidden = !open; menuButton.setAttribute('aria-expanded',String(open)); });
  document.querySelectorAll('#mobile-nav a').forEach(link => link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event => { if(event.key === 'Escape') closeMenu(); });
  let toastTimer;
  function toast(message) { $('#toast').textContent = message; $('#toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').hidden = true,3500); }
  $('#preview-toggle').addEventListener('click',() => { const active = $('#preview-toggle').getAttribute('aria-pressed') !== 'true'; $('#preview-toggle').setAttribute('aria-pressed',String(active)); $('.browser-window').classList.toggle('is-preview',active); $('#editable-title').contentEditable = active ? 'false' : 'plaintext-only'; $('#preview-toggle span').textContent = active ? 'Edit' : 'Preview'; $('#preview-toggle i, #preview-toggle svg').setAttribute('data-lucide',active ? 'square-pen' : 'play'); icons(); });
  $('#editable-title').addEventListener('input',() => { $('#document-status').textContent = 'Unsaved local draft'; });
  $('#publish-button').addEventListener('click',() => { $('#document-status').textContent = 'Local draft ready'; toast('Your draft is ready. This sample does not publish to the internet.'); });
  $('#demo-submit').addEventListener('click',() => { const name = $('#demo-name').value.trim(); if(!name) { $('#demo-feedback').textContent = 'Please add your name first.'; $('#demo-name').setAttribute('aria-invalid','true'); $('#demo-name').focus(); return; } $('#demo-name').removeAttribute('aria-invalid'); $('#demo-feedback').textContent = ''; $('#editor-view').hidden = true; $('#success-view').hidden = false; $('#success-message').textContent = 'Thanks, '+name+'. Your idea has a little more room to grow. This answer stays in this page.'; });
  $('#reset-form').addEventListener('click',() => { $('#success-view').hidden = true; $('#editor-view').hidden = false; $('#demo-name').value = ''; $('#demo-feedback').textContent = ''; $('#demo-name').focus(); });
  document.querySelectorAll('[data-template]').forEach(button => button.addEventListener('click',() => { $('#success-view').hidden = true; $('#editor-view').hidden = false; $('#demo-name').value = ''; $('#demo-feedback').textContent = ''; $('#editable-title').textContent = button.dataset.template === 'feedback' ? 'Your thoughts make the next thing better.' : "Let's make something good together."; $('#document-status').textContent = 'Template loaded'; $('.browser-window').scrollIntoView({behavior:'smooth',block:'center'}); }));
  icons();
})();
