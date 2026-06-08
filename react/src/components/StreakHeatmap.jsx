 import { useEffect, useState } from "react";
      import css from "./StreakHeatmap.module.css";

const API_BASE = import.meta.env.VITE_API_URL;
 //
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const StreakHeatmap = ({ userId, refresh }) => {
  const [monthsData, setMonthsData] = useState([]);

  useEffect(() => {
    if (!userId || !API_BASE) return;

    fetch(`${API_BASE}/api/challenge/streak/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success || !Array.isArray(data.days)) return;

        const map = {};

        data.days.forEach(d => {
          const date = new Date(d.date);
          const month = date.getMonth();

          if (!map[month]) map[month] = [];
          map[month].push(d);
        });

                const result = Object.keys(map).map(m => ({
          month: MONTHS[m],
          days: map[m]
        }));

        setMonthsData(result);
      })
      .catch(err => console.error("Streak fetch error", err));
  }, [userId, refresh, API_BASE]);

  return (
    <div className={css.container}>
      <div className={css.header}></div>

      <div className={css.months}>
        {monthsData.map((m, idx) => (
          <div key={idx} className={css.monthColumn}>
            <div className={css.grid}>
              {m.days.map((d, i) => (
                <div
                  key={i}
                  className={`${css.cell} ${d.completed ? css.active : ""}`}
                  title={d.date}
                />
              ))}
            </div>
            <div className={css.monthLabel}>{m.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreakHeatmap;
