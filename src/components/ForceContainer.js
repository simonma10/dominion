import React from 'react';
import ForceComponent from './ForceComponent'

const ForceContainer = (props) => {
    return (
        <div className="force-container-div">
            <ForceComponent force={props.sideA}/>
            <ForceComponent force={props.sideB}/>
        </div>
    );
}

export default ForceContainer;