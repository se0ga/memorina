import React from 'react';
import PropTypes from 'prop-types';
import './icon.css';
import types from './list.js'

const Icon = ({type, name}) => {
    const url = require(`./images/${type}/${name}.svg`);
    return (
        <div className='icon' style={{backgroundImage: 'url("' + url + '")'}}/>
    )
};

Icon.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};
export {types};
export default Icon;