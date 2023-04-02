import { createRoot } from 'react-dom/client';
import { HotkeysProvider } from '@blueprintjs/core';
import {
  RecoilRoot,
} from 'recoil';
import App from './App';
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import './main.css';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <HotkeysProvider>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </HotkeysProvider>
);
