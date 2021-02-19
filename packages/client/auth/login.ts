import './main.css';

const header = document.getElementById('header')!;
const not = document.getElementById('not')!;
const swap = document.getElementById('swap') as HTMLAnchorElement;
const submit = document.getElementById('submit') as HTMLButtonElement;
const toToggle = document.getElementsByClassName(
  'only--register'
) as HTMLCollectionOf<HTMLElement>;

const LOGIN_PATH = '/login';
const REGISTER_PATH = '/register';

function isRegisterPath() {
  return window.location.pathname.startsWith(REGISTER_PATH);
}

let registerOn = isRegisterPath();

function handleSwitch() {
  if (registerOn) {
    document.title = 'Register - Hawaii Bus Plus';
    header.textContent = 'Register for a new account';
    not.textContent = 'Already signed up?';
    swap.href = LOGIN_PATH;
    swap.textContent = 'Login to your account.';
    submit.textContent = 'Register';
  } else {
    document.title = 'Login - Hawaii Bus Plus';
    header.textContent = 'Welcome back!';
    not.textContent = 'Not registered?';
    swap.href = REGISTER_PATH;
    swap.textContent = 'Start your 14-day free trial.';
    submit.textContent = 'Login';
  }
  for (const el of toToggle) {
    el.hidden = !registerOn;
  }
  history.pushState(undefined, '', registerOn ? REGISTER_PATH : LOGIN_PATH);
}
handleSwitch();

swap.addEventListener('click', (evt) => {
  evt.preventDefault();
  registerOn = !registerOn;
  handleSwitch();
});
window.addEventListener('popstate', () => {
  registerOn = isRegisterPath();
  handleSwitch();
});
