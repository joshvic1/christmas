/* Simple DOM confetti (pure CSS + JS). When active=true, it spawns many pieces and animates them.
   No external libs required.
*/
import React, { useEffect } from "react";
import styles from "./styles/Confetti.module.css";

export default function Confetti({ active }) {
  useEffect(() => {
    if (!active) return;
    const container = document.createElement("div");
    container.className = styles.container;
    document.body.appendChild(container);

    // spawn 40 pieces
    const colours = ["#e31b23", "#15803d", "#d99a2b", "#ff7aa2", "#7ee3b8"];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement("div");
      el.className = styles.piece;
      const w = Math.floor(Math.random() * 10) + 8;
      el.style.width = `${w}px`;
      el.style.height = `${w * 0.6}px`;
      el.style.background = colours[Math.floor(Math.random() * colours.length)];
      el.style.left = `${Math.random() * 100}%`;
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      el.style.animationDelay = `${Math.random() * 0.35}s`;
      container.appendChild(el);
    }

    // remove after animation
    setTimeout(() => {
      if (container && container.parentNode)
        container.parentNode.removeChild(container);
    }, 3500);

    return () => {
      if (container && container.parentNode)
        container.parentNode.removeChild(container);
    };
  }, [active]);

  return null;
}
