import React from 'react';

export default (props: { fill: string }) => (
    <svg viewBox="0 0 100 100">
        <polygon
            points="50,0 0,50 20,50 20,100 40,100 40,75 60,75 60,100 80,100, 80,50, 100,50 50,0"
            style={props}
        />
    </svg>
);
