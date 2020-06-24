
var Demo = (function() {

  let timer;
  let activeElement;

  const REST_TIMER_DURATION = 15000;

  var init = function() {
    const workStart = $('#exercise-1');

    startWorkTimer(workStart, workStart.data('duration'));

    actions();
  };

  var actions = function() {
    $('.pause-timer').on('click', function() {
      var self = $(this);

      if (self.find('.fa-stack-1x.fa-pause').length > 0) {
        pauseTimer(self);
      } else {
        resumeTimer(self);
      }
    });

    $('.btn-next-exercise').on('click', function() {
      clearTimeout(timer);
      $('.row-rest-timer').removeClass('active');
      $('.row-next-exercise').removeClass('active');

      const next = $(activeElement.data('next'));
      startWorkTimer(next, next.data('duration'));
    });
  }

  var startWorkTimer = function(element, duration) {
    activeElement = element;

    element.addClass('active');
    $('.row-work-timer').addClass('active');

    let minutes = parseInt(duration / 1000 / 60);
    let seconds = duration / 1000 % 60;

    if (minutes <= 9) {
      minutes = `0${minutes}`;
    }
    if (seconds <= 9) {
      seconds = `0${seconds}`;
    }

    const output = $('#work-timer');
    output.html(`${minutes}:${seconds}`);

    if (duration === 0) {
      const next = $(element.data('next'));

      element.removeClass('active');
      $('.row-work-timer').removeClass('active');

      if (element.data('next')) {
        startRestTimer(next, REST_TIMER_DURATION);
      } else {
        $('.row-workout-finished').addClass('active');
      }
      return;
    }

    timer = setTimeout(function() {
      startWorkTimer(element, duration - 1000);
    }, 1000);
  };

  var startRestTimer = function(next, duration) {
    $('.row-rest-timer').addClass('active');
    $('.row-next-exercise').addClass('active');

    $('.row-next-exercise span').text(next.find('h1').text());

    let minutes = parseInt(duration / 1000 / 60);
    let seconds = duration / 1000 % 60;

    if (minutes <= 9) {
      minutes = `0${minutes}`;
    }
    if (seconds <= 9) {
      seconds = `0${seconds}`;
    }

    const output = $('#rest-timer');
    output.html(`${minutes}:${seconds}`);

    if (duration === 0) {
      $('.row-rest-timer').removeClass('active');
      $('.row-next-exercise').removeClass('active');

      startWorkTimer(next, next.data('duration'));
      return;
    }

    timer = setTimeout(function() {
      startRestTimer(next, duration - 1000);
    }, 1000);
  };

  var pauseTimer = function(button) {
    button.find('.fa-stack-1x').removeClass('fa-pause').addClass('fa-play');
    clearTimeout(timer);
  };

  var resumeTimer = function(button, timer) {
    button.find('.fa-stack-1x').removeClass('fa-play').addClass('fa-pause');

    if ($('.row-work-timer.active').length > 0) {
      const timerOutput = $('#work-timer').text().split(':');
      const durationLeft = ((parseInt(timerOutput[0]) * 60) + parseInt(timerOutput[1])) * 1000;

      timer = startWorkTimer(activeElement, durationLeft);
    } else {
      const timerOutput = $('#rest-timer').text().split(':');
      const durationLeft = ((parseInt(timerOutput[0]) * 60) + parseInt(timerOutput[1])) * 1000;

      timer = startRestTimer($(activeElement.data('next')), durationLeft);
    }

  };

  return {
    init: init
  };

})();

$(document).ready(function() {
  Demo.init();
});