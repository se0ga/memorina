import React, {Component} from 'react';

function FormattedTime(props) {
    return <span>{Math.floor(props.time / 60)} : {props.time % 60}</span>;
}

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: props.startTime,
            finishTime: props.finishTime,
            time: 0,
        };
        console.log(1)
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
            <div>
                <FormattedTime time={this.state.time} />
            </div>
        );
    }
}
export default Timer;