import React from 'react';

function About() {
  return (
    <div style={contentStyle}>
      <h1>About</h1>
      <p>This site was developed to help students get tutoring help. If you have any questions, please contact me.</p>
    </div>
  );
}

const contentStyle = {
  padding: '20px',
  textAlign: 'center',
};

export default About;
