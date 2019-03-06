import React, {Component} from 'react';
import FormattedTime from '../formattedTime';
import './timer.css';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: null,
            time: null,
        };
    }

    componentDidMount() {
        this.setState({startTime: new Date(), time: 0});
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    returnTime() {
        return Math.floor((new Date() - this.state.startTime));
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        this.props.onStop(this.returnTime());
    }

    tick() {
        this.setState({
            time: this.returnTime(),
        });
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