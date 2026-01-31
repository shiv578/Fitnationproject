import { useMemo, useEffect } from "react";
import "./WinterEffect.css";

export default function WinterEffect() {

  useEffect(() => {
    document.body.classList.add("winter-mode");
    return () => document.body.classList.remove("winter-mode");
  }, []);

  const createSnow = (count, minSize, maxSize) =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * (maxSize - minSize) + minSize,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      drift: Math.random() * 80 - 40
    }));

  const farSnow = useMemo(() => createSnow(40, 4, 6), []);
  const midSnow = useMemo(() => createSnow(60, 6, 10), []);
  const nearSnow = useMemo(() => createSnow(40, 10, 16), []);

  return (
    <>
      {/* Status */}
      <div className="winterLabel">❄ Winter Mode</div>

      {/* Atmosphere */}
      <div className="winter-glow" />
      <div className="winter-fog" />
      <div className="frost-border" />

      {/* Snow layers */}
      <div className="snow-layer far">
        {farSnow.map(f => (
          <span
            key={f.id}
            className="snowflake"
            style={{
              left: `${f.left}%`,
              fontSize: `${f.size}px`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              "--drift": `${f.drift}px`
            }}
          >
            ❄
          </span>
        ))}
      </div>

      <div className="snow-layer mid">
        {midSnow.map(f => (
          <span
            key={f.id}
            className="snowflake"
            style={{
              left: `${f.left}%`,
              fontSize: `${f.size}px`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              "--drift": `${f.drift}px`
            }}
          >
            ❅
          </span>
        ))}
      </div>

      <div className="snow-layer near">
        {nearSnow.map(f => (
          <span
            key={f.id}
            className="snowflake"
            style={{
              left: `${f.left}%`,
              fontSize: `${f.size}px`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              "--drift": `${f.drift}px`
            }}
          >
            ❄
          </span>
        ))}
      </div>
    </>
  );
}
