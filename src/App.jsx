import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SupportFlow from "./components/SupportFlow";
import NigeriaPage from "./Nigeria/page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SupportFlow />} />

        <Route path="/Nigeria" element={<NigeriaPage />} />
      </Routes>
    </BrowserRouter>
  );
}
