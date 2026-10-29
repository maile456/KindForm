(function () {
  'use strict';

  const workshops = {
    notebook: { title: '装订一本自己的手账', price: 168, sessions: [{ id: 'notebook-am', date: '11 月 7 日 · 周六', time: '10:00 - 12:00' }, { id: 'notebook-pm', date: '11 月 7 日 · 周六', time: '14:00 - 16:00' }, { id: 'notebook-sun', date: '11 月 8 日 · 周日', time: '14:00 - 16:00' }] },
    clay: { title: '捏一只不一样的杯子', price: 228, sessions: [{ id: 'clay-am', date: '11 月 7 日 · 周六', time: '10:30 - 12:30' }, { id: 'clay-sun', date: '11 月 8 日 · 周日', time: '14:00 - 16:00' }] },
    print: { title: '把灵感印在帆布袋上', price: 188, sessions: [{ id: 'print-pm', date: '11 月 7 日 · 周六', time: '14:00 - 16:00' }, { id: 'print-sun', date: '11 月 8 日 · 周日', time: '10:00 - 12:00' }] }
  };
  const form = document.getElementById('registration-form');
  const sessionSelect = document.getElementById('session');
  const attendeesSelect = document.getElementById('attendees');
  const errorSummary = document.getElementById('error-summary');
  const nextButton = document.getElementById('next-button');
  const backButton = document.getElementById('back-button');
  const status = document.getElementById('submit-status');
  let currentStep = 1;
  let furthestStep = 1;
  let submitting = false;
  let completedRecord = null;
  const sessionMemory = {};

  function text(id, value) { document.getElementById(id).textContent = value; }
  function selectedWorkshop() { return form.elements.workshop.value; }
  function selectedSession() { return workshops[selectedWorkshop()].sessions.find(function (item) { return item.id === sessionSelect.value; }); }

  function updateSessions() {
    const key = selectedWorkshop();
    const remembered = sessionMemory[key];
    sessionSelect.replaceChildren();
    workshops[key].sessions.forEach(function (item) {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.date + ' ' + item.time;
      option.selected = item.id === remembered;
      sessionSelect.appendChild(option);
    });
    sessionMemory[key] = sessionSelect.value;
    updateSummary();
  }

  function updateSummary() {
    const workshop = workshops[selectedWorkshop()];
    const session = selectedSession();
    const people = Number(attendeesSelect.value);
    text('summary-workshop', workshop.title);
    text('summary-date', session ? session.date : '请选择时段');
    text('summary-time', session ? session.time + ' · 2 小时' : '待选择');
    text('summary-people', people + ' 位参加者');
    text('summary-unit', '¥' + workshop.price + ' × ' + people);
    text('summary-total', '¥' + workshop.price * people);
    if (currentStep === 3) updateReview();
  }

  function updateReview() {
    const workshop = workshops[selectedWorkshop()];
    const session = selectedSession();
    text('review-workshop', workshop.title);
    text('review-session', session ? session.date + ' ' + session.time : '待选择');
    text('review-attendees', attendeesSelect.value + ' 人');
    text('review-name', form.elements.fullName.value.trim());
    text('review-email', form.elements.email.value.trim());
    ['phone', 'notes'].forEach(function (name) {
      const value = form.elements[name].value.trim();
      text('review-' + name, value);
      document.getElementById('review-' + name + '-row').hidden = !value;
    });
  }

  function clearErrors() {
    errorSummary.hidden = true;
    errorSummary.textContent = '';
    form.querySelectorAll('[aria-invalid]').forEach(function (field) { field.removeAttribute('aria-invalid'); });
    form.querySelectorAll('.field-error').forEach(function (element) { element.hidden = true; element.textContent = ''; });
  }

  function fieldError(id, message) {
    const field = document.getElementById(id);
    const error = document.getElementById(id + '-error');
    field.setAttribute('aria-invalid', 'true');
    error.textContent = message;
    error.hidden = false;
  }

  function validateStep(step) {
    clearErrors();
    const errors = [];
    function add(id, message) { fieldError(id, message); errors.push(message); }
    if (step === 1) {
      if (!selectedSession()) add('session', '请选择一个可用的活动时段。');
      if (!['1', '2', '3', '4'].includes(attendeesSelect.value)) add('attendees', '请选择 1 至 4 位参加者。');
    }
    if (step === 2) {
      const name = form.elements.fullName.value.trim();
      const email = form.elements.email.value.trim();
      const phone = form.elements.phone.value.trim();
      if (!name) add('full-name', '请填写你的称呼。');
      else if (name.length > 40) add('full-name', '称呼请保持在 40 个字符以内。');
      if (!email) add('email', '请填写邮箱。');
      else if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) add('email', '请填写有效的邮箱，例如 name@example.com。');
      if (phone && !/^1[3-9]\d{9}$/.test(phone)) add('phone', '请填写 11 位中国大陆手机号，或留空。');
    }
    if (step === 3 && !form.elements.confirmation.checked) add('confirmation', '请先确认活动、人数和联系方式。');
    if (errors.length) {
      errorSummary.textContent = '还有 ' + errors.length + ' 项需要确认，请检查下方标记的内容。';
      errorSummary.hidden = false;
      errorSummary.focus();
      return false;
    }
    return true;
  }

  function showStep(step, focusHeading) {
    if (submitting) return;
    currentStep = step;
    furthestStep = Math.max(furthestStep, step);
    clearErrors();
    status.textContent = '';
    form.querySelectorAll('[data-step]').forEach(function (panel) { panel.hidden = Number(panel.dataset.step) !== step; });
    document.querySelectorAll('[data-step-link]').forEach(function (button) {
      const number = Number(button.dataset.stepLink);
      button.disabled = number > furthestStep;
      button.classList.toggle('is-complete', number < step);
      if (number === step) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    backButton.hidden = step === 1;
    text('step-fraction', step + ' / 3');
    text('next-label', step === 3 ? '生成演示报名' : '下一步');
    if (step === 3) updateReview();
    if (focusHeading) document.querySelector('[data-step="' + step + '"] h2').focus();
  }

  function validateThrough(lastStep) {
    for (let step = 1; step <= lastStep; step += 1) {
      if (!validateStep(step)) {
        if (step !== currentStep) {
          showStep(step, false);
          validateStep(step);
        }
        return false;
      }
    }
    return true;
  }

  function setSubmitting(value) {
    submitting = value;
    nextButton.disabled = value;
    backButton.disabled = value;
    document.querySelectorAll('[data-step-link], [data-edit-step]').forEach(function (button) { button.disabled = value || (button.dataset.stepLink && Number(button.dataset.stepLink) > furthestStep); });
    form.elements.confirmation.disabled = value;
    document.getElementById('submit-spinner').hidden = !value;
    document.getElementById('next-icon').hidden = value;
    form.setAttribute('aria-busy', String(value));
    text('next-label', value ? '正在生成' : '生成演示报名');
  }

  function createRecord() {
    const workshop = workshops[selectedWorkshop()];
    const session = selectedSession();
    return {
      status: 'local-demo-not-sent',
      notice: '演示报名已生成，未发送。未付款。活动、场地与价格均为演示内容。',
      id: 'KF-' + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      workshop: { id: selectedWorkshop(), title: workshop.title, date: session.date, time: session.time, location: '上海 · 静安手作空间（演示场地）', attendees: Number(attendeesSelect.value), unitPriceCNY: workshop.price, totalCNY: workshop.price * Number(attendeesSelect.value), paid: false },
      participant: { name: form.elements.fullName.value.trim(), email: form.elements.email.value.trim(), phone: form.elements.phone.value.trim(), notes: form.elements.notes.value.trim() }
    };
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (submitting || !validateThrough(currentStep)) return;
    if (currentStep < 3) { showStep(currentStep + 1, true); return; }
    const shouldFail = document.getElementById('simulate-failure').checked;
    setSubmitting(true);
    status.textContent = '正在生成本地记录…';
    window.setTimeout(function () {
      setSubmitting(false);
      if (shouldFail) {
        errorSummary.textContent = '演示提交失败。填写内容已保留；关闭“测试提交失败”后即可重试。';
        errorSummary.hidden = false;
        errorSummary.focus();
        status.textContent = '未生成记录，未发送报名。';
        text('next-label', '重试生成');
        return;
      }
      completedRecord = createRecord();
      form.hidden = true;
      document.querySelector('.step-nav').hidden = true;
      document.getElementById('success-panel').hidden = false;
      text('success-copy', completedRecord.participant.name + '，你的小计划是「' + completedRecord.workshop.title + '」，共 ' + completedRecord.workshop.attendees + ' 人。期待给周末添一点新的灵感。');
      text('receipt-number', completedRecord.id);
      document.getElementById('success-title').focus();
    }, 700);
  });

  backButton.addEventListener('click', function () { if (currentStep > 1) showStep(currentStep - 1, true); });
  document.querySelectorAll('[data-step-link], [data-edit-step]').forEach(function (button) {
    button.addEventListener('click', function () {
      const target = Number(button.dataset.stepLink || button.dataset.editStep);
      if (target > currentStep && !validateThrough(target - 1)) return;
      showStep(target, true);
    });
  });
  form.querySelectorAll('input[name="workshop"]').forEach(function (radio) { radio.addEventListener('change', updateSessions); });
  sessionSelect.addEventListener('change', function () { sessionMemory[selectedWorkshop()] = sessionSelect.value; updateSummary(); });
  attendeesSelect.addEventListener('change', updateSummary);
  form.elements.notes.addEventListener('input', function () { text('notes-count', form.elements.notes.value.length + ' / 300'); });
  form.addEventListener('input', function (event) {
    if (event.target.hasAttribute('aria-invalid')) {
      event.target.removeAttribute('aria-invalid');
      const error = document.getElementById(event.target.id + '-error');
      if (error) { error.hidden = true; error.textContent = ''; }
    }
  });

  document.getElementById('download-button').addEventListener('click', function () {
    if (!completedRecord) return;
    const blob = new Blob([JSON.stringify(completedRecord, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = completedRecord.id + '.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    text('download-status', '已发起下载。文件包含个人信息，请妥善保管。');
  });

  document.getElementById('restart-button').addEventListener('click', function () {
    form.reset();
    Object.keys(sessionMemory).forEach(function (key) { delete sessionMemory[key]; });
    document.getElementById('simulate-failure').checked = false;
    completedRecord = null;
    furthestStep = 1;
    form.hidden = false;
    document.querySelector('.step-nav').hidden = false;
    document.getElementById('success-panel').hidden = true;
    text('notes-count', '0 / 300');
    text('download-status', '');
    updateSessions();
    showStep(1, true);
  });

  updateSessions();
  showStep(1, false);
  if (window.lucide) window.lucide.createIcons();
}());
