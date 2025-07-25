import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PostHogProviderWrapper } from './PostHogProviderWrapper';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProviderWrapper>
      <App />
    </PostHogProviderWrapper>
  </StrictMode>
);