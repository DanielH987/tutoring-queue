import React from 'react';

const Instructions = () => {
    return (
        <div style={contentStyle}>
            <h1>Instructions</h1>
            <p>To get help from the tutors, fill out the form on the main page. If you are in the lab, enter your desk number. If you want help on Microsoft Teams, enter your email.</p>
            <p>Also, some tutors might not be able to help for a certain class. So, you might see some people later in "line" get help before you.</p>
        </div>
    );
};

const contentStyle = {
    padding: '20px',
    textAlign: 'left',
    margin: '0 auto',
    maxWidth: '1500px',
};

export default Instructions;