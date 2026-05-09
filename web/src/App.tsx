import { Auth } from './auth/Auth';
import { type Component } from 'solid-js';
import './App.css';

const App: Component = () => {
  return (
    <div class='flex h-screen items-center'>
      <Auth />
    </div>
  );
};

export default App;
