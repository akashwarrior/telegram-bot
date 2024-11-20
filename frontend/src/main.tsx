import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
const App = React.lazy(() => import('./page/App'));
const Login = React.lazy(() => import('./page/Login'));
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </RecoilRoot>
)
