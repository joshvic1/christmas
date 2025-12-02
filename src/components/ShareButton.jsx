import React, { useState, useEffect } from "react";
import styles from "./styles/ProgressMeter.module.css";
import { FaWhatsapp } from "react-icons/fa";

/*
 Progress increment rules:
  - increments array used for first leaves: [20,20,20,30] => totals 90
  - subsequent leaves add 2% each
*/

const firstIncrements = [20, 20, 20, 30];

export default function ShareButton() {
  const [leaves, setLeaves] = useState(() =>
    Number(localStorage.getItem("giveaway_leaves") || 0)
  );
  const [progress, setProgress] = useState(() =>
    Number(localStorage.getItem("giveaway_progress") || 0)
  );

  useEffect(() => {
    localStorage.setItem("giveaway_leaves", leaves);
    // update shared progress key used by other parts of app
    localStorage.setItem("giveaway_progress", progress);
    // dispatch storage event manually for same-window subscribers
    window.dispatchEvent(new Event("storage"));
  }, [leaves, progress]);

  function onShareClick() {
    // construct share message
    const message = encodeURIComponent(
      "I just joined the CHRISTMAS SUPPORT FUNDS giveaway! Join and try your luck 🎄🎁"
    );
    const waWeb = `https://api.whatsapp.com/send?text=${message}`;
    const waApp = `whatsapp://send?text=${message}`;

    // open whatsapp (will open web or app depending on device)
    // we open the app scheme first (some browsers will block, so fallback)
    const newWindow = window.open(waApp, "_blank");

    // fallback after short delay to web if app scheme was blocked
    setTimeout(() => {
      if (!newWindow || newWindow.closed) {
        window.open(waWeb, "_blank");
      }
    }, 600);

    // record a leave attempt immediately (we will treat it as a leave)
    // this is because detecting actual sharing is impossible reliably cross-browser.
    increaseProgressOnLeave();
    setLeaves((prev) => prev + 1);
  }

  function increaseProgressOnLeave() {
    let current = Number(localStorage.getItem("giveaway_progress") || 0);
    let add = 0;
    const l = Number(localStorage.getItem("giveaway_leaves") || 0); // leaves BEFORE increment
    if (l < firstIncrements.length) {
      add = firstIncrements[l];
    } else {
      add = 2;
    }
    let next = current + add;
    if (next > 100) next = 100;
    setProgress(next);
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "center",
        marginTop: 12,
      }}
    >
      <button className={styles.shareBtn} onClick={onShareClick}>
        <FaWhatsapp style={{ marginRight: 8 }} /> Share to WhatsApp
      </button>
    </div>
  );
}
