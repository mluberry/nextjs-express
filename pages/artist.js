import React from 'react';
import { If, Then, Else } from 'react-if';
import Link from 'next/link';

import axios from 'axios';
import _ from 'lodash';

import Layout from '../components/layout';

class ArtistPage extends React.Component {
  static getInitialProps ({ query: { id } }) {
    return { id };
  }
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      artist: {},
      albums: [],
      limit: 20,
      offset: 0,
      total: 0
    };
    this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData() {
    this.setState({loading: true}, () => {
      axios.get('/api/artist/' + this.props.id, {
        params: {
          limit: this.state.limit,
          offset: this.state.offset
        }
      })
      .then((response) => {
        const { artist, albums } = response.data;
        this.setState({
          artist: artist,
          albums: albums.items,
          limit: albums.limit,
          offset: albums.offset,
          total: albums.total,
          loading: false
        });
      })
      .catch((error) => {
        this.setState({loading: false});
      });
    });
  }
  renderAlbumsList() {
    const { loading, artist, albums, limit, total } = this.state;
    if (loading) {
      return (<div className='alert alert-info'>Chargement...</div>);
    } else {
      return (
        <div>
          <ol className='breadcrumb'>
            <li><Link href='/'><a>Recherche</a></Link></li>
            <li className='active'>{artist.name}</li>
          </ol>
          <div className='page-header'>
            <h1>Albums</h1>
            <h2>{artist.name}</h2>
          </div>
          <div className='container albums'>
            <div className='row'>
              {_.map(albums, (album) =>
                <div key={album.id} className='col-xs-12 col-md-4 col-lg-3'>
                  <div className='thumbnail text-center'>
                    <Link href={'/album?id=' + album.id} as={'/album/' + artist.id}>
                      <a><img src={album.images[1].url} className='img-responsive' alt={album.name} /></a>
                    </Link>
                    <div className='caption'>
                      <h4>{album.name}</h4>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
  render() {
    return (
      <Layout title={ 'Artiste' }>
        <div className='container'>
          { this.renderAlbumsList() }
        </div>
      </Layout>
    );
  }
}

export default ArtistPage;
