import { useState } from "react";
import useCharacters from "../hooks/useCharacters";
import CharacterCard from "../components/CharacterCard";
import CharacterModal from "../components/CharacterModal";
import FilterDropdown from "../components/FilterDropdown";
import Loader from "../components/Loader";
import "../styles/Characters.css";

const speciesLabels = {
  "": "Todos los Personajes",
  "Human": "👨 Humanos",
  "Alien": "👽 Aliens",
  "Robot": "🤖 Robots",
  "Mythological Creature": "🧙 Criaturas Mitológicas",
  "Animal": "🐾 Animales",
  "Cronenberg": "🧟 Cronenbergs",
  "Disease": "🦠 Enfermedades",
  "Unknown": "❓ Desconocidos",
};

const Characters = () => {
  const [page, setPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState("");

  const { characters, info, loading, error } = useCharacters(selectedSpecies, page);

  const handleSpeciesSelect = (species) => {
    setSelectedSpecies(species);
    setPage(1);
  };

  return (
    <div className="characters-container">
      <h1 className="characters-title">{speciesLabels[selectedSpecies]}</h1>

      <FilterDropdown
        selectedSpecies={selectedSpecies}
        onSelect={handleSpeciesSelect}
      />

      {loading && <Loader />}
      {error && <p className="error-message">⚠️ {error}</p>}

      {!loading && !error && (
        <>
          <div className="cards-grid">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={setSelectedCharacter}
              />
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={!info.prev}
            >
              ◀ Anterior
            </button>
            <span>Página {page} de {info.pages}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!info.next}
            >
              Siguiente ▶
            </button>
          </div>
        </>
      )}

      <CharacterModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />
    </div>
  );
};

export default Characters;