import React, {Component} from 'react';
import Field from '../field';
import Timer from '../timer';
import WinnerScreen from '../winnerScreen';
import ResultsScreen from '../resultsScreen';
import CardTypeButton from '../cardTypeButton';
import Footer from '../footer';
import {YMInitializer} from 'react-yandex-metrika';
import './app.css';
import {types} from '../icon';
import localization from '../localization';
import FormattedTime from '../formattedTime';

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
            winnerScreen: false,
            resultsScreen: false,
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
        this.closeScreens = this.closeScreens.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.showResultsScreen = this.showResultsScreen.bind(this);
    }

    handleKeyPress(event) {
        if (event.keyCode === 27) {
            this.closeScreens();
        }
    }

    showResultsScreen(){
        this.setState({resultsScreen: true})
    }

    handleLanguageChange(language) {
        this.setState({language});
    }

    closeScreens() {
        this.newGame();
    }

    newGame() {
        this.setState({
            resultsScreen: false,
            winnerScreen: false,
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
                <CardTypeButton key={type} type={type} language={this.state.language} onChange={this.onCardsTypeClick}
                                iconName={types[type][0]}/>
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
        const cardsInGame = newData.filter(card => card.inGame);
        if (cardsInGame.length === 0) {
            this.setState({isEndGame: true, isGameRunning: false, winnerScreen: true});
        }
        this.setState({data: newData});
    }

    onCardClick(id) {
        if (!this.state.isGameRunning) {
            this.setState({isGameRunning: true});
        }
        const newData = this.state.data;
        newData[id].isOpened = (!newData[id].inProgress || !this.state.isGameRunning) && !newData[id].isOpened;
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
        document.addEventListener('keydown', this.handleKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    render() {
        const {
            data,
            cardsAmount,
            isGameRunning,
            time,
            maxRange,
            winnerScreen,
            language,
            cardsType,
            resultsScreen,
        } = this.state;
        return (
            <div className='app'>
                <header className='header'>
                    <input id='points' type='range' min='2' max={maxRange} name='points' value={cardsAmount}
                           onChange={this.cardsAmountChange}/>
                    <label className='range' htmlFor='points'>{cardsAmount}</label>
                    <button className='showCards' onClick={this.showCards}>{localization.showCards[language]}</button>
                    <button className='resultsScreenButton' onClick={this.showResultsScreen}>{localization.resultsScreenButton[language]}</button>
                    <div className='cardTypeButtons'>
                        {this.createCardTypeButtons()}
                    </div>
                    <div className='timerPlace'>
                        {isGameRunning ? <Timer onStop={this.receiveTime}/> : <FormattedTime time='0'/>}
                    </div>
                </header>
                <Field data={data} onCardClick={this.onCardClick}/>
                {winnerScreen &&
                <WinnerScreen cardsType={cardsType} cardsAmount={cardsAmount} time={time} onRepeat={this.newGame} onCrossClick={this.closeScreens} lang={language}/>}
                {resultsScreen && <ResultsScreen language={language} cardsAmount={cardsAmount} cardsType={cardsType} onCrossClick={this.closeScreens}/>}
                <Footer lang={language} onLanguageChange={this.handleLanguageChange}/>
                <YMInitializer accounts={[52710124]} options={{webvisor: true}} version='2'/>
            </div>
        );
    }
}

export default App;
