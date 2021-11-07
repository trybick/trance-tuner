import React from 'react';
import SectionHeader from './section-header';
import { COLORS } from '../styles/constants';
import trayScreenshot from '../images/screenshots/tray.png';

const Content = () => (
  <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
    <SectionHeader
      title="Control any audio stream"
      description="Enter any URL or use one of the built-in sources"
    />
    <div
      style={{
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 340px))',
      }}
    >
      <div>
        <h3>One-click play</h3>
        <p style={{ color: COLORS.gray }}>
          Click the tray icon to toggle the music or use the built-in keyboard shortcuts
        </p>
      </div>
      <div>
        <img
          src={trayScreenshot}
          style={{ width: '50%' }}
          alt="a blank card floating over colorful graphics"
        />
      </div>
    </div>
  </div>
);

export default Content;
