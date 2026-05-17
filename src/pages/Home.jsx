import { useState, useEffect, useRef, useCallback } from "react";
import CharacterModal from "../components/CharacterModal";
import "../styles/Home.css";

const POOL = [
  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
  16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,
];

const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));

const generateFloatVars = () => ({
  "--dx1": `${rand(-40, 40)}px`,
  "--dy1": `${rand(-40, 40)}px`,
  "--dx2": `${rand(-60, 60)}px`,
  "--dy2": `${rand(-50, 50)}px`,
  "--dx3": `${rand(-40, 40)}px`,
  "--dy3": `${rand(-60, 60)}px`,
  "--dx4": `${rand(-50, 50)}px`,
  "--dy4": `${rand(-40, 40)}px`,
  "--float-duration": `${rand(5, 12)}s`,
});

const Home = () => {
  const [characters, setCharacters]       = useState([]);
  const [positions, setPositions]         = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [cursorPos, setCursorPos]         = useState({ x: -200, y: -200 });
  const [smokeParticles, setSmokeParticles] = useState([]);
  const heroRef   = useRef(null);
  const smokeId   = useRef(0);
  const lastSmoke = useRef(0);

  // Cargar personajes y generar posiciones juntos
useEffect(() => {
  const fetchAll = async () => {
    const res  = await fetch(`https://rickandmortyapi.com/api/character/${POOL.join(",")}`);
    const data = await res.json();
    setCharacters(data);

    const generated = data.map(() => {
      const size = randInt(50, 80);
      return {
        top:       `${rand(5, 85)}%`,
        left:      `${rand(3, 92)}%`,
        size,
        floatVars: generateFloatVars(),
      };
    });
    setPositions(generated);
  };
  fetchAll();
}, []);

  // Cursor cohete
  const handleMouseMove = useCallback((e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });

    const now = Date.now();
    if (now - lastSmoke.current < 40) return;
    lastSmoke.current = now;

    const colors = ["#00ffb4", "#00cc90", "#aaaaaa", "#ffffff", "#4fc3f7"];
    const id = smokeId.current++;

    setSmokeParticles((prev) => [
      ...prev.slice(-18),
      {
        id,
        x: e.clientX + rand(-6, 6),
        y: e.clientY + rand(-6, 6),
        size: rand(6, 14),
        color: colors[randInt(0, colors.length)],
      },
    ]);
  }, []);

  // Rotar personajes cada 12 segundos
  useEffect(() => {
    if (characters.length === 0) return;
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((p) => ({
          ...p,
          floatVars: generateFloatVars(),
        }))
      );
    }, 12000);
    return () => clearInterval(interval);
  }, [characters]);

  return (
    <div className="home-hero" ref={heroRef} onMouseMove={handleMouseMove}>

      {/* Fondo estrellas */}
      <div className="stars" />
      <div className="stars2" />
      <div className="stars3" />

      {/* Cursor cohete */}
      <div
        className="rocket-cursor"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      >
        🚀
      </div>

      {/* Rastro de humo */}
      {smokeParticles.map((p) => (
        <div
          key={p.id}
          className="smoke-particle"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0.6,
          }}
        />
      ))}

      {/* Texto hero */}
      <div className="hero-text">
        <h1 className="hero-title">Rick & Morty</h1>
        <p className="hero-subtitle">Explora el multiverso y sus personajes</p>
      </div>

      {/* Personajes flotando */}
      {characters.map((char, i) => {
        const pos = positions[i];
        if (!pos) return null;
        return (
          <div
            key={char.id}
            className="floating-wrapper"
            style={{ top: pos.top, left: pos.left }}
            onClick={() => setSelectedCharacter(char)}
          >
            <img
              src={char.image}
              alt={char.name}
              className="floating-char fade-in"
              style={{
                width: pos.size,
                height: pos.size,
                ...pos.floatVars,
              }}
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