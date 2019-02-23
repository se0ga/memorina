import React from 'react';
import './card.css';
import Icon from '../icon';

const Card = ({data, onCardClick, cardId}) => {
    const {isOpened, inGame, name, type, inProgress} = data;
    let className = 'card';
    if (inProgress && !inGame) {
        className = 'card card-highlite';
    } else if (!inProgress && !inGame) {
        className = 'card card-guessed';
    }
    return <div className={className} onClick={() => onCardClick(cardId)}>
        {(inProgress || isOpened) && <Icon type={type} name={name}/>}
    </div>

};
export default Card;