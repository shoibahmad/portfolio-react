import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css'
// Force refresh 2

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Remove static preloader after React mounts
const preloader = document.getElementById('app-preloader');
if (preloader) {
  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.remove();
    }, 500);
  }, 1000);
}
