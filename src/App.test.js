import { render } from '@testing-library/react';
import App from './App';

test('renders NovaChain app without crashing', () => {
  render(<App />);
});
