import * as React from 'react';
import { render } from 'react-dom';
let main = document.querySelector("#main");


class App extends React.Component{
    render(){
        return (
            <p>App</p>
        )
    }
}

render(<App/>, main);