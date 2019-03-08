import React, {Component} from 'react';
import Icon from '../icon';
import './langListbox.css';

class LangListbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: false,
        };
        this.handleLangButtonClick = this.handleLangButtonClick.bind(this);
    }
    handleLangButtonClick(lang) {
        this.setState({opened: false});
        this.props.onLanguageChange(lang);
    }
    render () {
        const supportedLanguages = ['en', 'ru'];
        const {lang} = this.props;
        return (
        <div className='langListbox'>
            <ul>
                {this.state.opened && supportedLanguages.map((lang) => {
                        const className = lang === this.props.lang ? 'languageButton active' : 'languageButton';
                        return <li key={lang} onClick={() => this.handleLangButtonClick(lang)} className={className}><span>{lang}</span><Icon name={lang} type='languages'/></li>
                    }
                )}
            </ul>
            <div className='languageButton' onClick={() => this.setState({opened: true})}><span>{lang}</span><Icon name={lang} type='languages' /></div>
        </div>
        )

    }
};

export default LangListbox;