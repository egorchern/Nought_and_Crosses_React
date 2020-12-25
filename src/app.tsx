import * as React from "react";
import { render } from "react-dom";

let root = document.querySelector("#root");

function copy_array(arr){
    let new_arr = [];
    for (let i = 0; i < arr.length; i += 1){
        let type = typeof(arr[i]);
        let value = arr[i];
        if(type === "object"){
            value = copy_array(value);
        }
        new_arr.push(value);
    }
    return new_arr;
}

function generate_n_size_array(size: Number, fill){
    let output_arr = [];
    for(let i = 0; i < size; i += 1){
        let row = [];
        for(let j = 0; j < size; j += 1){
            row.push(fill);
        }
        output_arr.push(row);
    }
    return output_arr;
}

function check_game_state(board) {
        
        
    let all_filled = true;
    let row_length = board.length;
    let column_length = board[0].length;
    let columns = generate_n_size_array(column_length, "");
    //Check for full rows
    for(let row_index = 0; row_index < row_length; row_index += 1){
        let row = board[row_index];
        
        let x_count = 0;
        let o_count = 0;
        
        for(let i = 0; i < row.length; i += 1){
            columns[i][row_index] = row[i];
            
            if(row[i] === "X"){
                x_count += 1;
            }
            else if(row[i] === "O"){
                o_count += 1;
            }
            
        }
        
        if(x_count === row_length){
            return "X";
        }
        if(o_count === row_length){
            return "O";
        }
    }
    //debugger;
    //Check for full columns
    for(let column_index = 0; column_index < column_length; column_index += 1){
        let column = columns[column_index];
        
        let x_count = 0;
        let o_count = 0;
        
        for(let i = 0; i < column.length; i += 1){
            
            if(column[i] === "X"){
                x_count += 1;
            }
            else if(column[i] === "O"){
                o_count += 1;
            }
            else{
                all_filled = false;
            }
            
        }
        
        if(x_count === column_length){
            return "X";
        }
        if(o_count === column_length){
            return "O";
        }
    }
    
    //Get diagnals
    let diagnals = [];
    let left_diangal = [];
    for(let row_index = 0; row_index < row_length; row_index += 1){
        left_diangal.push(board[row_index][row_index]);
    }
    let right_diangal = [];
    let row_index = 0;
    let column_index = column_length - 1;
    for(row_index; row_index < row_length; row_index += 1){
        right_diangal.push(board[row_index][column_index]);
        column_index -= 1;
    }
    diagnals.push(left_diangal);
    diagnals.push(right_diangal);
    
    
    //Check diagnals
    for(let diagnal_index = 0; diagnal_index < 2; diagnal_index += 1){
        let diagnal = diagnals[diagnal_index];
        
        let x_count = 0;
        let o_count = 0;
        
        for(let i = 0; i < diagnal.length; i += 1){
            
            if(diagnal[i] === "X"){
                x_count += 1;
            }
            else if(diagnal[i] === "O"){
                o_count += 1;
            }
            
        }
        
        if(x_count === row_length){
            return "X";
        }
        if(o_count === row_length){
            return "O";
        }
    }
    
    //Check if all squares are filled
    if(all_filled === true){
        return "D";
    }
    return "";



}

function get_possible_moves(board){
    let row_length = board.length;
    let possible_moves_arr = [];
    for(let row_index = 0; row_index < row_length; row_index += 1){
        for(let column_index = 0; column_index < row_length; column_index += 1){
            let value = board[row_index][column_index];
            if(value === ""){
                let possible_move = [row_index, column_index];
                possible_moves_arr.push(possible_move);
            }
        }
    }
    return possible_moves_arr;
}

function make_move_on_board(board, move, symbol){
    let local_board = copy_array(board);
    local_board[move[0]][move[1]] = symbol;
    return local_board;
}

function minmax(board, minimize, advantage_symbol, disadvantage_symbol, depth){
    let outcome = check_game_state(board);
    switch(outcome){
        case "X":
            if(advantage_symbol === "X"){
                return [1, depth];
            }
            else{
                return [-1, depth];
            }
        case "O":
            if(advantage_symbol === "O"){
                return [1, depth];
            }
            else{
                return [-1, depth];
            }
        case "D":
            return [0, depth];
    }
    if(minimize === true){
        let worst_score = Infinity;
        let best_depth = Infinity;
        let possible_moves = get_possible_moves(board);
        for(let i = 0; i < possible_moves.length; i += 1){
            let move = possible_moves[i];
            let current_board = make_move_on_board(board, move, disadvantage_symbol);
            let temp = minmax(current_board, false, advantage_symbol, disadvantage_symbol, depth + 1);
            let current_score = temp[0];
            let current_depth = temp[1];
            if(current_score < worst_score){
                worst_score = current_score;
                best_depth = current_depth;
            }
            else if(current_score === worst_score){
                if(current_depth < best_depth){
                    best_depth = current_depth;
                }
            }
        }
        return [worst_score, best_depth];
    }
    else{
        let best_score = -Infinity;
        let best_depth = Infinity;
        let possible_moves = get_possible_moves(board);
        for(let i = 0; i < possible_moves.length; i += 1){
            let move = possible_moves[i];
            let current_board = make_move_on_board(board, move, advantage_symbol);
            let temp = minmax(current_board, true, advantage_symbol, disadvantage_symbol, depth + 1);
            let current_score = temp[0];
            let current_depth = temp[1];
            if(current_score > best_score){
                best_score = current_score;
                best_depth = current_depth;
            }
            else if(current_score === best_score){
                if(current_depth < best_depth){
                    best_depth = current_depth;
                }
            }
        }
        return [best_score, best_depth];
    }
}

