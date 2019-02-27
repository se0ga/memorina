import React from 'react';
import PropTypes from 'prop-types';
import './icon.css';

const Icon = ({ type, name }) => {
    const url = require(`./images/${type}/${name}.svg`);
    return (
        <div className='icon' style={{backgroundImage: 'url("' + url + '")' }}/>
    )
};

Icon.propTypes = {
    name: PropTypes.string.isRequired
};

export default Icon;