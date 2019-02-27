import React, {Component} from 'react';
import './timer.css'

const addLeadingZero = num => num < 10 ? '0' + num : String(num);

function FormattedTime(props) {
    const min = addLeadingZero(Math.floor(props.time / 60));
    const sec = addLeadingZero(props.time % 60);
    return <span>{min} : {sec} </span>;
}

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: props.startTime,
            finishTime: props.finishTime,
            time: 0,
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            time: Math.floor((new Date() - this.state.startTime) / 1000),
        });
        if (this.props.finishTime) {
            clearInterval(this.timerID);
        }
    }

    render() {
        return (
            <div className="timer">
                <FormattedTime time={this.state.time} />
            </div>
        );
    }
}
export default Timer;