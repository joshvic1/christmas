import React, { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiTrigger({ active }) {
  useEffect(() => {
    if (!active) return;
    // nice burst
    const duration = 3000;
    const end =
      Date.now() +
      duration(
        (function frame() {
          confetti({
            particleCount: 6,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 6,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        })()
      );
  }, [active]);

  return null;
}
