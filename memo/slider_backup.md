# 슬라이더 원본 코드 백업
> 무한 루프 적용 전 원본. 되돌리려면 아래 코드로 교체.

---

## js/main.js — Works slider 부분

```javascript
$(function () {
  /* ── Scroll spy ── */
  const sections = ['#home', '#profile', '#works', '#contact'];
  const headerHeight = $('#header').outerHeight();

  function updateActiveNav() {
    const scrollTop = $(window).scrollTop() + headerHeight + 1;
    let current = sections[0];
    sections.forEach(function (id) {
      const $section = $(id);
      if ($section.length && $section.offset().top <= scrollTop) current = id;
    });
    $('.header-nav a').removeClass('active');
    $('.header-nav a[href="' + current + '"]').addClass('active');
  }

  $(window).on('scroll', updateActiveNav);
  updateActiveNav();

  /* ── Works slider ── */
  let worksIndex = 0;
  const VISIBLE = 3;

  function getSlideAmount() {
    return $('.work-card').outerWidth(true) + 20;
  }

  function updateWorksSlider() {
    const offset = worksIndex * ($('.work-card').outerWidth() + 20);
    $('.works-slider').css('transform', 'translateX(-' + offset + 'px)');
    const total = $('.work-card').length;
    $('.works-btn--prev').toggleClass('hidden', worksIndex <= 0);
    $('.works-btn--next').toggleClass('hidden', worksIndex >= total - VISIBLE);
    const totalPages = total - VISIBLE + 1;
    const progress = ((worksIndex + 1) / totalPages) * 100;
    $('.works-progress-fill').css('width', progress + '%');
    $('.works-progress-current').text(String(worksIndex + 1).padStart(2, '0'));
  }

  $('.works-btn--next').on('click', function () {
    worksIndex++;
    updateWorksSlider();
  });

  $('.works-btn--prev').on('click', function () {
    worksIndex--;
    updateWorksSlider();
  });

  updateWorksSlider();
});
```

## css/style.css — 버튼 숨김 관련

```css
.works-btn.hidden { display: none; }
```
