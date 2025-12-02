import React, { useState } from "react";
import styles from "./styles/StepForm.module.css";
import ShareBlock from "./ShareBlock";

export default function StepForm({
  saveUser,
  user,
  calculateEligibility,
  eligible,
  prize,
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name || "");
  const [age, setAge] = useState(user.age || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [calc, setCalc] = useState(false);

  function toStep2() {
    if (!name) return;
    saveUser({ name });
    setStep(2);
  }

  function onCheck() {
    if (!age || !phone) return;
    saveUser({ age, phone });
    // small animation then compute
    setCalc(true);
    setTimeout(() => {
      setCalc(false);
      calculateEligibility();
      setStep(3);
    }, 1600);
  }

  return (
    <div className={styles.card}>
      <div className={styles.progressTopo}>
        <div className={step >= 1 ? styles.dotActive : styles.dot}>1</div>
        <div className={step >= 2 ? styles.dotActive : styles.dot}>2</div>
        <div className={step >= 3 ? styles.dotActive : styles.dot}>3</div>
      </div>

      {step === 1 && (
        <div className={styles.body}>
          <h3 className={styles.h}>Step 1 — Your name</h3>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
          />
          <button className={styles.primary} onClick={toStep2} disabled={!name}>
            Next →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={styles.body}>
          <h3 className={styles.h}>Step 2 — Age & phone</h3>
          <input
            className={styles.input}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
          />
          <input
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (080...)"
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className={styles.primary}
              onClick={onCheck}
              disabled={!age || !phone}
            >
              Check Eligibility
            </button>
            <button className={styles.ghost} onClick={() => setStep(1)}>
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
            <div className={styles.bigNotice}>🎉 You are eligible!</div>
            <div className={styles.prize}>
              Prize: {eligible ? `₦${Number(prize).toLocaleString()}` : "—"}
            </div>
            <div className={styles.hint}>
              Share to 10 groups to reach 100% and unlock CASH OUT
            </div>
            <ShareBlock />
          </div>
        </div>
      )}
    </div>
  );
}
