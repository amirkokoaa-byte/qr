/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Generator from './components/Generator';
import BioPage from './components/BioPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Generator />} />
        <Route path="/bio" element={<BioPage />} />
      </Routes>
    </BrowserRouter>
  );
}
