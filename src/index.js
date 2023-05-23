import React from 'react'
import ReactDOM from 'react-dom/client'
import './lib/firebase'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import './styles/app.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
     <Provider store={store}>
          <App />
     </Provider>
)
