const forms = document.querySelectorAll('.js-lead-form, #leadForm');
const phoneInputs = document.querySelectorAll('input[name="phone"]');
const faqItems = document.querySelectorAll('.faq-item');

if (phoneInputs.length > 0) {
  phoneInputs.forEach((phoneInput) => {
    phoneInput.addEventListener('input', (event) => {
      const raw = event.target.value.replace(/\D/g, '').slice(0, 11);
      let formatted = raw;

      if (raw.length > 3 && raw.length <= 7) {
        formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
      } else if (raw.length > 7) {
        formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
      }

      event.target.value = formatted;
    });
  });
}

if (faqItems.length > 0) {
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;

      faqItems.forEach((other) => {
        if (other !== item) {
          other.open = false;
        }
      });
    });
  });
}

if (forms.length > 0) {
  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const phone = String(formData.get('phone') || '');
      const phonePattern = /^010-\d{4}-\d{4}$/;

      if (!phonePattern.test(phone)) {
        alert('연락처 형식을 확인해 주세요. 예: 010-0000-0000');
        return;
      }

      if (!formData.get('privacy') || !formData.get('thirdParty')) {
        alert('필수 동의 항목을 체크해 주세요.');
        return;
      }

      alert('상담 신청이 완료되었습니다. 담당 설계사가 24시간 내 연락드립니다.');
      form.reset();
    });
  });
}
