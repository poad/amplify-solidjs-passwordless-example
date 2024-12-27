/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { Amplify } from 'aws-amplify';
import outputs from "../../amplify_outputs.json";
import App from './App';

Amplify.configure(outputs);

render(() => <App />, document.getElementById('root') as HTMLElement);
