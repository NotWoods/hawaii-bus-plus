import '../assets/main.css';
import { buildShareHandler } from '../services/share/share-handler';
import './App.css';
import './components/Footer.css';

if (import.meta.env.DEV) {
  void import('./entry-dev');
} else {
  const shareButton = document.getElementById('share')!;
  shareButton.addEventListener(
    'click',
    buildShareHandler(document.title, (err) => console.error(err)),
  );
}
