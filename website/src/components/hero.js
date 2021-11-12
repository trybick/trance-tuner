import React from 'react';
import headerImage from '../images/header.png';
import appScreenshot from '../images/screenshots/app-window.png';
import Button from './button';

const downloadsLink = 'https://github.com/trybick/trance-tuner/releases';

const Header = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '4rem 1rem 2rem',
    }}
  >
    <div
      style={{
        backgroundImage: `url(${headerImage})`,
        position: 'absolute',
        top: 0,
        zIndex: -5,
        height: '100vh',
        width: '96vw',
        opacity: 0.5,
      }}
    />
    <h1 style={{ textAlign: 'center' }}>Trance Tuner</h1>
    <p style={{ textAlign: 'center', maxWidth: 500 }}>
      Desktop application that plays your favorite trance stations
    </p>
    <Button to={downloadsLink}>Download</Button>
    <div className="app-screenshot-wrapper">
      <img className="app-screenshot-image" src={appScreenshot} alt="app screenshot" />
    </div>
  </div>
);

export default Header;
