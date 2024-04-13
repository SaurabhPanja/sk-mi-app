import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import History from './History.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

const router = createBrowserRouter([


  {
    path: "/",
    element: <App />,
  },
  {
    path: "/history",
    element: <History />
  },
  {
    path: "/history/:id",
    element: <App />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>,
)
