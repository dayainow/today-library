import { registerRootComponent } from 'expo';
import React from 'react';

import App from './App';
import { ErrorBoundary } from './src/ErrorBoundary';

function Root() {
  return React.createElement(ErrorBoundary, null, React.createElement(App));
}

registerRootComponent(Root);
