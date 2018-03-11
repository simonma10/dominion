import React, {Component} from 'react';


class ForceComponent extends Component {
    constructor(props){
        super(props);
        this.state = props.force;
        console.log('forceComponent state', this.state);
    }

    render() {
        return(
            <div className="force-container">
                <p>Leader: {this.state.leader.leaderTitle + ' ' + this.state.leader.leaderName + ' '}
                (level {this.state.leader.level}, {this.state.leader.hp} hp,
                    leadership: {this.state.leader.leadershipFactor})
                </p>
                <p>Total Troops: {this.state.totalTroops}</p>
                <p>Basic Force Rating: <strong>{this.state.basicForceRating}</strong></p>
                <p>Troop Class: {this.state.troopClass}</p>
                <p>Battle Rating: {this.state.battleRating}</p>
            </div>
        );
    }
}

export default ForceComponent;