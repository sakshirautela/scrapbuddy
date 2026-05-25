import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => <div>{element}</div>,
  Navigate: ({ to }) => <div>Navigate to {to}</div>,
  useNavigate: () => jest.fn(),
}), { virtual: true });

test('renders Scrapify app', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>,
  );
  expect(screen.getByText(/Online Kabadiwala/i)).toBeInTheDocument();
});
