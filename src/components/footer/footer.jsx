import React from 'react';
import LangListbox from '../langListbox';
import localisation from '../localization';
import './footer.css';

const Footer = ({lang, onLanguageChange}) => {
    return (
        <footer>
            <div className='iconsCopyright'>Icons from <a href="https://www.flaticon.com/" title="Flaticon" target='_blank'>www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            <div>{localisation.createdBy[lang]}<a href="https://github.com/se0ga" target='_blank'>se0ga</a></div>
            <div><a href="mailto: se0ga@yandex.ru" target='_blank'>{localisation.feedback[lang]}</a></div>
            <div className='languageBox'>
                <LangListbox lang={lang} onLanguageChange={onLanguageChange}/>
            </div>
        </footer>
    );
};

export default Footer;