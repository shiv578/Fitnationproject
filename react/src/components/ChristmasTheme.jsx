import { useEffect, useState } from "react";
import "./ChristmasTheme.css";

export default function ChristmasTheme() {
  const [showSanta, setShowSanta] = useState(true);
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    // 🎁 Drop 2 gifts every 1 second (5 times = 10 gifts)
    let dropCount = 0;

    const giftInterval = setInterval(() => {
      dropCount++;

      setGifts(prev => [
        ...prev,
        { id: Date.now() + Math.random(), x: Math.random() * 60 + 20 },
        { id: Date.now() + Math.random(), x: Math.random() * 60 + 20 }
      ]);

      if (dropCount === 5) {
        clearInterval(giftInterval);
      }
    }, 1200);

    // 🎅 Remove Santa after full journey
    const santaTimer = setTimeout(() => {
      setShowSanta(false);
    }, 9000);

    return () => {
      clearInterval(giftInterval);
      clearTimeout(santaTimer);
    };
  }, []);

  return (
    <div className="christmas-engine">
      {/* 🌌 Aurora */}
      <div className="aurora" />

      {/* ❄ Snow */}
      {[...Array(30)].map((_, i) => (
        <div key={i} className="flake" />
      ))}

      {/* 🎅 Santa (ONE TIME ONLY) */}
      {showSanta && (
        <div className="santa-cinematic">
          <span className="sleigh-group">🦌 🦌 🛷 🎅</span>
        </div>
      )}

      {/* 🎁 Gifts */}
      {gifts.map(gift => (
        <div
          key={gift.id}
          className="gift-drop"
          style={{ left: `${gift.x}%` }}
        >
          🎁
        </div>
      ))}

      {/* ⛄ Static Snowman */}
      <div className="snowman-static">⛄</div>

      {/* 💡 Garland */}
      <div className="led-garland">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="led-node" />
        ))}
      </div>
    </div>
  );
}
