import { createRoot } from 'react-dom/client';
import { HotkeysProvider } from '@blueprintjs/core';
import App from './App';
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import './index.css';

import { DOMAttributes } from "react";
import { MathfieldElementAttributes } from 'mathlive'

type CustomElement<T> = Partial<T & DOMAttributes<T>>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["math-field"]: CustomElement<MathfieldElementAttributes>;
    }
  }
}


const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <HotkeysProvider>
    <App />
  </HotkeysProvider>
);
