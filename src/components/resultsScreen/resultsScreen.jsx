import React, {Component} from 'react';
import axios from 'axios';
import {
    PATH_BASE,
    PARAM_TYPE,
    PARAM_CARDS,
} from '../constants';
import './resultsScreen.css';
import localization from '../localization';
import FormattedTime from '../formattedTime';
import Icon from "../icon";

class ResultsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
        this.getData = this.getData.bind(this);
        this.handleWindowClick = this.handleWindowClick.bind(this);
    }

    handleWindowClick(e) {
        if (e.target.classList.contains('results')) {
            this.props.onCrossClick();
        }
    }

    getData() {
        this.setState({isLoading: true});
        axios(`${PATH_BASE}?${PARAM_TYPE}${this.props.cardsType}&${PARAM_CARDS}${this.props.cardsAmount}`)
            .then(result => this.setState({isLoading: false, data: result.data}))
            .catch(error => this.setState({error}));
    }
    componentDidMount() {
        this.getData();
    }
    render() {
        const {language, cardsType, cardsAmount, onCrossClick} = this.props;
        return (
            <div className='results' onClick={this.handleWindowClick}>
                <div className='panel'>
                    <div className='cross' onClick={() => onCrossClick()}><Icon type='elements' name='cross'/></div>
                    <div className='headers'>
                    <h3>{localization.resultsScreen.cardsType[language]}: {localization.title[cardsType][language]}</h3>
                    <h3>{localization.resultsScreen.pairs[language]}: {cardsAmount}</h3>
                    </div>
                    <ol>
                        {this.state.data && Object.keys(this.state.data).map((key, index) => {
                                return <li key={index}>
                                    <div className='name' title={this.state.data[key]}>{this.state.data[key]}</div>
                                    <div className='time'><FormattedTime time={key} withMS={true}/></div>
                                </li>
                            }
                        )}
                    </ol>
                    {Object.keys(this.state.data).length === 0 &&
                    <p>{localization.resultsScreen.teaser[language]}</p>}
                </div>
            </div>
        )

    }
}

export default ResultsScreen;