import React, { useEffect, useRef } from "react";
import styles from "./styles/DemoComments.module.css";

const demo = [
  {
    name: "Christian Henry",
    time: "10m",
    text: "Didn't expect to really receive ₦450,000, such a pleasant surprise!",
  },
  {
    name: "Diamond Presh",
    time: "15m",
    text: "I joined many events and today I finally got the money, thanks!",
  },
  {
    name: "Ganny Phrosh",
    time: "20m",
    text: "I tried and the bonus arrived, which was incredible.",
  },
  {
    name: "Geestar Chapman",
    time: "24m",
    text: "The prize has been credited — I still can’t believe this is real.",
  },
  {
    name: "Ijexcreations",
    time: "30m",
    text: "That's awesome! I'll share with my family so they can join too!",
  },
];

export default function DemoComments({ autoScroll = true }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!autoScroll) return;
    const el = ref.current;
    if (!el) return;
    let pos = 0;
    const max = el.scrollHeight - el.clientHeight;
    const iv = setInterval(() => {
      pos += 1;
      if (pos > max) pos = 0;
      el.scrollTo({ top: pos });
    }, 120);
    return () => clearInterval(iv);
  }, [autoScroll]);

  return (
    <div className={styles.box}>
      <div className={styles.header}>Comments • 191</div>
      <div className={styles.list} ref={ref}>
        {demo.map((c, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.avatar}>
              {c.name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className={styles.right}>
              <div className={styles.topRow}>
                <div className={styles.name}>{c.name}</div>
                <div className={styles.time}>{c.time}</div>
              </div>
              <div className={styles.text}>{c.text}</div>
              <div className={styles.actions}>
                <button className={styles.act}>Like</button>
                <button className={styles.act}>Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
