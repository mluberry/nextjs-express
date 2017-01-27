import React from 'react';
import { If, Then, Else } from 'react-if';
import Link from 'next/link';

import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

import Layout from '../components/layout';

class AlbumPage extends React.Component {
  static getInitialProps ({ query: { id } }) {
    return { id };
  }
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      artist: null,
      album: null,
    };
    this.fetchData = this.fetchData.bind(this);
    this.getImage = this.getImage.bind(this);
    this.asDuration = this.asDuration.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData() {
    this.setState({loading: true}, () => {
      axios.get('/api/album/' + this.props.id)
        .then((response) => {
          this.setState({
            artist: response.data.artists[0],
            album: response.data,
            loading: false
          });
        })
        .catch((error) => {
          this.setState({loading: false});
        });
    });
  }
  getImage() {
    return _.get(this.state.album, 'images.0.url', 'http://placehold.it/640x640');
  }
  asDuration(milliseconds) {
    const min = moment.duration(milliseconds).get('minutes');
    const sec = moment.duration(milliseconds).get('seconds');
    return _.padStart(min, 2, '0') + ':' + _.padStart(sec, 2, '0');
  }
  renderTracksList() {
    const { loading, artist, album } = this.state;
    if (loading) {
      return (<div className='alert alert-info'>Chargement...</div>);
    } else {
      return (
        <div>
          <ol className='breadcrumb'>
            <li><Link href='/'><a>Recherche</a></Link></li>
            <li><Link href={'/artist?id=' + artist.id} as={'/artist/' + artist.id}><a>{artist.name}</a></Link></li>
            <li className='active'>{album.name}</li>
          </ol>
          <div className='page-header'>
            <h1>Pistes</h1>
            <h2>{artist.name} - {album.name}</h2>
          </div>
          <div className='row'>
            <div className='col-xs-12 col-md-6 col-lg-6'>
              <img src={this.getImage()} className='thumbnail img-responsive' alt='{album.name}' />
            </div>
            <div className='col-xs-12 col-md-6 col-lg-6'>
              <ul className='list-group'>
                {_.map(album.tracks.items, (track) =>
                  <li key={track.id} className='list-group-item'>
                    {track.track_number}. {track.name} <span className='badge'>{this.asDuration(track.duration_ms)}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }
  render() {
    return (
      <Layout title={ 'Album' }>
        <div className='container'>
          { this.renderTracksList() }
        </div>
      </Layout>
    );
  }
}

export default AlbumPage;
