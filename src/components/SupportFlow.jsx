// src/components/SupportFlow.jsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/SupportFlow.module.css";

/* Single-file funnel component (forms + reward + share + progress + comments + confetti + modal) */

const DEMO_COMMENTS = [
  {
    name: "Christian Henry",
    time: "10m",
    text: "Didn't expect to really receive ₦450,000, Predator Thank you oooo!",
    img: "/profiles/user1.jpg",
  },
  {
    name: "Diamond Presh",
    time: "15m",
    text: "Omo, e shoock me! I will not lie. A whole 150k, I'm so grateful",
    img: "/profiles/user2.jpg",
  },
  {
    name: "Ganny Collections",
    time: "20m",
    text: "Thanks so much, Christmas is set for me.",
    img: "/profiles/user3.jpg",
  },
  {
    name: "Geestar Ebuka",
    time: "24m",
    text: "I've been credited, I still can’t believe this is real.",
    img: "/profiles/user4.jpg",
  },
  {
    name: "Ijexcreations",
    time: "30m",
    text: "That's awesome! I'll share with my family so they can join too!",
    img: "/profiles/user5.jpg",
  },
];

// helper: get initials
function initials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* --- Confetti internal component (premium palette) --- */
function Confetti({ active }) {
  useEffect(() => {
    if (!active) return;
    const container = document.createElement("div");
    container.className = styles.confettiContainer;
    document.body.appendChild(container);

    const colours = ["#dce6f8", "#bcd7ff", "#8fb6ff", "#d0d0d0", "#e8e8e8"];
    for (let i = 0; i < 36; i++) {
      const el = document.createElement("div");
      el.className = styles.confPiece;
      const w = Math.floor(Math.random() * 10) + 6;
      el.style.width = `${w}px`;
      el.style.height = `${w * 0.45}px`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.background = colours[Math.floor(Math.random() * colours.length)];
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      el.style.animationDelay = `${Math.random() * 0.35}s`;
      container.appendChild(el);
    }

    const t = setTimeout(() => {
      if (container.parentNode) container.parentNode.removeChild(container);
    }, 3200);

    return () => {
      clearTimeout(t);
      if (container.parentNode) container.parentNode.removeChild(container);
    };
  }, [active]);

  return null;
}

