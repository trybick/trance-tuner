/* eslint-disable react/no-danger */
import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import SEO from '../components/seo';
import returnIcon from '../images/return.png';
import '../styles/docs.css';

export const pageQuery = graphql`
  query DocsPageQuery {
    allMarkdownRemark {
      edges {
        node {
          html
          headings {
            depth
            value
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;

const DocsPage = ({ data }) => (
  <Layout>
    <SEO />
    <div>
      <div className="docs-wrapper">
        <div className="home-link-wrapper">
          <Link className="home-link" to="/">
            <img className="return-icon" src={returnIcon} alt="return" />
            Back
          </Link>
        </div>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: data.allMarkdownRemark.edges[0].node.html }}
        />
        <div className="home-link-wrapper">
          <Link className="home-link" to="/">
            <img className="return-icon" src={returnIcon} alt="return" />
            Back
          </Link>
        </div>
      </div>
    </div>
  </Layout>
);

export default DocsPage;
