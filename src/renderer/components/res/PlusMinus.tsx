import React from 'React';

const style = { fill: 'white' };

export default (
    <svg className="vertical-center" viewBox="0 0 100 130">
        <rect x="0" y="45" width="100" height="10" style={style} />
        <rect x="45" y="0" width="10" height="100" style={style} />
        <rect x="0" y="120" width="100" height="10" style={style} />
    </svg>
);
