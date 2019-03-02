import React from 'react';
import './winnerScreen.css'

const WinnerScreen = ({children}) => {

        return (
            <div className="winnerScreen">
                <div class="container">
                <h2>Ещё разик?</h2>
                {children}
                </div>
            </div>
        );
};
export default WinnerScreen;