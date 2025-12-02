import React, { useEffect, useState } from "react";
import styles from "./styles/ProgressMeter.module.css";

export default function ProgressMeter() {
  const [p, setP] = useState(() =>
    Number(localStorage.getItem("cg_progress") || 0)
  );

  useEffect(() => {
    function onStorage() {
      setP(Number(localStorage.getItem("cg_progress") || 0));
    }
    window.addEventListener("storage", onStorage);
    onStorage();
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <div className={styles.label}>Share Progress</div>
        <div className={styles.pct}>{p}%</div>
      </div>
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${p}%` }}></div>
      </div>

      {p >= 100 && (
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <button
            className={styles.cashout}
            onClick={() => (window.location.href = "/disburse")}
          >
            CASH OUT ➜
          </button>
        </div>
      )}
    </div>
  );
}
