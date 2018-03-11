import React from 'react';

const BattleComponent = (props) => {

    return (
        <div className="battle-component">
            {props.battleObject.battleResults.map((item,i) => <p key={i}>{item}</p>)}

        </div>
    );


}

export default BattleComponent;