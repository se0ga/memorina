import React, {Component} from 'react';
import Field from '../field';
import Timer from '../timer';
import WinnerScreen from '../winnerScreen';
import CardTypeButton from '../cardTypeButton';
import './app.css';
import types from './images';
const _ = require('lodash');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            inProgressTimeout: null,
            cardsAmount: 9,
            cardsType: 'pokemons',
            isEndGame: false,
            isGameRunning: false,
            time: 0,
            language: 'en',
            maxRange: 50,
        };
        this.createData = this.createData.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.checkOpenedCards = this.checkOpenedCards.bind(this);
        this.hideInProgressCards = this.hideInProgressCards.bind(this);
        this.cardsAmountChange = this.cardsAmountChange.bind(this);
        this.onCardsTypeClick = this.onCardsTypeClick.bind(this);
        this.showCards = this.showCards.bind(this);
        this.receiveTime = this.receiveTime.bind(this);
        this.newGame = this.newGame.bind(this);
        this.createCardTypeButtons = this.createCardTypeButtons.bind(this);
    }

    newGame() {
        this.setState({
            isEndGame: false,
            isGameRunning: false,
            data: this.createData(),
        }, this.showCards)
    }

    onCardsTypeClick() {
        const cardsType = document.getElementsByClassName('cardType');
        for (let i = 0; i < cardsType.length; i += 1) {
            if (cardsType[i].checked) {
                const length = types[cardsType[i].id].length;
                const maxRange = Math.min(50, length);
                const cardsAmount = Math.min(this.state.cardsAmount, maxRange);
                this.setState({cardsType: cardsType[i].id, maxRange, cardsAmount}, () => this.newGame());
            }
        }
    }

    createCardTypeButtons() {
        const buttons = [];
        for (const type in types) {
            buttons.push(
                <CardTypeButton key={type} type={type} language={this.state.language} onChange={this.onCardsTypeClick} iconName={types[type][0]}/>
            );
        }
        return buttons;
    }

    receiveTime(time) {
        this.setState({time});
    }

    showCards() {
        if (!this.state.isGameRunning) {
            clearTimeout(this.state.inProgressTimeout);
            const newData = this.state.data.map(card => {
                card.inProgress = true;
                return card;
            });
            this.setState({data: newData, inProgressTimeout: setTimeout(this.hideInProgressCards, 3000)});
        }
    }

    cardsAmountChange(e) {
        const cardsAmount = e.target.value;
        this.setState({cardsAmount}, () => this.newGame());
    }

    hideInProgressCards() {
        const newData = this.state.data.map(item => item.inProgress ? {...item, inProgress: false} : item);
        this.setState({data: newData});
    }

    checkOpenedCards() {
        const newData = this.state.data.map(item => item.inProgress ? {...item, inProgress: false} : item);
        const openedCards = newData
            .reduce((acc, item, id) => item.isOpened ? [...acc, id] : acc, []);
        if (openedCards.length > 1) {
            const card1 = newData[openedCards[0]];
            const card2 = newData[openedCards[1]];
            if (card1.pair === card2.pair) {
                newData[openedCards[0]].inGame = false;
                newData[openedCards[1]].inGame = false;
            }
            newData[openedCards[0]].inProgress = true;
            newData[openedCards[1]].inProgress = true;
            newData[openedCards[0]].isOpened = false;
            newData[openedCards[1]].isOpened = false;
            clearTimeout(this.state.inProgressTimeout);
            this.setState({inProgressTimeout: setTimeout(this.hideInProgressCards, 1500)});
        }
        this.setState({data: newData});
        const cardsInGame = newData.filter(card => card.inGame);
        if (cardsInGame.length === 0) {
            this.setState({isEndGame: true, isGameRunning: false});
        }
    }

    onCardClick(id) {
        if (!this.state.isGameRunning) {
            this.setState({isGameRunning: true});
        }
        const newData = this.state.data;
        newData[id].isOpened = !newData[id].isOpened;
        this.setState({data: newData});
        this.checkOpenedCards();
    }

    createData() {
        const cardsType = this.state.cardsType;
        const amount = this.state.cardsAmount;
        const names = _.shuffle(types[cardsType]);

        const data = [];
        const card = {
            isOpened: false,
            inGame: true,
            type: cardsType,
            inProgress: false,
        };
        for (var i = 0; i < amount; i++) {
            data.push({...card, name: names[i], pair: i, id: i * 2});
            data.push({...card, name: names[i], pair: i, id: i * 2 + 1});
        }
        return _.shuffle(data);
    }

    componentDidMount() {
        this.newGame();
    }

    render() {
        const {
            data,
            cardsAmount,
            isGameRunning,
            isEndGame,
            time,
            maxRange,
        } = this.state;
        return (
            <div className="app">
                <header className="header">
                    <input id='points' type="range" min="1" max={maxRange} name="points" value={cardsAmount} onChange={this.cardsAmountChange}/>
                    <label className="range" htmlFor="points">{cardsAmount}</label>
                    <button className='showCards' onClick={this.showCards}>Show cards</button>
                    {this.createCardTypeButtons()}
                    <div className='timer'>
                        {isGameRunning && <Timer onStop={this.receiveTime}/>}
                    </div>
                </header>
                <Field data={data} onCardClick={this.onCardClick}/>
                {isEndGame && <WinnerScreen time={time} onRepeat={this.newGame}/>}
                <div>Icons from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            </div>
        );
    }
}

export default App;
