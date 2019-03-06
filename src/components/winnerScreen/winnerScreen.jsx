import React from 'react';
import './winnerScreen.css';
import FormattedTime from '../formattedTime';

const WinnerScreen = ({time, onRepeat}) => {

        return (
            <div className="winnerScreen">
                <div className="container">
                    <h2>Ещё разик?</h2>
                    <FormattedTime time={time} withMS={true}/>
                    <button onClick={onRepeat}>Space</button>
                </div>
            </div>
        );
};
export default WinnerScreen;