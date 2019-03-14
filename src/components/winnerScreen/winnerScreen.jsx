import React, {Component} from 'react';
import './winnerScreen.css';
import Icon, {types} from '../icon';
import FormattedTime from '../formattedTime';
import localization from '../localization';
import _ from 'lodash';
import axios from 'axios';
import MD5 from 'blueimp-md5';
import {
    PATH_BASE,
    PARAM_TYPE,
    PARAM_CARDS,
    RESULTS_AMOUNT,
} from '../constants';

class WinnerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: null,
            victoryIconName: _.sample(types.victory),
            userName: '',
        };
        this.handleWindowClick = this.handleWindowClick.bind(this);
        this.findPlace = this.findPlace.bind(this);
        this.handleClickSaveButton = this.handleClickSaveButton.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(event) {
        if (event.keyCode === 13) {
            this.handleClickSaveButton();
        }
    }
    handleWindowClick(e) {
        if (e.target.classList.contains('winnerScreen')) {
            this.props.onCrossClick();
        }
    }
    handleClickSaveButton() {
        const key = MD5(`XyZzy12*_${this.props.cardsAmount}${this.props.cardsType}${this.state.userName}${this.props.time}`);
        const data = `cards=${this.props.cardsAmount}&type=${this.props.cardsType}&key=${key}&time=${this.props.time}&name=${this.state.userName}`;

        axios({
            method: 'post',
            url: PATH_BASE,
            data: data,
        });
        this.props.onCrossClick();
    }
    findPlace(data) {
        const times = Object.keys(data).map((time) => Number(time));
        times.push(Number(this.props.time));
        times.sort((a,b) => a-b);
        return times.indexOf(this.props.time) + 1;
    }
    componentDidMount() {
        axios(`${PATH_BASE}?${PARAM_TYPE}${this.props.cardsType}&${PARAM_CARDS}${this.props.cardsAmount}`)
            .then(result => this.setState({isLoading: false, data: result.data, place: this.findPlace(result.data)}))
            .catch(error => this.setState({error}));
        document.addEventListener('keydown', this.handleKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    render() {
        const {time, onRepeat, onCrossClick, lang} = this.props;
        return (
            <div className='winnerScreen' onClick={this.handleWindowClick}>
                <div className='container'>
                    <div className='cross' onClick={() => onCrossClick()}><Icon type='elements' name='cross'/></div>
                    <div className='victoryIcon'><Icon type='victory' name={this.state.victoryIconName}/></div>
                    <h3>{localization.winnerScreen.yourTime[lang]}<FormattedTime time={time} withMS={true}/></h3>
                    <div className='playerPlace'>
                        {this.state.place && <h3>{localization.winnerScreen.yourPlace[lang]}{this.state.place}</h3>}
                        {this.state.place && (this.state.place <= RESULTS_AMOUNT ?
                            (<div>
                                    <input type='text' placeholder={localization.winnerScreen.namePlaceholder[lang]} className='playerName' value={this.state.userName} onChange={(e) => this.setState({userName: e.target.value})}/>
                                    <br/>
                                    <input type='submit' value={localization.winnerScreen.saveButton[lang]} className='button' onClick={this.handleClickSaveButton}/>
                            </div>)
                        :
                            <button className='button repeatButton' onClick={onRepeat}>{localization.winnerScreen.oneMoreTime[lang]}</button>

                        )}
                    </div>
                </div>
            </div>
        );
    }
    
}
export default WinnerScreen;