/** ShareBlock handles opening WhatsApp and detecting leaves via visibilitychange.
    It updates localStorage keys: cg_leaves, cg_progress.
    Progress rules:
     - first 3 leaves: +20 each
     - 4th leave: +30 (to 90)
     - subsequent leaves: +2 each
*/
import React, { useEffect, useState, useRef } from "react";
import styles from "./styles/ShareBlock.module.css";

const firstIncrements = [20, 20, 20, 30];

export default function ShareBlock() {
  const [leaves, setLeaves] = useState(() =>
    Number(localStorage.getItem("cg_leaves") || 0)
  );
  const [progress, setProgress] = useState(() =>
    Number(localStorage.getItem("cg_progress") || 0)
  );
  const awaitingRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("cg_leaves", String(leaves));
    localStorage.setItem("cg_progress", String(progress));
    // send storage event for other components
    window.dispatchEvent(new Event("storage"));
  }, [leaves, progress]);

  useEffect(() => {
    function onVisibility() {
      if (awaitingRef.current && document.hidden) {
        // user left (likely to WhatsApp)
        countLeave();
        awaitingRef.current = false;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [leaves, progress]);

  function countLeave() {
    const l = leaves;
    let add = 2;
    if (l < firstIncrements.length) add = firstIncrements[l];
    let next = progress + add;
    if (next > 100) next = 100;
    setLeaves((prev) => prev + 1);
    setProgress(next);
  }

  function onShare() {
    // message - keep short
    const text = encodeURIComponent(
      "I joined CHRISTMAS SUPPORT FUNDS giveaway! 🎄🎁 Try it now:"
    );
    const url = `https://api.whatsapp.com/send?text=${text}`;
    // open whatsapp (app or web)
    const win = window.open(url, "_blank");
    // mark awaiting; we'll watch visibilitychange for leaving
    awaitingRef.current = true;
    // safety: after 6s, if visibility didn't change, cancel awaiting
    timeoutRef.current = setTimeout(() => {
      awaitingRef.current = false;
      timeoutRef.current = null;
    }, 6000);
  }

  return (
    <div className={styles.wrap}>
      <button className={styles.shareBtn} onClick={onShare}>
        Share to WhatsApp — Share to 10 groups
      </button>
      <div className={styles.small}>
        Each time you leave to WhatsApp the progress will increase.
      </div>
    </div>
  );
}
