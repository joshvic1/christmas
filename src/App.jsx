import React, { useEffect, useState } from "react";
import SupportFlow from "./components/SupportFlow";
import styles from "./App.module.css";
import { Analytics } from "@vercel/analytics/next";

export default function App() {
  return (
    <div>
      <SupportFlow />
    </div>
  );
}
