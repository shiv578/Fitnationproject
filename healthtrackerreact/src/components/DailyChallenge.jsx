import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./DailyChallenge.module.css";

const DailyChallenge = ({ userId, onCompleted }) => {
  const [challenge, setChallenge] = useState(undefined);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/challenge/today/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setChallenge(data.challenge);
        }
      })
      .catch(err => console.error("Daily challenge error", err));
  }, [userId]);

  const confirmYes = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/challenge/complete",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        }
      );

      const data = await res.json();
      if (data.success) {
        setChallenge(prev => ({ ...prev, completed: true }));
        onCompleted && onCompleted();
      }
    } catch (err) {
      console.error("Complete error", err);
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  if (challenge === undefined) {
    return (
      <div className={css.card}>
        <div className={css.banner}>
          <div className={css.centerWrap}>Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={css.card}>
        <div className={css.banner}>
          <div className={css.centerWrap}>
            <h3 className={css.subtitle}>Today’s Challenge</h3>
            <h1 className={css.title}>{challenge.taskText}</h1>
          </div>

          <div className={css.rightWrap}>
            <span
              className={
                challenge.completed
                  ? css.statusCompleted
                  : css.statusPending
              }
            >
              {challenge.completed ? "Completed" : "Pending"}
            </span>

            {!challenge.completed && (
              <button
                className={css.doneBtn}
                onClick={() => setShowConfirm(true)}
              >
                Mark as Done
              </button>
            )}
          </div>
        </div>
      </div>

      {showConfirm &&
        createPortal(
          <div className={css.overlay}>
            <div className={css.confirmBox}>
              <h2>Don’t cheat with your health</h2>
              <p>Are you sure you completed today’s task?</p>

              <div className={css.actions}>
                <button onClick={confirmYes} disabled={submitting}>
                  {submitting ? "Saving..." : "Yes, I did"}
                </button>
                <button onClick={() => setShowConfirm(false)}>No</button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default DailyChallenge;
