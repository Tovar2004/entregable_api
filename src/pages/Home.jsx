import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CharacterModal from "../components/CharacterModal";
import "../styles/Home.css";

const POOL = [
  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
  16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,
];

const rand    = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));

const Home = () => {
  const [characters, setCharacters]               = useState([]);
  const [positions, setPositions]                 = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [cursorPos, setCursorPos]                 = useState({ x: -200, y: -200 });
  const [cursorVisible, setCursorVisible]         = useState(false);
  const [smokeParticles, setSmokeParticles]       = useState([]);
  const smokeId   = useRef(0);
  const lastSmoke = useRef(0);
  const navigate  = useNavigate();
  const animRefs  = useRef([]);

  // Cargar personajes
  useEffect(() => {
    const fetchAll = async () => {
      const res  = await fetch(`https://rickandmortyapi.com/api/character/${POOL.join(",")}`);
      const data = await res.json();
      setCharacters(data);

      // Posición y velocidad inicial aleatoria para cada personaje
      const generated = data.map(() => ({
        x:    rand(3, 90),   // % del ancho
        y:    rand(5, 88),   // % del alto
        vx:   (Math.random() < 0.5 ? 1 : -1) * rand(0.03, 0.09),
        vy:   (Math.random() < 0.5 ? 1 : -1) * rand(0.03, 0.09),
        size: randInt(50, 78),
      }));
      setPositions(generated);
    };
    fetchAll();
  }, []);

  // Animación de burbuja con requestAnimationFrame
  useEffect(() => {
    if (positions.length === 0) return;

    let current = positions.map((p) => ({ ...p }));
    let rafId;

    const animate = () => {
      current = current.map((p) => {
        let { x, y, vx, vy, size } = p;
        x += vx;
        y += vy;

        // Rebotar en los bordes
        const maxX = 95 - (size / window.innerWidth) * 100;
        const maxY = 93 - (size / window.innerHeight) * 100;

        if (x <= 1 || x >= maxX) vx = -vx;
        if (y <= 1 || y >= maxY) vy = -vy;

        x = Math.max(1, Math.min(x, maxX));
        y = Math.max(1, Math.min(y, maxY));

        return { ...p, x, y, vx, vy };
      });

      // Actualizar DOM directo para máximo rendimiento
      current.forEach((p, i) => {
        const el = animRefs.current[i];
        if (el) {
          el.style.left = `${p.x}%`;
          el.style.top  = `${p.y}%`;
        }
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [positions.length]);

  // Cursor cohete
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

  const handleMouseEnter = () => setCursorVisible(true);
  const handleMouseLeave = () => {
    setCursorVisible(false);
    setSmokeParticles([]);
  };

  return (
    <div
      className="home-hero"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="stars" />
      <div className="stars2" />
      <div className="stars3" />

      {/* Cursor cohete — desaparece con modal abierto */}
      {cursorVisible && !selectedCharacter && (
        <div className="rocket-cursor" style={{ left: cursorPos.x, top: cursorPos.y }}>
          🚀
        </div>
      )}

      {/* Rastro humo — desaparece con modal abierto */}
      {cursorVisible && !selectedCharacter && smokeParticles.map((p) => (
        <div
          key={p.id}
          className="smoke-particle"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size, background: p.color }}
        />
      ))}

      {/* Título */}
      <div className="hero-text">
        <h1 className="hero-title" onClick={() => navigate("/characters")}>
          Rick & Morty
        </h1>
      </div>

      {/* Personajes flotando como burbujas */}
      {characters.map((char, i) => {
        const pos = positions[i];
        if (!pos) return null;
        return (
          <div
            key={char.id}
            ref={(el) => (animRefs.current[i] = el)}
            className="floating-wrapper"
            style={{
              left:     `${pos.x}%`,
              top:      `${pos.y}%`,
              position: "absolute",
            }}
            onClick={() => setSelectedCharacter(char)}
          >
            <img
              src={char.image}
              alt={char.name}
              className="floating-char"
              style={{ width: pos.size, height: pos.size }}
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