import { useState, useEffect } from "react";
import { getCharacters, getCharactersBySpecies } from "../services/api";

const useCharacters = (species = "", page = 1) => {
  const [characters, setCharacters] = useState([]);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = species
          ? await getCharactersBySpecies(species, page)
          : await getCharacters(page);

        setCharacters(data.results);
        setInfo(data.info);
      } catch (err) {
        setError(err.message);
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [species, page]);

  return { characters, info, loading, error };
};

export default useCharacters;