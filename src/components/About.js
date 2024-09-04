import React from 'react';

function About() {
  return (
    <div style={contentStyle}>
      <h1>About</h1>
      <p>This site was developed by Daniel Hootini to provide tutoring assistance to students in political science courses. If you have any questions or require further information, please feel free to contact me.</p>
    </div>
  );
}

const contentStyle = {
  padding: '20px',
  textAlign: 'left',
  margin: '0 auto',
  maxWidth: '1000px',
};

export default About;
