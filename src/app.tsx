import * as React from 'react';
import { render } from 'react-dom';


let main = document.querySelector("#root");


class Field_square extends React.Component{
    constructor(props){
        super(props);
        
    }
    
    render(){
        let source = "";
        let props_val = this.props.value;
        
        return(
            <div className="square_container" onClick={this.props.onClick}>
                <span>{props_val}</span>
            </div>
        )
        
    }
}


class Field extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            board: Array(3).fill(Array(3).fill("O"))
        }
    }
    handle_click = (id, e) => {
        console.log(id, e);
    }
    render(){
        let arr = this.state.board;
        let list_squares = arr.map((array, index) => {
            let i = index;
            return (
                <div key={i} className="field_row">
                {
                    array.map((val, index) => {
                        let j = index;
                        return <Field_square key={j} value={val} onClick={(e) => {this.handle_click(id, e)}}/>
                    })
                }
                </div>
            )
            
        })
        return (
            <div className="field_container">
                {list_squares}
            </div>
        )
    }
}


class App extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="game_container">
                <Field/>
            </div>
        )
    }
}

render(<App/>, main);