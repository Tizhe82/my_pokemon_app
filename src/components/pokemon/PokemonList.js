import React, { Component } from 'react';
import PokemonCard from './PokemonCard';
import Loading from '../layout/Loading';
import axios from 'axios';
import SearchBar from '../search/SearchBar';

export default class PokemonList extends Component {
  state = {
    url: 'https://pokeapi.co/api/v2/pokemon/',
    pokemon: null,
    searchQuery: ''
  };

  async componentDidMount() {
    const res = await axios.get(this.state.url);
    this.setState({ pokemon: res.data['results'] });
  }

  handleSearch = searchQuery => {
    this.setState({ searchQuery });
  };

  render() {
    const { pokemon, searchQuery } = this.state;

    // Filter the Pokemon based on the search query
    const filteredPokemon = pokemon ? pokemon.filter(p => p.name.includes(searchQuery.toLowerCase())) : [];

    return (
      <div>
        <SearchBar onSearch={this.handleSearch} />
        {pokemon ? (
          <div className="row">
            {filteredPokemon.map(pokemon => (
              <PokemonCard
                key={pokemon.name}
                name={pokemon.name}
                url={pokemon.url}
              />
            ))}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}
