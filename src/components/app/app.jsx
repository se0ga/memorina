import React, {Component} from 'react';
import Field from '../field';
import './app.css';
import types from './images';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            inProgressTimeout: null,
            cardsAmount: 2,
            cardsType: 'pokemons'
        };
        this.createData = this.createData.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.checkOpenedCards = this.checkOpenedCards.bind(this);
        this.hideInProgressCards = this.hideInProgressCards.bind(this);
        this.cardsAmountChange = this.cardsAmountChange.bind(this);
        this.onCardsTypeClick = this.onCardsTypeClick.bind(this);
    }

    onCardsTypeClick(e) {
        const cardsType = e.target.getAttribute('data-cards-type');
        this.setState({cardsType, data: this.createData(this.state.cardsAmount, cardsType)});
    }

    cardsAmountChange(e) {
        const cardsAmount = e.target.value;
        this.setState({cardsAmount, data: this.createData(cardsAmount, this.state.cardsType)});
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
            this.setState({inProgressTimeout: setTimeout(this.hideInProgressCards, 3000)});
        }
        this.setState({data: newData});
    }

    onCardClick(id) {
        const newData = this.state.data;
        newData[id].isOpened = !newData[id].inProgress && !newData[id].isOpened;
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
            cardsAmount
        } = this.state;
        return (
            <div className="App">
                <header className="App-header">
                    <label><input type="range" min="1" max="50" name="points" value={cardsAmount} onChange={this.cardsAmountChange}/>{cardsAmount}</label>
                    <button data-cards-type="pokemons" onClick={this.onCardsTypeClick}>Pokemons</button>
                    <button data-cards-type="space" onClick={this.onCardsTypeClick}>Space</button>
                </header>
                <Field data={data} onCardClick={this.onCardClick}/>
            </div>
        );
    }
}

export default App;
