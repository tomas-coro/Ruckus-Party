import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App';
import { bootstrapApp } from './app/bootstrap';
import './ui/styles/global.css';

document.documentElement.dataset.appVersion = __APP_VERSION__;

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Ruckus Party root element not found');
}

const root = createRoot(rootElement);

void bootstrapApp().then((bootstrapState) => {
  root.render(
    <StrictMode>
      <App bootstrapState={bootstrapState} />
    </StrictMode>,
  );
}).catch((error: unknown) => {
  root.render(
    <main role="alert">
      Application bootstrap failed: {error instanceof Error ? error.message : 'Unknown error'}
    </main>,
  );
});

declare const __APP_VERSION__: string;
