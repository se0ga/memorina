import React, {Component} from 'react';
import Field from '../field';
import Timer from '../timer';
import WinnerScreen from '../winnerScreen';
import './app.css';
import types from './images';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            inProgressTimeout: null,
            cardsAmount: 9,
            cardsType: 'pokemons',
            startTime: null,
            finishTime: null
        };
        this.createData = this.createData.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.checkOpenedCards = this.checkOpenedCards.bind(this);
        this.hideInProgressCards = this.hideInProgressCards.bind(this);
        this.cardsAmountChange = this.cardsAmountChange.bind(this);
        this.onCardsTypeClick = this.onCardsTypeClick.bind(this);
        this.showCards = this.showCards.bind(this);
    }

    onCardsTypeClick(e) {
        const cardsType = e.target.getAttribute('data-cards-type');
        this.setState({cardsType, data: this.createData(this.state.cardsAmount, cardsType), startTime: null, finishTime: null});
    }

    showCards() {
        if (!this.state.startTime) {
        clearTimeout(this.state.inProgressTimeout);
        const newData = this.state.data.map(card => {
            card.inProgress = true;
            return card;
        });
        this.setState({data: newData, inProgressTimeout: setTimeout(this.hideInProgressCards, 5000)});
        }
    }

    cardsAmountChange(e) {
        const cardsAmount = e.target.value;
        this.setState({cardsAmount, data: this.createData(cardsAmount, this.state.cardsType), startTime: null, finishTime: null});
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
            this.setState({finishTime: new Date()});
        }
    }

    onCardClick(id) {
        if (!this.state.startTime) {
            this.setState({startTime: new Date()});
        }
        const newData = this.state.data;
        newData[id].isOpened = !newData[id].isOpened;
        this.setState({data: newData});
        this.checkOpenedCards();
    }

    createData(amount, cardsType) {
        function shuffle(a) {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
        const data = [];
        const card = {
            isOpened: false,
            inGame: true,
            type: cardsType,
            inProgress: false,
        };
        for (var i = 0; i < amount; i++) {
            data.push({...card, name: types[cardsType][i], pair: i, id: i * 2});
            data.push({...card, name: types[cardsType][i], pair: i, id: i * 2 + 1});
        }
        return shuffle(data);
    }

    componentDidMount() {
        this.setState({data: this.createData(this.state.cardsAmount, this.state.cardsType)});
    }

    render() {
        const {
            data,
            cardsAmount,
            startTime,
            finishTime,
        } = this.state;
        return (
            <div className="app">
                <header className="header">
                    <label><input type="range" min="1" max="50" name="points" value={cardsAmount} onChange={this.cardsAmountChange}/>{cardsAmount}</label>
                    <button data-cards-type="pokemons" onClick={this.onCardsTypeClick}>Pokemons</button>
                    <button data-cards-type="space" onClick={this.onCardsTypeClick}>Space</button>
                    <button onClick={this.showCards}>Show cards</button>
                    {startTime && <Timer startTime={startTime} finishTime={finishTime}/>}
                </header>
                <Field data={data} onCardClick={this.onCardClick}/>
                {finishTime && <WinnerScreen><Timer startTime={startTime} finishTime={finishTime}/></WinnerScreen>}
            </div>
        );
    }
}

export default App;
