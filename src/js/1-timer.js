import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

class Timer {
  static convertMs = convertMs;

  constructor() {
    this.userSelectedDate = null;
    this.countdownInterval = null;
    this.startButton = document.querySelector('[data-start]');
    this.dateTimePicker = document.querySelector('#datetime-picker');
    this.timerDisplay = document.querySelector('.timer');

    this.startButton.disabled = true;
    this.startButton.addEventListener('click', () => this.startCountdown());
    this.dateTimePicker.addEventListener('change', () =>
      this.updateStartButtonState()
    );

    const options = {
      enableTime: true,
      time_24hr: true,
      defaultDate: new Date(),
      minuteIncrement: 1,
      onClose: selectedDates => {
        this.userSelectedDate = selectedDates[0];
        this.updateStartButtonState();
      },
    };

    flatpickr('#datetime-picker', options);
  }

  startCountdown() {
    clearInterval(this.countdownInterval);
    this.startButton.disabled = true;
    this.dateTimePicker.disabled = true;
    const countdown = this.userSelectedDate - new Date();
    if (countdown > 0) {
      this.countdownInterval = setInterval(() => {
        const remainingTime = this.userSelectedDate - new Date();
        if (remainingTime <= 0) {
          clearInterval(this.countdownInterval);
          this.updateTimerDisplay(0);
          return;
        }
        this.updateTimerDisplay(remainingTime);
      }, 1000);
    }
  }

  updateTimerDisplay(remainingTime) {
    const { days, hours, minutes, seconds } = Timer.convertMs(remainingTime);
    const formattedDays = this.addLeadingZero(days);
    const formattedHours = this.addLeadingZero(hours);
    const formattedMinutes = this.addLeadingZero(minutes);
    const formattedSeconds = this.addLeadingZero(seconds);
    const timerDisplay = `${formattedDays}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    this.timerDisplay.textContent = timerDisplay;
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

  updateStartButtonState() {
    const currentDate = new Date();
    if (this.userSelectedDate > currentDate) {
      this.startButton.disabled = false;
    } else {
      this.startButton.disabled = true;
      if (this.userSelectedDate) {
        iziToast.warning({
          title: 'Invalid date',
          message: 'Please choose a date in the future.',
        });
      }
    }
  }
}

const timer = new Timer();
