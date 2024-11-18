import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createClient } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react';
// require('dotenv').config();


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
console.log(supabaseUrl);
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <SessionContextProvider supabaseClient={supabase}>
    <App />
  </SessionContextProvider>

);

