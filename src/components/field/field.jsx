import React, {Component} from 'react';
import './field.css';
import Card from '../card';

class Field extends Component {

    render() {
        const {
            data,
            onCardClick
        } = this.props;
    return (<div className='field'>
        {data.map((data, key) => {
            return (<Card key={key} data={data} onCardClick={onCardClick} cardId={key}></Card>);
        })}

    </div>);

    }

};
export default Field;