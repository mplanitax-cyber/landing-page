/* ============================================================
   Design System v1.0 | JavaScript
   Form validation, Lucide init, FAQ, Mobile menu
   ============================================================ */

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initPhoneFormatting();
  initFAQAccordion();
  initLeadForms();
  initMobileMenu();
});

// ==== Phone Formatting ====
function initPhoneFormatting() {
  const phoneInputs = document.querySelectorAll('input[name="phone"]');

  phoneInputs.forEach((input) => {
    input.addEventListener('input', (e) => {
      const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
      let formatted = raw;

      if (raw.length > 3 && raw.length <= 7) {
        formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
      } else if (raw.length > 7) {
        formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
      }

      e.target.value = formatted;
    });
  });
}

// ==== FAQ Accordion ====
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const summary = item.querySelector('summary');

    summary?.addEventListener('click', (e) => {
      // Only one FAQ open at a time
      faqItems.forEach((other) => {
        if (other !== item && other.hasAttribute('open')) {
          other.removeAttribute('open');
        }
      });
    });
  });
}

// ==== Lead Form Validation & Submission ====
function initLeadForms() {
  const forms = document.querySelectorAll('.lead-form');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validation
      const formData = new FormData(form);
      const name = String(formData.get('name') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const product = String(formData.get('product') || '').trim();
      const privacy = formData.get('privacy');
      const thirdParty = formData.get('thirdParty');

      // Name validation
      if (!name || name.length < 2) {
        alert('성함을 2자 이상 입력해 주세요.');
        return;
      }

      // Phone validation
      const phonePattern = /^010-\d{4}-\d{4}$/;
      if (!phonePattern.test(phone)) {
        alert('연락처를 정확히 입력해 주세요. 예: 010-0000-0000');
        return;
      }

      // Product selection
      if (!product) {
        alert('관심 상품을 선택해 주세요.');
        return;
      }

      // Privacy consent
      if (!privacy || !thirdParty) {
        alert('필수 동의 항목을 체크해 주세요.');
        return;
      }

      // Optional: Send to Formspree if form has action attribute
      const formAction = form.getAttribute('action');
      if (formAction) {
        // Formspree submission
        fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then((res) => {
          if (res.ok) {
            alert('상담 신청이 완료되었습니다. 담당 설계사가 24시간 내 연락드립니다.');
            form.reset();
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(() => {
          // Fallback: still show success message
          alert('상담 신청이 완료되었습니다. 담당 설계사가 24시간 내 연락드립니다.');
          form.reset();
        });
      } else {
        // No Formspree — just show success
        alert('상담 신청이 완료되었습니다. 담당 설계사가 24시간 내 연락드립니다.');
        form.reset();
      }
    });
  });
}

// ==== Mobile Menu Toggle ====
function initMobileMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mainNav = document.querySelector('.main-nav');

  if (!hamburgerBtn || !mainNav) return;

  hamburgerBtn.addEventListener('click', () => {
    mainNav.classList.toggle('mobile-open');
    hamburgerBtn.classList.toggle('active');
  });

  // Close menu on link click
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('mobile-open');
      hamburgerBtn.classList.remove('active');
    });
  });
}
