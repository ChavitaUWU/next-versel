"use client";

import React, { useEffect, useState } from "react";

// Tipos Pokémon
type PokemonListItem = { name: string; url: string };
type PokemonDetail = {
  name: string;
  sprites: { front_default: string };
  height: number;
  weight: number;
  types: { type: { name: string } }[];
};

// Tipos Rick & Morty
type RMCharacter = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
};

export default function Page() {
  // Pokémon
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonListItem[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null);
  const [searchPokemon, setSearchPokemon] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [filterType, setFilterType] = useState("");

  // Rick & Morty
  const [rmCharacters, setRMCharacters] = useState<RMCharacter[]>([]);
  const [selectedRM, setSelectedRM] = useState<RMCharacter | null>(null);
  const [searchRM, setSearchRM] = useState("");

  // Cargar listas
  useEffect(() => {
    const fetchPoke = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data = await res.json();
      setPokemonList(data.results);
      setFilteredPokemon(data.results);
    };

    const fetchTypes = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/type");
      const data = await res.json();
      const valid = data.results
        .map((t: { name: string }) => t.name)
        .filter((n: string) => !["unknown", "shadow"].includes(n));
      setTypes(valid);
    };

    const fetchRM = async () => {
      const res = await fetch("https://rickandmortyapi.com/api/character");
      const data = await res.json();
      setRMCharacters(data.results.slice(0, 50));
    };

    fetchPoke();
    fetchTypes();
    fetchRM();
  }, []);

  // Filtro Pokémon
  useEffect(() => {
    const filter = async () => {
      let filtered = pokemonList.filter((p) =>
        p.name.toLowerCase().includes(searchPokemon.toLowerCase())
      );

      if (filterType) {
        const result = await Promise.all(
          filtered.map(async (p) => {
            const res = await fetch(p.url);
            const data = await res.json();
            const matches = data.types.some(
              (t: any) => t.type.name === filterType
            );
            return matches ? p : null;
          })
        );
        filtered = result.filter(Boolean) as PokemonListItem[];
      }

      setFilteredPokemon(filtered);
    };

    filter();
  }, [searchPokemon, filterType, pokemonList]);

  const selectPokemon = async (url: string) => {
    const res = await fetch(url);
    const data = await res.json();
    setSelectedPokemon(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-200 via-white to-purple-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Pokédex Regional Kanto / Rick & Morty Explorer
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pokédex */}
        <div className="bg-yellow-100 p-4 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-3 text-center">Pokédex de Kanto</h2>

          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <input
              type="text"
              placeholder="Buscar Pokémon..."
              className="px-3 py-2 rounded border w-full"
              value={searchPokemon}
              onChange={(e) => setSearchPokemon(e.target.value)}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded border w-full"
            >
              <option value="">Todos los tipos</option>
              {types.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex">
            <ul className="w-1/2 max-h-[500px] overflow-y-auto pr-3 space-y-1">
              {filteredPokemon.map((p, i) => (
                <li
                  key={i}
                  onClick={() => selectPokemon(p.url)}
                  className="cursor-pointer hover:bg-red-300 px-2 py-1 rounded capitalize"
                >
                  {i + 1}. {p.name}
                </li>
              ))}
            </ul>

            {selectedPokemon && (
              <div className="w-1/2 text-center bg-blue-100 rounded p-3 shadow-inner">
                <img
                  src={selectedPokemon.sprites.front_default}
                  alt={selectedPokemon.name}
                  className="mx-auto mb-2 w-24 h-24"
                />
                <h3 className="text-lg font-bold capitalize">{selectedPokemon.name}</h3>
                <p className="text-sm text-gray-700">
                  Altura: {selectedPokemon.height / 10} m <br />
                  Peso: {selectedPokemon.weight / 10} kg
                </p>
                <div className="mt-2">
                  {selectedPokemon.types.map((t, i) => (
                    <span
                      key={i}
                      className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded m-1 inline-block"
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rick & Morty */}
        <div className="bg-purple-100 p-4 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-3 text-center">Personajes Rick & Morty</h2>

          <input
            type="text"
            placeholder="Buscar personaje..."
            className="mb-3 px-3 py-2 rounded border w-full"
            value={searchRM}
            onChange={(e) => setSearchRM(e.target.value)}
          />

          <div className="flex">
            <ul className="w-1/2 max-h-[500px] overflow-y-auto pr-3 space-y-1">
              {rmCharacters
                .filter((char) =>
                  char.name.toLowerCase().includes(searchRM.toLowerCase())
                )
                .map((char) => (
                  <li
                    key={char.id}
                    onClick={() => setSelectedRM(char)}
                    className="cursor-pointer hover:bg-purple-300 px-2 py-1 rounded capitalize"
                  >
                    {char.name}
                  </li>
                ))}
            </ul>
            {selectedRM && (
              <div className="w-1/2 text-center bg-green-300 rounded p-3 shadow-inner">
                <img
                  src={selectedRM.image}
                  alt={selectedRM.name}
                  className="mx-auto mb-2 w-24 h-24 rounded-full"
                />
                <h3 className="text-lg font-bold capitalize">{selectedRM.name}</h3>
                <p className="text-sm text-gray-700">
                  Especie: {selectedRM.species} <br />
                  Estado: {selectedRM.status}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
