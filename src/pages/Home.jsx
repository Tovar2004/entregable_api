import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CharacterModal from "../components/CharacterModal";
import "../styles/Home.css";

const POOL = [
  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
  16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,
  31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,
  46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,
];

const VISIBLE_COUNT  = 20;
const SHUFFLED_POOL  = [...POOL].sort(() => 0.5 - Math.random());

const rand    = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));
const randVel = () => (Math.random() < 0.5 ? 1 : -1) * rand(0.04, 0.1);

const Home = () => {
  const [allChars, setAllChars]                   = useState({});
  const [slots, setSlots]                         = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [hoveredId, setHoveredId]                 = useState(null);
  const [cursorPos, setCursorPos]                 = useState({ x: -200, y: -200 });
  const [cursorVisible, setCursorVisible]         = useState(false);
  const [smokeParticles, setSmokeParticles]       = useState([]);

  const smokeId   = useRef(0);
  const lastSmoke = useRef(0);
  const animRefs  = useRef([]);
  const posRef    = useRef([]);
  const rafId     = useRef(null);
  const poolIndex = useRef(0);
  const poolQueue = useRef(SHUFFLED_POOL);
  const navigate  = useNavigate();

  const nextCharId = () => {
    const id = poolQueue.current[poolIndex.current % poolQueue.current.length];
    poolIndex.current++;
    return id;
  };

  const makePos = (slotId) => ({
    slotId,
    charId:  nextCharId(),
    x:       rand(2, 90),
    y:       rand(5, 88),
    vx:      randVel(),
    vy:      randVel(),
    size:    randInt(50, 78),
    opacity: 1,
    fading:  false,
  });

  useEffect(() => {
    const fetchAll = async () => {
      const res  = await fetch(`https://rickandmortyapi.com/api/character/${POOL.join(",")}`);
      const data = await res.json();
      const map  = {};
      data.forEach((c) => (map[c.id] = c));
      setAllChars(map);

      const initial = Array.from({ length: VISIBLE_COUNT }, (_, i) => makePos(i));
      posRef.current = initial;

      setSlots(initial.map((s) => ({
        slotId: s.slotId,
        charId: s.charId,
        size:   s.size,
        initX:  s.x,
        initY:  s.y,
      })));
    };
    fetchAll();
  }, []);

  // RAF
  useEffect(() => {
    if (posRef.current.length === 0) return;

    const animate = () => {
      posRef.current = posRef.current.map((p) => {
        if (p.fading) return p;
        let { x, y, vx, vy, size } = p;
        x += vx;
        y += vy;
        const maxX = 94 - (size / window.innerWidth)  * 100;
        const maxY = 92 - (size / window.innerHeight) * 100;
        if (x <= 1 || x >= maxX) vx = -vx;
        if (y <= 1 || y >= maxY) vy = -vy;
        x = Math.max(1, Math.min(x, maxX));
        y = Math.max(1, Math.min(y, maxY));
        return { ...p, x, y, vx, vy };
      });

      posRef.current.forEach((p, i) => {
        const el = animRefs.current[i];
        if (el) {
          el.style.left    = `${p.x}%`;
          el.style.top     = `${p.y}%`;
          el.style.opacity = p.opacity;
        }
      });

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [slots.length]);

  useEffect(() => {
    if (Object.keys(allChars).length === 0) return;

    const interval = setInterval(() => {
      const idx = posRef.current.findIndex(
        (p) => !p.fading &&
               p.charId !== selectedCharacter?.id &&
               p.charId !== hoveredId
      );
      if (idx === -1) return;

      posRef.current[idx] = { ...posRef.current[idx], fading: true };

      let opacity = 1;
      const fadeOut = setInterval(() => {
        opacity -= 0.05;
        posRef.current[idx] = { ...posRef.current[idx], opacity: Math.max(0, opacity) };
        if (opacity <= 0) {
          clearInterval(fadeOut);
          const newCharId = nextCharId();
          const newSize   = randInt(50, 78);
          posRef.current[idx] = {
            ...posRef.current[idx],
            charId:  newCharId,
            x:       rand(2, 90),
            y:       rand(5, 88),
            vx:      randVel(),
            vy:      randVel(),
            size:    newSize,
            opacity: 0,
            fading:  false,
          };
          let opIn = 0;
          const fadeIn = setInterval(() => {
            opIn += 0.05;
            posRef.current[idx] = { ...posRef.current[idx], opacity: Math.min(1, opIn) };
            if (opIn >= 1) {
              clearInterval(fadeIn);
              setSlots((prev) =>
                prev.map((s) =>
                  s.slotId === idx
                    ? { ...s, charId: newCharId, size: newSize }
                    : s
                )
              );
            }
          }, 30);
        }
      }, 30);
    }, 4000);

    return () => clearInterval(interval);
  }, [allChars, selectedCharacter, hoveredId]);

  const handleMouseMove = useCallback((e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    const now = Date.now();
    if (now - lastSmoke.current < 40) return;
    lastSmoke.current = now;
    const colors = ["#00ffb4", "#00cc90", "#aaaaaa", "#ffffff", "#4fc3f7"];
    setSmokeParticles((prev) => [
      ...prev.slice(-18),
      {
        id:    smokeId.current++,
        x:     e.clientX + rand(-6, 6),
        y:     e.clientY + rand(-6, 6),
        size:  rand(6, 14),
        color: colors[randInt(0, colors.length)],
      },
    ]);
  }, []);

  return (
    <div
      className="home-hero"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursorVisible(true)}
      onMouseLeave={() => { setCursorVisible(false); setSmokeParticles([]); }}
    >
      <div className="stars" />
      <div className="stars2" />
      <div className="stars3" />

      {cursorVisible && (
        <div className="rocket-cursor" style={{ left: cursorPos.x, top: cursorPos.y }}>
          🚀
        </div>
      )}

      {cursorVisible && smokeParticles.map((p) => (
        <div
          key={p.id}
          className="smoke-particle"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size, background: p.color }}
        />
      ))}

      <div className="hero-text">
        <h1 className="hero-title" onClick={() => navigate("/characters")}>
          Rick & Morty
        </h1>
      </div>

      {slots.map((slot, i) => {
        const char      = allChars[slot.charId];
        if (!char) return null;
        const isHovered = hoveredId === char.id;
        return (
          <div
            key={slot.slotId}
            ref={(el) => { animRefs.current[i] = el; }}
            className={`floating-wrapper ${isHovered ? "is-hovered" : ""}`}
            style={{ left: `${slot.initX}%`, top: `${slot.initY}%` }}
            onMouseEnter={() => setHoveredId(char.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedCharacter(char)}
          >
            <img
              src={char.image}
              alt={char.name}
              className="floating-char"
              style={{ width: slot.size, height: slot.size }}
            />
            <div className="float-tooltip">{char.name}</div>
          </div>
        );
      })}

      <CharacterModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />
    </div>
  );
};

export default Home;