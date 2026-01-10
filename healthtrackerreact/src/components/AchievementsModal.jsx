import React, { useEffect } from "react";
import css from "./AchievementsModal.module.css";


export default function AchievementsModal({
  onClose,
  tasksCompleted = 247,
  currentStreak = 14,
  achievementsUnlocked = 5,
  totalAchievements = 8,
  activeDays = 42

  
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
    
  return (
    <div className={css.overlay}>
      <div className={css.container}>

        {/* Close */}
        <button className={css.closeBtn} onClick={onClose}>✕</button>

        {/* Streak badge */}
        <div className={css.streakBadge}>
          🔥 {currentStreak} Day Streak
        </div>

        {/* Title */}
        <h1 className={css.title}>
          Your <span>Achievements</span>
        </h1>

        <p className={css.subtitle}>
          Track your health journey and celebrate your wins
        </p>

        {/* Stats Cards */}
        <div className={css.statsGrid}>

          <div className={css.statCard}>
            <div className={`${css.icon} ${css.blue}`}>✔</div>
            <div>
              <p className={css.statLabel}>Tasks Completed</p>
              <h2 className={css.statValue}>{tasksCompleted}</h2>
            </div>
          </div>

          <div className={css.statCard}>
            <div className={`${css.icon} ${css.orange}`}>🔥</div>
            <div>
              <p className={css.statLabel}>Current Streak</p>
              <h2 className={css.statValue}>{currentStreak} days</h2>
            </div>
          </div>

            <div className={css.statCard}>
            <div className={`${css.icon} ${css.green}`}>🏆</div>
            <div>
              <p className={css.statLabel}>Achievements</p>
              <h2 className={css.statValue}>
                {achievementsUnlocked}/{totalAchievements}
              </h2>
            </div>
          </div>

          <div className={css.statCard}>
            <div className={`${css.icon} ${css.pink}`}>📅</div>
            <div>
              <p className={css.statLabel}>Active Days</p>
              <h2 className={css.statValue}>{activeDays}</h2>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
