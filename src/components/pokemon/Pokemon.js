import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';

const TYPE_COLORS = {
  bug: 'B1C12E',
  dark: '4F3A2D',
  dragon: '755EDF',
  electric: 'FCBC17',
  fairy: 'F4B1F4',
  fighting: '823551D',
  fire: 'E73B0C',
  flying: 'A3B3F7',
  ghost: '6060B2',
  grass: '74C236',
  ground: 'D3B357',
  ice: 'A3E7FD',
  normal: 'C8C4BC',
  poison: '934594',
  psychic: 'ED4882',
  rock: 'B9A156',
  steel: 'B5B5C3',
  water: '3295F6'
};

export default class Pokemon extends Component {
  state = {
    name: '',
    pokemonIndex: '',
    imageUrl: '',
    types: [],
    description: '',
    stats: {},
    height: '',
    weight: '',
    eggGroups: '',
    catchRate: '',
    abilities: '',
    genderRatioMale: '',
    genderRatioFemale: '',
    evs: '',
    hatchSteps: '',
    themeColor: '#EF5350'
  };

  async componentDidMount() {
    const { pokemonIndex } = this.props.match.params;
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

    const pokemonRes = await Axios.get(pokemonUrl);
    const name = pokemonRes.data.name;
    const imageUrl = pokemonRes.data.sprites.front_default;

    let stats = {};
    pokemonRes.data.stats.forEach(stat => {
      stats = { ...stats, [stat.stat.name]: stat.base_stat };
    });

    const height = Math.round((pokemonRes.data.height * 0.328084 + 0.00001) * 100) / 100;
    const weight = Math.round((pokemonRes.data.weight * 0.220462 + 0.00001) * 100) / 100;
    const types = pokemonRes.data.types.map(type => type.type.name);
    const themeColor = `#${TYPE_COLORS[types[types.length - 1]]}`;

    const abilities = pokemonRes.data.abilities
      .map(ability => ability.ability.name
        .toLowerCase()
        .split('-')
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
      )
      .join(', ');

    let description = '';
    let genderRatioFemale = '';
    let genderRatioMale = '';
    let catchRate = '';
    let eggGroups = '';
    let hatchSteps = '';

    await Axios.get(pokemonSpeciesUrl).then(res => {
      res.data.flavor_text_entries.some(flavor => {
        if (flavor.language.name === 'en') {
          description = flavor.flavor_text;
          return true;
        }
        return false;
      });

      const femaleRate = res.data['gender_rate'];
      genderRatioFemale = 12.5 * femaleRate;
      genderRatioMale = 12.5 * (8 - femaleRate);

      catchRate = Math.round((100 / 255) * res.data['capture_rate']);

      eggGroups = res.data['egg_groups']
        .map(group => group.name
          .toLowerCase()
          .split(' ')
          .map(s => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ')
        )
        .join(', ');

      hatchSteps = 255 * (res.data['hatch_counter'] + 1);
    });

    this.setState({
      name,
      pokemonIndex,
      imageUrl,
      types,
      stats,
      height,
      weight,
      abilities,
      description,
      genderRatioFemale,
      genderRatioMale,
      catchRate,
      eggGroups,
      hatchSteps,
      themeColor
    });
  }

  render() {
    const {
      name,
      pokemonIndex,
      imageUrl,
      types,
      stats,
      height,
      weight,
      abilities,
      description,
      genderRatioFemale,
      genderRatioMale,
      catchRate,
      eggGroups,
      hatchSteps,
      themeColor
    } = this.state;

    return (
      <div className="col">
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-5">
                <h5>{pokemonIndex}</h5>
              </div>
              <div className="col-7">
                <div className="float-right">
                  {types.map(type => (
                    <span
                      key={type}
                      className="badge badge-pill mr-1"
                      style={{ backgroundColor: `#${TYPE_COLORS[type]}`, color: 'white' }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-3">
                <img src={imageUrl} className="card-img-top rounded mx-auto mt-2" alt={name} />
              </div>
              <div className="col-md-9">
                <h4 className="mx-auto">{name.charAt(0).toUpperCase() + name.slice(1)}</h4>
                {Object.entries(stats).map(([statName, statValue]) => (
                  <div className="row align-items-center" key={statName}>
                    <div className="col-12 col-md-3">{statName.toUpperCase()}</div>
                    <div className="col-12 col-md-9">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${statValue}%`,
                            backgroundColor: themeColor
                          }}
                          aria-valuenow={statValue}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{statValue}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="row mt-1">
              <div className="col">
                <p className="">{description}</p>
              </div>
            </div>
          </div>
          <hr />
          <div className="card-body">
            <h5 className="card-title text-center">Profile</h5>
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-6">
                    <h6 className="float-right">Height:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{height} ft.</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Weight:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{weight} lbs</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Catch Rate:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{catchRate}%</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Gender Ratio:</h6>
                  </div>
                  <div className="col-6">
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${genderRatioFemale}%`,
                          backgroundColor: '#c2185b'
                        }}
                        aria-valuenow={genderRatioFemale}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{genderRatioFemale}</small>
                      </div>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${genderRatioMale}%`,
                          backgroundColor: '#1976d2'
                        }}
                        aria-valuenow={genderRatioMale}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{genderRatioMale}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-6">
                    <h6 className="float-right">Egg Groups:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{eggGroups} </h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Hatch Steps:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{hatchSteps}</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-right">Abilities:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{abilities}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer text-muted">
            <Link to="/" className="card-link">
              <button className="btn btn-primary">Back</button>
            </Link>
          </div>
        </div>

      </div>

    );
  }
}
