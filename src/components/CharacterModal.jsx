import { useEffect } from "react";
import "../styles/CharacterModal.css";

const statusConfig = {
  Alive:   { color: "#00ffb4", icon: "💚", label: "Vivo" },
  Dead:    { color: "#ff6b6b", icon: "💀", label: "Muerto" },
  unknown: { color: "#aaaaaa", icon: "❓", label: "Desconocido" },
};

const CharacterModal = ({ character, onClose }) => {
  const st = statusConfig[character?.status] || statusConfig.unknown;

  useEffect(() => {
    if (!character) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [character, onClose]);

  if (!character) return null;

  const { name, image, species, gender, origin, location, episode, type } = character;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <div className="modal-bg-glow" style={{ "--glow-color": st.color }} />

        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <div className="modal-image-wrapper">
            <div className="modal-image-ring" style={{ "--ring-color": st.color }}>
              <img src={image} alt={name} className="modal-image" />
            </div>
            <div className="modal-status-badge" style={{ background: st.color }}>
              {st.icon} {st.label}
            </div>
          </div>

          <div className="modal-title-section">
            <h2 className="modal-name">{name}</h2>
            <div className="modal-tags">
              <span className="tag tag-species">🧬 {species}</span>
              {type && <span className="tag tag-type">🔬 {type}</span>}
              <span className="tag tag-gender">⚧ {gender}</span>
            </div>
          </div>
        </div>

        <div className="modal-divider">
          <span className="divider-icon">🛸</span>
        </div>

        <div className="modal-info-grid">
          <div className="modal-info-card" style={{ "--card-accent": "#4fc3f7" }}>
            <div className="info-icon">🌍</div>
            <div className="info-content">
              <span className="info-label">Origen</span>
              <span className="info-value">{origin.name}</span>
            </div>
          </div>

          <div className="modal-info-card" style={{ "--card-accent": "#ce93d8" }}>
            <div className="info-icon">📍</div>
            <div className="info-content">
              <span className="info-label">Última ubicación</span>
              <span className="info-value">{location.name}</span>
            </div>
          </div>

          <div className="modal-info-card" style={{ "--card-accent": "#ffb74d" }}>
            <div className="info-icon">🎬</div>
            <div className="info-content">
              <span className="info-label">Episodios</span>
              <span className="info-value info-big">
                {episode.length} <span className="info-sub">apariciones</span>
              </span>
            </div>
          </div>

          <div className="modal-info-card" style={{ "--card-accent": st.color }}>
            <div className="info-icon">{st.icon}</div>
            <div className="info-content">
              <span className="info-label">Estado</span>
              <span className="info-value" style={{ color: st.color }}>{st.label}</span>
            </div>
          </div>
        </div>

        <div className="modal-episode-bar">
          <span className="episode-bar-label">Popularidad en episodios</span>
          <div className="episode-bar-track">
            <div
              className="episode-bar-fill"
              style={{
                width: `${Math.min((episode.length / 51) * 100, 100)}%`,
                background: `linear-gradient(90deg, ${st.color}, #ffffff33)`,
              }}
            />
          </div>
          <span className="episode-bar-pct">
            {Math.round((episode.length / 51) * 100)}%
          </span>
        </div>

      </div>
    </div>
  );
};

export default CharacterModal;