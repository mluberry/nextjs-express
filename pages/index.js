import React from 'react';
import Link from 'next/link';

import Layout from '../components/layout';

export default () => {
  return (
    <Layout title={ 'Next.js + Express' }>
      <div className='container'>
        <div className='jumbotron'>
          <h1>Next.js + Express</h1>
          <p>A simple app using Spotify API</p>
          <p>
            <Link href='/search'><a className='btn btn-primary btn-lg' role='button'>Use it !</a></Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