export default function SupportFlow() {
  // flow states: FORM -> ELIGIBLE -> REWARD -> SHARE -> CHECKING -> WITHDRAW
  const [flow, setFlow] = useState(() =>
    Boolean(localStorage.getItem("cg_prize")) ? "REWARD" : "FORM"
  );

  // form steps
  const [step, setStep] = useState(1);
  const [name, setName] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("cg_user") || "{}");
      return u.name || "";
    } catch {
      return "";
    }
  });
  const [age, setAge] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("cg_user") || "{}");
      return u.age || "";
    } catch {
      return "";
    }
  });
  const [phone, setPhone] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("cg_user") || "{}");
      return u.phone || "";
    } catch {
      return "";
    }
  });

  const [calc, setCalc] = useState(false);
  const [prize, setPrize] = useState(() =>
    Number(localStorage.getItem("cg_prize") || 0)
  );
  const [showConfetti, setShowConfetti] = useState(false);

  // progress & leaves (share)
  const [leaves, setLeaves] = useState(() =>
    Number(localStorage.getItem("cg_leaves") || 0)
  );
  const [progress, setProgress] = useState(() =>
    Number(localStorage.getItem("cg_progress") || 0)
  );

  // waiting for visibility change when opening whatsapp
  const awaitingRef = useRef(false);
  const timeoutRef = useRef(null);

  // comments ref for autoscroll
  const listRef = useRef(null);

  // keep localStorage in sync
  useEffect(() => {
    const user = { name, age, phone };
    localStorage.setItem("cg_user", JSON.stringify(user));
  }, [name, age, phone]);

  useEffect(() => {
    localStorage.setItem("cg_leaves", String(leaves));
    localStorage.setItem("cg_progress", String(progress));
    // broadcast storage change
    window.dispatchEvent(new Event("storage"));
  }, [leaves, progress]);

  // visibility detection for share count
  useEffect(() => {
    function onVisibility() {
      if (awaitingRef.current && document.hidden) {
        // left to WhatsApp
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaves, progress]);

  // auto-scroll comments
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let pos = 0;
    const max = el.scrollHeight - el.clientHeight;
    const iv = setInterval(() => {
      pos += 1;
      if (pos > max) pos = 0;
      el.scrollTo({ top: pos });
    }, 120);
    return () => clearInterval(iv);
  }, []);

  // helper: count leave (sharing progress logic)
  const FIRST_INCREMENTS = [20, 20, 20, 30]; // first four leaves
  function countLeave() {
    setLeaves((l) => {
      const idx = l;
      let add = 2;
      if (idx < FIRST_INCREMENTS.length) add = FIRST_INCREMENTS[idx];
      setProgress((prev) => {
        let next = prev + add;
        if (next > 100) next = 100;
        return next;
      });
      return l + 1;
    });
  }

  // Start share (open whatsapp)
  function onShare() {
    const shareMessage = `🎄 *CHRISTMAS SUPPORT FUNDS🤩*

I just got ₦${Number(
      prize
    ).toLocaleString()} now now as a support funds for December.. E shock me too 😁

*Get yours here 👇*
👉 https://christmas-gi.xyz`;

    const encoded = encodeURIComponent(shareMessage);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(url, "_blank");

    // trigger visibility logic
    awaitingRef.current = true;
    timeoutRef.current = setTimeout(() => {
      awaitingRef.current = false;
      timeoutRef.current = null;
    }, 6000);
  }

  function calculateEligibility() {
    let random = Math.floor(Math.random() * (250000 - 80000 + 1)) + 80000;

    // round UP to nearest thousand
    random = Math.ceil(random / 1000) * 1000;

    localStorage.setItem("cg_prize", String(random));
    setPrize(random);

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    setFlow("REWARD");
  }

  // form flows
  function toStep2() {
    if (!name.trim()) return;
    setStep(2);
  }

  function onCheck() {
    if (!age || !phone) return;
    // small animation then compute
    setCalc(true);
    setTimeout(() => {
      setCalc(false);
      calculateEligibility();
      setStep(3);
    }, 1400);
  }

  // cashout clicked: reveal share block
  function onCashOut() {
    setFlow("SHARE");
  }

  // when progress reaches 100, show checking popup
  useEffect(() => {
    if (progress >= 100) {
      // brief delay so UI settles, then show checking modal
      setTimeout(() => setFlow("CHECKING"), 450);
    }
  }, [progress]);

  // simulate checking -> success then show withdraw
  useEffect(() => {
    if (flow !== "CHECKING") return;
    const t1 = setTimeout(() => {
      setFlow("WITHDRAW");
    }, 2000); // checking animation for 2s
    return () => clearTimeout(t1);
  }, [flow]);

  // reset dev
  function resetAll() {
    localStorage.clear();
    setName("");
    setAge("");
    setPhone("");
    setStep(1);
    setPrize(0);
    setLeaves(0);
    setProgress(0);
    setFlow("FORM");
    window.location.reload();
  }

  // withdraw redirect
  function onWithdraw() {
    window.location.href = "https://joshspot.com/christmas";
  }

  return (
    <div className={styles.page}>
      <Confetti active={showConfetti} />

      <header className={styles.header}>
        <img src="/giveaway-badge.png" className={styles.badge} alt="badge" />
        <div className={styles.headerText}>
          <div className={styles.brand}>CHRISTMAS SUPPORT FUNDS</div>
          <div className={styles.lead}>Proudly Sponsored by Predator</div>
        </div>
      </header>

      <main className={styles.main}>
        {/* LEFT column: form / reward / share */}
        <section className={styles.left}>
          {/* Form card (visible until reward flow shows) */}
          {flow !== "REWARD" &&
            flow !== "SHARE" &&
            flow !== "CHECKING" &&
            flow !== "WITHDRAW" && (
              <div className={styles.glassCard}>
                <div className={styles.progressTopo}>
                  <div className={step >= 1 ? styles.dotActive : styles.dot}>
                    1
                  </div>
                  <div className={step >= 2 ? styles.dotActive : styles.dot}>
                    2
                  </div>
                  <div className={step >= 3 ? styles.dotActive : styles.dot}>
                    3
                  </div>
                </div>

                {step === 1 && (
                  <div className={styles.body}>
                    <h3 className={styles.h}>Enter Your Name</h3>
                    <input
                      className={styles.input}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Friday Precious"
                    />
                    <button
                      className={styles.primary}
                      onClick={toStep2}
                      disabled={!name.trim()}
                    >
                      Next →
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className={styles.body}>
                    <h3 className={styles.h}>Enter your Age & Phone Number</h3>
                    <input
                      className={styles.input}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age"
                      inputMode="numeric"
                    />
                    <input
                      className={styles.input}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone (080123456...)"
                      inputMode="tel"
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className={styles.primary}
                        onClick={onCheck}
                        disabled={!age || !phone}
                      >
                        Check Eligibility
                      </button>
                      <button
                        className={styles.ghost}
                        onClick={() => setStep(1)}
                      >
                        Back
                      </button>
                    </div>

                    {calc && (
                      <div className={styles.calc}>
                        <div className={styles.dotSpin}></div>
                        <div>Checking eligibility...</div>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className={styles.body}>
                    <h3 className={styles.h}>Result</h3>
                    <div className={styles.resultBox}>
                      <div className={styles.bigNotice}>
                        🎉 Congratulations, You are eligible!
                      </div>
                      <div className={styles.prize}>
                        Prize:{" "}
                        {prize ? `₦${Number(prize).toLocaleString()}` : "—"}
                      </div>
                      <div className={styles.hint}>
                        Click on CASH OUT now to withdraw your funds
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Reward card (shown after eligibility/confetti) */}
          {flow === "REWARD" && (
            <div className={styles.prizeCard}>
              <h3 className={styles.prizeTitle}>Your Reward</h3>
              <div className={styles.prizeAmount}>
                ₦{Number(prize).toLocaleString()}
              </div>
              <p className={styles.prizeNote}>
                You are eligible. Claim your reward.
              </p>

              <div style={{ marginTop: 16 }}>
                <button className={styles.cashout} onClick={onCashOut}>
                  CASH OUT ➜
                </button>
              </div>
            </div>
          )}

          {/* Share & progress (shown when flow === SHARE or after clicking cashout) */}
          {flow === "SHARE" && (
            <>
              <div className={styles.glassCard}>
                <div className={styles.small}>
                  <b>INSTRUCTIONS</b> <br />
                  <i>
                    Follow the instructions to claim your christmas support
                    funds
                  </i>{" "}
                  <br /> <br />
                  1. CLICK on the WHATSAPP SHARE button below <br />
                  2. SHARE to at least 10 groups <br />
                  3. Finish the task in less than 10 minutes to avoid revoking
                  your support funds.
                </div>
                <br />
                <br />
                <div className={styles.row}>
                  <div className={styles.label}>Share Progress</div>
                  <div className={styles.pct}>{progress}%</div>
                </div>

                <div className={styles.bar}>
                  <div
                    className={styles.fill}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <button className={styles.shareBtn} onClick={onShare}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      className={styles.whatsappIcon}
                    >
                      <path d="M13.601 2.326A7.86 7.86 0 0 0 8.043 0C3.603 0 .07 3.533.07 7.957c0 1.403.366 2.774 1.057 3.985L0 16l4.173-1.096a7.93 7.93 0 0 0 3.87.986h.004c4.442 0 7.975-3.533 7.975-7.957a7.88 7.88 0 0 0-2.421-5.607zM8.047 14.55h-.003a6.57 6.57 0 0 1-3.356-.92l-.24-.143-2.48.652.663-2.42-.157-.249a6.49 6.49 0 0 1-1.006-3.51c0-3.614 2.94-6.553 6.565-6.553a6.52 6.52 0 0 1 4.63 1.918 6.53 6.53 0 0 1 1.92 4.637c0 3.613-2.94 6.548-6.536 6.548zm3.598-4.89c-.196-.098-1.162-.574-1.341-.64-.18-.067-.31-.098-.44.098-.13.196-.505.64-.62.77-.115.131-.23.147-.426.049-.196-.098-.827-.305-1.575-.975-.582-.519-.975-1.161-1.09-1.357-.115-.196-.012-.302.085-.4.088-.088.196-.23.294-.345.098-.115.13-.196.196-.327.066-.131.033-.245-.016-.344-.049-.098-.44-1.062-.603-1.45-.159-.382-.322-.33-.44-.335-.115-.006-.245-.007-.375-.007a.723.723 0 0 0-.53.245c-.18.196-.691.676-.691 1.648 0 .972.71 1.91.81 2.046.098.131 1.397 2.137 3.38 2.998.472.203.84.325 1.126.417.473.15.904.129 1.246.078.38-.057 1.162-.474 1.326-.933.164-.46.164-.853.115-.933-.049-.082-.18-.131-.375-.23z" />
                    </svg>
                    Share to WhatsApp — Share to 10 groups
                  </button>
                </div>
              </div>

              {progress >= 100 && (
                <div className={styles.glassCard}>
                  <div style={{ textAlign: "center", padding: 6 }}>
                    <div style={{ fontWeight: 700, color: "#004bad" }}>
                      🎉 Almost there
                    </div>
                    <div style={{ marginTop: 8, color: "#444" }}>
                      Verifying completion...
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Checking modal (flow === CHECKING) */}
          {flow === "CHECKING" && (
            <div className={styles.modalWrap}>
              <div className={styles.modal}>
                <div className={styles.modalTitle}>Verifying...</div>
                <div className={styles.checking}>
                  <div className={styles.spinner}></div>
                  <div style={{ marginTop: 10 }}>
                    Calculating tasks and verifying shares...
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Withdraw success view (flow === WITHDRAW) */}
          {flow === "WITHDRAW" && (
            <div className={styles.prizeCard}>
              <div className={styles.bigNotice}>🎉 Congratulations!</div>
              <div style={{ marginTop: 8, color: "#003e9b" }}>
                You have completed the sharing tasks , you're set to withdraw.
              </div>
              <div style={{ marginTop: 16 }}>
                <button className={styles.cashout} onClick={onWithdraw}>
                  WITHDRAW ➜
                </button>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT column: Comments (always visible and longer) */}
        <aside className={styles.right}>
          <div className={styles.commentCard}>
            <div className={styles.commentHeader}>
              <div>Recent Comments</div>
              <div className={styles.count}>191</div>
            </div>

            <div className={styles.list} ref={listRef}>
              {DEMO_COMMENTS.map((c, i) => (
                <div key={i} className={styles.item}>
                  <div className={styles.avatarWrap}>
                    {/* real image src (place in public/profiles/) */}
                    <img
                      src={c.img}
                      alt={c.name}
                      className={styles.avatarImg}
                      onError={(e) => {
                        // fallback to initials if image missing
                        e.target.style.display = "none";
                        const parent = e.target.parentNode;
                        if (parent) {
                          parent.querySelector("span").style.display = "flex";
                        }
                      }}
                    />
                    <span className={styles.avatarInitials}>
                      {initials(c.name)}
                    </span>
                  </div>

                  <div className={styles.rightText}>
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

              {/* filler so list is longer */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`f-${i}`} className={styles.item}>
                  <div className={styles.avatarWrap}>
                    <img
                      src={`/profiles/user${(i % 5) + 1}.jpg`}
                      alt="u"
                      className={styles.avatarImg}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <span className={styles.avatarInitials}>JD</span>
                  </div>
                  <div className={styles.rightText}>
                    <div className={styles.topRow}>
                      <div className={styles.name}>Random User</div>
                      <div className={styles.time}>1h</div>
                    </div>
                    <div className={styles.text}>
                      This looks great — joining now!
                    </div>
                    <div className={styles.actions}>
                      <button className={styles.act}>Like</button>
                      <button className={styles.act}>Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
