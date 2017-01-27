import React from 'react';
import { If, Then, Else } from 'react-if';
import { Pagination } from 'react-bootstrap';
import Link from 'next/link';

import axios from 'axios';
import _ from 'lodash';

import Layout from '../components/layout';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      empty: false,
      query: '',
      artists: [],
      limit: 5,
      page: 1,
      total: -1,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getArtistThumbnail = this.getArtistThumbnail.bind(this);
    this.getArtistGenres = this.getArtistGenres.bind(this);
    this.renderResultsList = this.renderResultsList.bind(this);
  }
  handleChange(event) {
    let obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  }
  handleSelect(page) {
    this.setState({page: page}, this.fetchData);
  }
  handleSubmit(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({page: 1}, this.fetchData);
  }
  fetchData() {
    if (this.state.query.length > 3) {
      this.setState({loading: true}, () => {
        axios.get('/api/search', {
          params: {
            query: this.state.query,
            limit: this.state.limit,
            offset: this.state.page - 1
          }
        })
        .then((response) => {
          const { artists } = response.data;
          this.setState({
            artists: artists.items,
            limit: artists.limit,
            page: artists.offset + 1,
            total: artists.total,
            empty: artists.total === 0,
            loading: false
          });
        })
        .catch((error) => {
          this.setState({loading: false});
        });
      });
    }
  }
  getArtistThumbnail(artist) {
    if (!_.has(artist, 'images')) {
      return 'http://placehold.it/64x64';
    }
    return _.get(_.last(artist.images), 'url', 'http://placehold.it/64x64');
  }
  getArtistGenres(artist) {
    return _.join(artist.genres, ', ');
  }
  renderResultsList() {
    const { loading, empty, query, artists, limit, page, total } = this.state;
    if (loading || empty) {
      let alert;
      if (loading) {
        alert = (<div className='alert alert-info'>Recherche en cours...</div>);
      } else if (empty) {
        alert = (<div className='alert alert-warning'>Aucun résultat correspondant à votre recherche <mark>{ query }</mark>.</div>);
      }
      return (
        <div className='container'>
          { alert }
        </div>
      );
    }
    let pagination = '';
    const list = _.map(artists, (artist) => {
      return (
        <div className='media' key={artist.id}>
          <div className='media-left'>
            <Link href={'/artist?id=' + artist.id} as={'/artist/' + artist.id}>
              <a><img className='media-object' src={this.getArtistThumbnail(artist)} width="64" alt='*' /></a>
            </Link>
          </div>
          <div className='media-body'>
            <h4 className='media-heading'>
              <Link href={'/artist?id=' + artist.id} as={'/artist/' + artist.id}><a>{artist.name}</a></Link>
            </h4>
              {this.getArtistGenres(artist)}<br />
            <a href={artist.external_urls.spotify}>{artist.external_urls.spotify}</a>
          </div>
        </div>
      );
    });

    if (total > limit) {
      pagination = (
        <div className='text-center'>
          <Pagination
            ellipsis first last next prev
            bsSize='medium'
            maxButtons={5}
            items={Math.ceil(total / limit)}
            activePage={page}
            onSelect={this.handleSelect} />
        </div>
      );
    }

    return (
      <div className='container'>
        { list }
        { pagination }
      </div>
    );
  }
  render() {
    return (
      <Layout title={ 'Recherche' }>
        <div className='container'>
          <div className='page-header'>
            <h1>Artistes</h1>
          </div>
          <div className='panel panel-default'>
            <div className='panel-heading'>Rechercher un artiste Spotify</div>
            <div className='panel-body'>
              <form onSubmit={this.handleSubmit} className='form-inline'>
                <div className='form-group'>
                  <input
                    type='search'
                    name='query'
                    value={this.state.query}
                    onChange={this.handleChange}
                    className='form-control'
                    placeholder='Mot(s)-clé(s)' />
                </div>
                <button type='submit' className='btn btn-primary'>Chercher</button>
              </form>
            </div>
          </div>
        </div>
        { this.renderResultsList() }
      </Layout>
    );
  }
}

export default SearchPage;
