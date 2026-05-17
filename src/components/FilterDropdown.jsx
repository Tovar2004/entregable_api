import { useState } from "react";
import "../styles/FilterDropdown.css";

const SPECIES = [
  { label: "🌍 Todos", value: "" },
  { label: "👨 Human", value: "Human" },
  { label: "👽 Alien", value: "Alien" },
  { label: "🤖 Robot", value: "Robot" },
  { label: "🧙 Mythological Creature", value: "Mythological Creature" },
  { label: "🐾 Animal", value: "Animal" },
  { label: "🧟 Cronenberg", value: "Cronenberg" },
  { label: "🦠 Disease", value: "Disease" },
  { label: "❓ Unknown", value: "Unknown" },
];

const FilterDropdown = ({ selectedSpecies, onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value) => {
    onSelect(value);
    setOpen(false);
  };

  const currentLabel = SPECIES.find((s) => s.value === selectedSpecies)?.label || "🌍 Todos";

  return (
    <div className="filter-wrapper">
      <button
        className={`filter-btn ${open ? "filter-btn-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="filter-btn-icon">🔬</span>
        <span>Filtrar: {currentLabel}</span>
        <span className={`filter-arrow ${open ? "arrow-up" : ""}`}>▼</span>
      </button>

      <div className={`filter-dropdown ${open ? "dropdown-open" : ""}`}>
        {SPECIES.map((species) => (
          <button
            key={species.value}
            className={`dropdown-item ${selectedSpecies === species.value ? "item-active" : ""}`}
            onClick={() => handleSelect(species.value)}
          >
            {species.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterDropdown;