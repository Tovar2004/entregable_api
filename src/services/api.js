const BASE_URL = "https://rickandmortyapi.com/api";

export const getCharacters = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/character?page=${page}`);
  if (!response.ok) throw new Error("Error al obtener los personajes");
  const data = await response.json();
  return data;
};

export const getCharactersBySpecies = async (species, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/character?page=${page}&species=${species}`
  );
  if (!response.ok) throw new Error("Error al filtrar por especie");
  const data = await response.json();
  return data;
};

export const getCharacterById = async (id) => {
  const response = await fetch(`${BASE_URL}/character/${id}`);
  if (!response.ok) throw new Error("Personaje no encontrado");
  const data = await response.json();
  return data;
};