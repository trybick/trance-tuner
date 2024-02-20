import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Helmet from 'react-helmet';

import Footer from './footer';
import '../styles/default.css';
import favicon from '../images/favicon.ico';

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet>
          <link rel="icon" href={favicon} />
          {/* eslint-disable-next-line react/self-closing-comp */}
        </Helmet>
        <div
          style={{
            padding: '0 1rem',
          }}
        >
          <main>{children}</main>
        </div>
        <Footer siteTitle={data.site.siteMetadata.title} />
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
