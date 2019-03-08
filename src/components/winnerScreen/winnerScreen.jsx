import React from 'react';
import './winnerScreen.css';
import Icon, {types} from '../icon';
import FormattedTime from '../formattedTime';
import localisation from '../localization';
import _ from 'lodash';

const WinnerScreen = ({time, onRepeat, onCrossClick, lang}) => {
    const iconName = _.sample(types.victory);
    const winnerScreenClick = (e) => {
        if (e.target.classList.contains('winnerScreen')) {
            onCrossClick();
        }
    };
    return (
        <div className='winnerScreen' onClick={winnerScreenClick}>
            <div className='container'>
                <div className='cross' onClick={() => onCrossClick()}><Icon type='elements' name='cross'/></div>
                <div className='victoryIcon'><Icon type='victory' name={iconName}/></div>
                <span>{localisation.yourTime[lang]}</span><FormattedTime time={time} withMS={true}/>
                <p>
                    <button className='repeatButton' onClick={onRepeat}>{localisation.oneMoreTime[lang]}</button>
                </p>
            </div>
        </div>
    );
};
export default WinnerScreen;