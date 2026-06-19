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
    $('.header-nav a, .mobile-nav-item').removeClass('active');
    $('.header-nav a[href="' + current + '"], .mobile-nav-item[href="' + current + '"]').addClass('active');
  }

  $(window).on('scroll', updateActiveNav);
  updateActiveNav();

  /* ── Works slider ── */
  let worksIndex = 0;

  function getGap() {
    return parseFloat(window.getComputedStyle($('.works-slider')[0]).columnGap) || 0;
  }

  function getMaxOffset() {
    const cardW = $('.work-card').outerWidth();
    const gap   = getGap();
    const total = $('.work-card').length;
    const wrapW = $('.works-slider-wrap').outerWidth();
    return Math.max(0, total * (cardW + gap) - gap - wrapW);
  }

  function updateWorksSlider() {
    const cardW     = $('.work-card').outerWidth();
    const gap       = getGap();
    const stepSize  = cardW + gap;
    const maxOffset = getMaxOffset();
    const total     = $('.work-card').length;
    const maxSteps  = maxOffset > 0 ? Math.ceil(maxOffset / stepSize) : 0; /* ★ 위치 이동 */

    worksIndex = Math.min(worksIndex, maxSteps); /* ★ 추가: 최대 스텝 초과 방지 */

    const offset = Math.min(worksIndex * stepSize, maxOffset);

    $('.works-slider').css('transform', 'translateX(-' + offset + 'px)');

    $('.works-btn--prev').toggleClass('hidden', worksIndex <= 0);
    $('.works-btn--next').toggleClass('hidden', offset >= maxOffset);

    const progress = maxSteps > 0 ? Math.min((worksIndex / maxSteps) * 100, 100) : 100;
    $('.works-progress-fill').css('width', progress + '%');
    $('.works-progress-current').text(String(Math.min(worksIndex + 1, total)).padStart(2, '0'));
    $('.works-progress-total').text(String(total).padStart(2, '0')); /* ★ 수정: 카드 총 개수 표시 */
  }

  $('.works-btn--next').on('click', function () {
    worksIndex++;
    updateWorksSlider();
  });

  $('.works-btn--prev').on('click', function () {
    if (worksIndex > 0) worksIndex--;
    updateWorksSlider();
  });

  updateWorksSlider();

  /* ── Works slider: 터치 스와이프 ── */
  let touchStartX = 0;
  $('.works-slider-wrap').on('touchstart', function (e) {
    touchStartX = e.originalEvent.changedTouches[0].clientX;
  });
  $('.works-slider-wrap').on('touchend', function (e) {
    const diff = touchStartX - e.originalEvent.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) { worksIndex++; }
      else if (worksIndex > 0) { worksIndex--; }
      updateWorksSlider();
    }
  });

  /* ── 윈도우 리사이즈 대응 ── */ /* ★ 추가 */
  $(window).on('resize', function () {
    updateWorksSlider();
  });

  /* ── Work card popup ── */
  $(document).on('click', '.work-card-popup a', function (e) {
    e.preventDefault();
    const $card = $(this).closest('.work-card');
    const $popup = $('#workpopup');

    // 카드 기존 텍스트에서 데이터 읽기
    $popup.find('.popup-num').text($card.find('.work-num').text());
    $popup.find('.popup-name').text($card.find('.work-name').text());
    $popup.find('.popup-type').text($card.find('.work-type').text());

    const skills = ($card.find('.work-skills').text() || '').split('|').map(function (s) { return s.trim(); }).filter(Boolean);
    $popup.find('.popup-skills').html(skills.map(function (s) { return '<span>' + s + '</span>'; }).join(''));

    // data 속성 (설명 / 기간 / 이미지 / 링크)
    $popup.find('.popup-desc').html($card.data('desc') || '');
    $popup.find('.popup-days').text($card.data('days') || '');
    const popupImg1 = $card.data('img1');
    $popup.find('.popup-img-wrap .popup-img1').attr('src', popupImg1 || '').toggle(!!popupImg1);
    const popupImg2 = $card.data('img2');
    $popup.find('.popup-img-wrap .popup-img2').attr('src', popupImg2 || '').toggle(!!popupImg2);
    const link = $card.data('link') || '#';
    $popup.find('.popup-link').attr('href', link).toggle(link !== '#');

    $popup.addClass('show');
    $('body').addClass('popup-open');

    $popup.find('.popup-container').scrollTop(0);
  });

  // 닫기: X 버튼
  $('#workpopup .popup-close').on('click', function () {
    $('#workpopup').removeClass('show');
    $('body').removeClass('popup-open');
  });

  // 닫기: 오버레이 클릭
  $('#workpopup').on('click', function (e) {
    if (e.target === this) {
      $(this).removeClass('show');
      $('body').removeClass('popup-open');
    }
  });

  // 닫기: ESC 키
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('#workpopup').removeClass('show');
      $('body').removeClass('popup-open');
    }
  });

  /* ── 이메일 클립보드 복사 ── */ /* ★ 수정 */
  $('.contact-item-value').on('click', function () {
    const email = $(this).text().trim();
    const $el = $(this);
    navigator.clipboard.writeText(email).then(function () {
      const $toast = $('<span class="copy-toast">이메일이 복사되었습니다.</span>');
      $el.append($toast);
      setTimeout(function () { $toast.addClass('copy-toast--hide'); }, 800);
      setTimeout(function () { $toast.remove(); }, 1200);
    });
  });
});
