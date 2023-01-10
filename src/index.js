import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { AuthContextProvider } from './store/auth-context';
//we can tap into this context in the different places of the app where we need it 
ReactDOM.render(
<AuthContextProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </AuthContextProvider>,
  document.getElementById('root')
);// we need auth context unto authform comp because that is where i wanna call that login fun 
//to set my token 
