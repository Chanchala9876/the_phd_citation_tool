import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MantineProvider
    theme={{
      colorScheme: 'light',
      primaryColor: 'blue',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      components: {
        Button: {
          defaultProps: {
            radius: 'md',
          },
        },
        Paper: {
          defaultProps: {
            radius: 'md',
          },
        },
      },
    }}
  >
    <App />
  </MantineProvider>
);
