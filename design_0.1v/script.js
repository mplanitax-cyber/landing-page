const header = document.querySelector('.site-header');
const leadForm = document.querySelector('#leadForm');
const phoneInput = document.querySelector('input[name="phone"]');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 4);
});

if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;

    if (digits.length > 3 && digits.length <= 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length > 7) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }

    e.target.value = formatted;
  });
}

if (leadForm) {
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(leadForm);
    const phone = String(formData.get('phone') || '');
    const phonePattern = /^010-\d{4}-\d{4}$/;

    if (!phonePattern.test(phone)) {
      alert('연락처 형식을 확인해 주세요. 예: 010-0000-0000');
      return;
    }

    if (!formData.get('privacy') || !formData.get('thirdParty')) {
      alert('필수 동의 항목을 확인해 주세요.');
      return;
    }

    alert('상담 신청이 완료되었습니다. 담당 설계사가 24시간 내 연락드립니다.');
    leadForm.reset();
  });
}
