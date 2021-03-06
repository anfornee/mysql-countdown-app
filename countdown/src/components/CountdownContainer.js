import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import Countdown from './Countdown';

class CountdownContainer extends Component {
    state = {
        events: [],
        amountOfEvents: 0,
        countdownContainerGrid: "countdownContainerGrid",
        eventAdded: false
    }

    fetchEvents = () => {
        const encodedURI = window.encodeURI(this.props.uri);
        return axios.get(encodedURI).then(res => {
            this.setState(() => {
                return {
                    events: res.data,
                    amountOfEvents: res.data.length
                }
            }, () => {
                if (this.state.amountOfEvents === 2) {
                    this.setState({ countdownContainerGrid: "countdownContainerGrid2" })
                } else if (this.state.amountOfEvents === 1) {
                    this.setState({ countdownContainerGrid: "countdownContainerGrid1" })
                }
            });
        });
    }

    componentDidMount() {
        this.fetchEvents();
        this.props.dispatch({
            type: 'NO'
        });
        this.setState({ eventAdded: false });
    }

    checkForUpdates = () => {
        setInterval(() => {
            if (this.props.newEvent) {
                this.props.dispatch({
                    type: 'NO'
                });
                this.setState({ eventAdded: true }, () => {
                    this.fetchEvents();
                })
            }
        }, 1000);
    }

    render() {
        this.checkForUpdates();
        return (
            <div className="App">
                <h1>Stuff be happening!</h1>
                <div className={this.state.countdownContainerGrid}>
                    {this.state.events.map(event =>
                        <Countdown
                            key={event.Id}
                            title={event.Title}
                            month={event.Month}
                            day={event.Day}
                            year={event.Year}
                            image={event.Background}
                        />
                    )}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        newEvent: state.newEvent
    };
}

export default connect(mapStateToProps)(CountdownContainer);
