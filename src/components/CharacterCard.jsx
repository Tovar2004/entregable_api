import "../styles/CharacterCard.css";

const CharacterCard = ({ character, onClick }) => {
  const { name, image, species, status, gender } = character;

  const statusColor = {
    Alive: "#00ffb4",
    Dead: "#ff6b6b",
    unknown: "#aaaaaa",
  };

  return (
    <div className="card" onClick={() => onClick(character)}>
      <div className="card-image-wrapper">
        <img src={image} alt={name} className="card-image" />
      </div>
      <div className="card-body">
        <h3 className="card-name">{name}</h3>
        <p>
          <span
            className="status-dot"
            style={{ backgroundColor: statusColor[status] || "#aaa" }}
          ></span>
          {status}
        </p>
        <p>🧬 {species}</p>
        <p>⚧ {gender}</p>
      </div>
    </div>
  );
};

export default CharacterCard;