function select_best_move(board, advantage_symbol, disadvantage_symbol){
    
    let best_score = -Infinity;
    let best_depth = Infinity;
    let best_move;
    let possible_moves = get_possible_moves(board);
    
    for(let i = 0; i < possible_moves.length; i += 1){
        let move = possible_moves[i];
        let current_local_board = make_move_on_board(board, move, advantage_symbol);
        
        let temp = minmax(current_local_board, true, advantage_symbol, disadvantage_symbol, 0);
        let current_score = temp[0];
        let current_depth = temp[1];
        
        console.log(current_score, current_depth);
        if(current_score > best_score){
            best_score = current_score;
            best_move = move;
            best_depth = current_depth;
        }
        else if(current_score === best_score){
            if(current_depth < best_depth){
                best_depth = current_depth;
                best_move = move;
            }
        }
    }
    console.log("\n");
    return best_move;
}



class Field_square extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let source = "";
        let props_val = this.props.value;
        let props_disabled = this.props.is_disabled;
        
        
        if(props_disabled === true){
            return(
                <div className="square_container disabled">
                    {props_val}
                </div>
            )

        }
        else{
            return(
                <div className="square_container" onClick={this.props.onClick}>
                    {props_val}
                </div>
            )
        }
        
    }
}

class Field extends React.Component {
    
    turn: string;
    game_state: string;
    player_symbol: string;
    ai_symbol: string;
    constructor(props) {
        super(props);
        this.state = {
            board: generate_n_size_array(this.props.size, "")
            
        };
        this.turn = "X";
        this.player_symbol = this.props.player_symbol;
        this.ai_symbol = this.props.ai_symbol;
        this.game_state = "";

    }
    
    componentDidMount(){
        window.onkeydown = this.handle_key_down;
        if(this.ai_symbol === "X"){
            let move = select_best_move(this.state.board, this.ai_symbol, this.player_symbol);
            this.handle_click(move[0], move[1]);
        }
    }
    handle_click = (i, j) => {
        
        let new_board = this.state.board;

        new_board[i][j] = this.turn;

        this.setState({
            board: new_board,
        });

        if (this.turn === "X") {
            this.turn = "O";
        } else {
            this.turn = "X";
        }
        this.game_state = check_game_state(new_board);
        if(this.game_state === "" && this.ai_symbol === this.turn){
            let move = select_best_move(this.state.board, this.ai_symbol, this.player_symbol);
            this.handle_click(move[0], move[1]);
        }
        
    };
    handle_key_down = (event) => {
        
        if(event.key === "r"){
            this.turn = "X";
            this.player_symbol = this.props.player_symbol;
            this.ai_symbol = this.props.ai_symbol;
            this.game_state = "";
            this.setState({
                board: generate_n_size_array(this.props.size, "")
            })
            if(this.ai_symbol === "X"){
                let move = select_best_move(this.state.board, this.ai_symbol, this.player_symbol);
                this.handle_click(move[0], move[1]);
            }
        }
    }
    render() {
        let arr = this.state.board;
        let list_squares = arr.map((array, index) => {
            let i = index;
            return (
                <div key={i} className="field_row">
                    {array.map((val, index) => {
                        let j = index;
                        let is_disabled;
                        if(val != "" || this.game_state != ""){
                            is_disabled = true;
                        }
                        else{
                            is_disabled = false;
                        }
                        return (
                            <Field_square
                                key={j}
                                value={val}
                                is_disabled={is_disabled}
                                onClick={() => this.handle_click(i, j)}
                            />
                        );
                    })}
                </div>
            );
        });
        let message = `Next turn: ${this.turn}`;
        if(this.game_state != ""){
            message = `${this.game_state} won!`;
        }
        if(this.game_state === "D"){
            message = "Draw!";
        }
        return (
            <div className="field_container" >
                <h2>{message}</h2>
                {
                    this.game_state != "" &&
                    <h2>Press R to restart</h2>
                }
                {list_squares}
            </div>
        )

    }
}

class Menu extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div>
                <div>
                    <span id="choose_menu_heading">Choose what symbol you play as</span>
                </div>
                <div className="menu">
                    <div onClick={() => this.props.onClick("X")} className="choose_menu_button">
                        <span>X</span>
                    </div>
                    <div onClick={() => this.props.onClick("O")} className="choose_menu_button">
                        <span>O</span>
                    </div>
                </div>
                
            </div>
        )
    }
}

class App extends React.Component {
    player_symbol: any;
    ai_symbol: any;
    field_size: any;
    constructor(props) {
        super(props);
        this.state =  {
            menu_enabled: true
        }
        
        this.player_symbol;
        this.ai_symbol;
        this.field_size = 3;
    }
    handle_symbol_choose_click = (symbol) => {
        this.player_symbol = symbol;
        if(symbol === "X"){
            this.ai_symbol = "O";
        }
        else{
            this.ai_symbol = "X";
        }
        this.setState({
            menu_enabled: false
        })
    }
    render() {
        let menu_enabled = this.state.menu_enabled;
        return (
            <div className="app_container">
                {
                    menu_enabled === true && 
                    <Menu onClick={this.handle_symbol_choose_click}/>
                }
                {
                    menu_enabled === false && 
                    <div className="game_container">
                        <Field size={this.field_size} player_symbol={this.player_symbol} ai_symbol={this.ai_symbol}/>
                    </div>
                }
                
            </div>
        );
    }
}

render(<App />, root);
