import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme.jsx';
import HomePage from './components/home/HomePage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <HomePage />
      </ThemeProvider>
    </BrowserRouter>
  );
}
