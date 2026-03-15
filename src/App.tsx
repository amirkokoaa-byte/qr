/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route } from 'react-router-dom';
import Generator from './components/Generator';
import BioPage from './components/BioPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Generator />} />
        <Route path="/bio" element={<BioPage />} />
        <Route path="/bio/:id" element={<BioPage />} />
      </Routes>
    </HashRouter>
  );
}
