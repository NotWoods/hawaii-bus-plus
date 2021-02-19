import './main.css';

const params = new URLSearchParams(window.location.hash.slice(1));
const token = params.get('invite_token');
