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
    const rawOffset = worksIndex * stepSize;
    const offset    = Math.min(rawOffset, maxOffset);

    $('.works-slider').css('transform', 'translateX(-' + offset + 'px)');

    $('.works-btn--prev').toggleClass('hidden', worksIndex <= 0);
    $('.works-btn--next').toggleClass('hidden', offset >= maxOffset);

    const total    = $('.work-card').length;
    const maxSteps = Math.ceil(maxOffset / stepSize);
    const progress = maxSteps > 0 ? Math.min((worksIndex / maxSteps) * 100, 100) : 100;
    $('.works-progress-fill').css('width', progress + '%');
    $('.works-progress-current').text(String(Math.min(worksIndex + 1, total)).padStart(2, '0'));
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

  /* ── Work card modal ── */
  $(document).on('click', '.work-card--popup a', function (e) {
    e.preventDefault();
    const $card = $(this).closest('.work-card');
    const $modal = $('#workModal');

    // 썸네일 배경 복사
    const $thumb = $card.find('.work-card-thumb');
    const thumbStyle = window.getComputedStyle($thumb[0]);
    $modal.find('.modal-thumb').css({
      backgroundColor: thumbStyle.backgroundColor,
      backgroundImage: thumbStyle.backgroundImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    });

    // 카드 기존 텍스트에서 데이터 읽기
    $modal.find('.modal-num').text($card.find('.work-card-num').text());
    $modal.find('.modal-title').text($card.find('.work-card-name').text());
    $modal.find('.modal-year').text($card.find('.work-card-year').text());
    $modal.find('.modal-type').text($card.find('.work-card-type').text());

    // data 속성 (설명 / 스킬 / 링크)
    $modal.find('.modal-desc').text($card.data('desc') || '');
    const skills = ($card.data('skills') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    $modal.find('.modal-skills').html(skills.map(function (s) { return '<span>' + s + '</span>'; }).join(''));
    const link = $card.data('link') || '#';
    $modal.find('.modal-link').attr('href', link).toggle(link !== '#');

    $modal.addClass('active');
    $('body').addClass('modal-open');
  });

  // 닫기: X 버튼
  $('#workModal .modal-close').on('click', function () {
    $('#workModal').removeClass('active');
    $('body').removeClass('modal-open');
  });

  // 닫기: 오버레이 클릭
  $('#workModal').on('click', function (e) {
    if (e.target === this) {
      $(this).removeClass('active');
      $('body').removeClass('modal-open');
    }
  });

  // 닫기: ESC 키
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('#workModal').removeClass('active');
      $('body').removeClass('modal-open');
    }
  });
});
