(function() {
  var form = document.getElementById('contact-form');
  var toast = document.getElementById('form-toast');
  var toastMsg = document.getElementById('form-toast-message');
  var closeBtn = toast && toast.querySelector('.form-toast-close');

  function showToast(message, isSuccess) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.className = 'form-toast form-toast-' + (isSuccess ? 'success' : 'error');
    toast.hidden = false;
    setTimeout(function() {
      toast.classList.add('form-toast-visible');
    }, 10);
    setTimeout(function() {
      toast.classList.remove('form-toast-visible');
      setTimeout(function() { toast.hidden = true; }, 300);
    }, 5000);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      toast.classList.remove('form-toast-visible');
      setTimeout(function() { toast.hidden = true; }, 300);
    });
  }

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('.contact-submit');
      var originalText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form)
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.success) {
          showToast('Thank you for reaching out. Your message has been sent successfully. I will get back to you shortly.', true);
          form.reset();
        } else {
          showToast('Something went wrong. Please try again or email me directly at tylerbouldin16@gmail.com.', false);
        }
      })
      .catch(function() {
        showToast('Your message could not be sent. Please check your connection and try again, or email me at tylerbouldin16@gmail.com.', false);
      })
      .finally(function() {
        if (btn) { btn.disabled = false; btn.textContent = originalText; }
      });
    });
  }
})();

(function() {
  var navToggle = document.querySelector('.nav-toggle');
  var navLinksWrap = document.querySelector('.nav-links');
  if (navToggle && navLinksWrap) {
    navToggle.addEventListener('click', function() {
      var open = navLinksWrap.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.nav-links a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinksWrap.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

(function() {
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = [];
  navLinks.forEach(function(link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) sections.push({ id: id, section: section, link: link });
  });

  function setActive(id) {
    navLinks.forEach(function(link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  function updateActive() {
    var top = 120;
    var current = sections[0];
    for (var i = 0; i < sections.length; i++) {
      var rect = sections[i].section.getBoundingClientRect();
      if (rect.top <= top) current = sections[i];
    }
    setActive(current.id);
  }

  var updateTimeout;
  function scheduleUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(updateActive, 50);
  }

  var observer = new IntersectionObserver(scheduleUpdate, { threshold: [0, 0.1, 0.5, 1] });

  sections.forEach(function(s) { observer.observe(s.section); });
  updateActive();

  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      setActive(link.getAttribute('href').slice(1));
    });
  });
})();
