import React from 'react';
import { Link } from 'gatsby';
import Button from './button';
import SectionHeader from './section-header';

const CallToAction = () => (
  <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
    <SectionHeader description="Supports macOS, Windows, and Linux" title="Free and open-source" />

    <Link to="/docs/">
      <Button>Learn More</Button>
    </Link>
  </div>
);

export default CallToAction;
