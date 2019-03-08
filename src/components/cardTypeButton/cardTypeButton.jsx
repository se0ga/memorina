import React from 'react';
import Localization from '../localization';
import Icon from '../icon';
import './cardTypeButton.css';

const CardTypeButton = ({onChange, type, language, iconName}) =>
    <div className='cardTypeButton'>
        <input className='cardType' id={type} onChange={onChange} name='cardType' type='radio'/>
        <label htmlFor={type} className='iconType' title={Localization.title[type][language]}>
            <Icon type={type} name={iconName}/>
        </label>
    </div>;

export default CardTypeButton;