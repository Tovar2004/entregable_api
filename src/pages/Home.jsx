import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CharacterModal from "../components/CharacterModal";
import "../styles/Home.css";

const ORBIT_CONFIG = [
  { ids: [1, 2, 3, 4, 5, 6],           radius: 130, duration: 15, size: 65 },
  { ids: [7, 8, 9, 10, 11, 12, 13],    radius: 220, duration: 25, size: 60 },
  { ids: [14,15,16,17,18,19,20,21],    radius: 315, duration: 35, size: 55 },
  { ids: [22,23,24,25,26,27,28,29,30], radius: 410, duration: 45, size: 50 },
];

// Pool extendido de personajes para rotación
const POOL = [
  [1,2,3,4,5,6,31,32,33,34,35,36],
  [7,8,9,10,11,12,13,37,38,39,40,41,42],
  [14,15,16,17,18,19,20,21,43,44,45,46,47,48],
  [22,23,24,25,26,27,28,29,30,49,50,51,52,53,54,55],
];

const Home = () => {
  const [allChars, setAllChars] = useState({});
  const [visibleIds, setVisibleIds] = useState(ORBIT_CONFIG.map((o) => [...o.ids]));
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const poolIndexRef = useRef(ORBIT_CONFIG.map((o) => o.ids.length));

  // Cargar todos los personajes del pool de una vez
  useEffect(() => {
    const allPoolIds = [...new Set(POOL.flat())];
    const fetchAll = async () => {
      const res = await fetch(
        `https://rickandmortyapi.com/api/character/${allPoolIds.join(",")}`
      );
      const data = await res.json();
      const map = {};
      data.forEach((c) => (map[c.id] = c));
      setAllChars(map);
    };
    fetchAll();
  }, []);

  // Rotación cada 10 segundos por órbita
  useEffect(() => {
    const intervals = ORBIT_CONFIG.map((orbitConf, orbitIndex) => {
      return setInterval(() => {
        setVisibleIds((prev) => {
          const pool = POOL[orbitIndex];
          const count = orbitConf.ids.length;

          // Siguientes IDs del pool
          let startIdx = poolIndexRef.current[orbitIndex];
          const nextIds = [];
          for (let i = 0; i < count; i++) {
            nextIds.push(pool[(startIdx + i) % pool.length]);
          }
          poolIndexRef.current[orbitIndex] = (startIdx + count) % pool.length;

          const updated = [...prev];
          updated[orbitIndex] = nextIds;
          return updated;
        });
      }, 10000 + orbitIndex * 2000);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const renderOrbit = (orbitIndex) => {
    const { radius, duration, size } = ORBIT_CONFIG[orbitIndex];
    const ringSize = radius * 2 + size;
    const ids = visibleIds[orbitIndex] || [];
    const chars = ids.map((id) => allChars[id]).filter(Boolean);

    return (
      <div key={orbitIndex}>
        <div
          className="orbit-ring"
          style={{ width: `${ringSize}px`, height: `${ringSize}px` }}
        />
        {chars.map((char, index) => {
          const angle = (360 / chars.length) * index;
          const delay = -(index * (duration / chars.length));
          return (
            <div
              key={`${orbitIndex}-${char.id}`}
              className={`orbit-item ${paused ? "paused" : ""}`}
              style={{
                "--angle": `${angle}deg`,
                "--delay": `${delay}s`,
                "--radius": `${radius}px`,
                "--duration": `${duration}s`,
                "--size": `${size}px`,
                width: `${size}px`,
                height: `${size}px`,
                marginTop: `-${size / 2}px`,
                marginLeft: `-${size / 2}px`,
              }}
              onClick={() => setSelectedCharacter(char)}
            >
              <div className="orbit-avatar fade-in">
                <img src={char.image} alt={char.name} />
                <div className="orbit-tooltip">{char.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="home-hero">
      <div className="stars" />
      <div className="stars2" />
      <div className="stars3" />

      <div className="hero-text">
        <h1 className="hero-title">Rick & Morty</h1>
        <p className="hero-subtitle">Explora el multiverso y sus personajes</p>
      </div>

      <div
        className="orbit-scene"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="planet"
          onClick={() => navigate("/characters")}
          title="Ver todos los personajes"
        >
          <span>🌍</span>    
        </div>

        {ORBIT_CONFIG.map((_, i) => renderOrbit(i))}
      </div>

      <CharacterModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />
    </div>
  );
};

export default Home;