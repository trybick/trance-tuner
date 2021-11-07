import React from 'react';
import PropTypes from 'prop-types';
import returnIcon from '../images/github-icon.png';
import { COLORS } from '../styles/constants';

const Footer = ({ siteTitle }) => (
  <footer
    style={{
      padding: '.5rem',
      backgroundColor: COLORS.lightGray,
      marginTop: '20px',
    }}
  >
    <div className="footer">
      <div className="contact-us">
        <a style={{ textDecoration: 'none' }} href="https://github.com/trybick/trance-tuner">
          <img className="github-icon" src={returnIcon} alt="return" />
          GitHub
        </a>
      </div>
      <div className="copyright">
        © {new Date().getFullYear()}
        {` `}
        {siteTitle}
      </div>
    </div>
  </footer>
);

Footer.propTypes = {
  siteTitle: PropTypes.string,
};

Footer.defaultProps = {
  siteTitle: ``,
};

export default Footer;
