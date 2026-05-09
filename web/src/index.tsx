/* @refresh reload */
import './index.css';
import outputs from '../../amplify_outputs.json';
import App from './App';
import { render } from 'solid-js/web';
import { Amplify } from 'aws-amplify';

Amplify.configure(outputs);

render(() => <App />, document.getElementById('root') as HTMLElement);
