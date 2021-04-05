import '../all-pages/main.css';
import { buildShareHandler } from '../page/routes/timetable/details/share';
import './App.css';
import './components/Footer.css';
import { dynamicLoginButton } from './components/PageHeader';

if (import.meta.env.DEV) {
  import('./entry-dev');
} else {
  const shareButton = document.getElementById('share')!;
  shareButton.addEventListener(
    'click',
    buildShareHandler(document.title, (err) => console.error(err)),
  );
  void dynamicLoginButton();
}
