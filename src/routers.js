import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Main } from './pages/Main'
import { Repository } from './pages/Repository'

import React from 'react'

export const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/repository/:repository' element={<Repository />} />
      </Routes>
    </BrowserRouter>
  )
}
