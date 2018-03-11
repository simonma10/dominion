import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';
//import { loadData, getWelcomeMessage, getLocation} from './actions';
import ForceContainer from './components/ForceContainer';
import PageHeader from './components/PageHeader';
import BattleComponent from './components/BattleComponent';

import Force from './warMachine/Force';
import Battle from './warMachine/Battle';

console.log('###############################')
console.log('########  War Machine  ########');
console.log('###############################')
//====================================================================================================================
// War Machine, from D&D Companion Rules pg 12-13, published 1984
//====================================================================================================================

//let troop = new Troop();
//let leader = new Leader();
let sideA = new Force();
let sideB = new Force();

let battle = new Battle(sideA, sideB);




// create redux store using thunk middleware
let store = createStore(
    reducers,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension && window.devToolsExtension()
    )
);


// render UI
ReactDOM.render(
    <Provider store={store}>
        <div>
            <PageHeader headerText="War Machine"/>
            <ForceContainer sideA={sideA} sideB={sideB}/>
            <BattleComponent battleObject={battle}/>
        </div>
    </Provider>
        , document.querySelector('.container')
);









/*

 //const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
 store={createStoreWithMiddleware(reducers)}
 */