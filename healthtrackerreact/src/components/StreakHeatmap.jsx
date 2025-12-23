import { useEffect, useState } from "react";
import css from "./StreakHeatmap.module.css";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const StreakHeatmap = ({ userId, refresh }) => {
  const [monthsData, setMonthsData] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/challenge/streak/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) return;

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
      });
  }, [userId, refresh]);

  return (
    <div className={css.container}>
      <div className={css.header}>
      </div>

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
