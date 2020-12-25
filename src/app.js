"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = require("react");
var react_dom_1 = require("react-dom");
var root = document.querySelector("#root");
function copy_array(arr) {
    var new_arr = [];
    for (var i = 0; i < arr.length; i += 1) {
        var type = typeof (arr[i]);
        var value = arr[i];
        if (type === "object") {
            value = copy_array(value);
        }
        new_arr.push(value);
    }
    return new_arr;
}
function generate_n_size_array(size, fill) {
    var output_arr = [];
    for (var i = 0; i < size; i += 1) {
        var row = [];
        for (var j = 0; j < size; j += 1) {
            row.push(fill);
        }
        output_arr.push(row);
    }
    return output_arr;
}
function check_game_state(board) {
    var all_filled = true;
    var row_length = board.length;
    var column_length = board[0].length;
    var columns = generate_n_size_array(column_length, "");
    //Check for full rows
    for (var row_index_1 = 0; row_index_1 < row_length; row_index_1 += 1) {
        var row = board[row_index_1];
        var x_count = 0;
        var o_count = 0;
        for (var i = 0; i < row.length; i += 1) {
            columns[i][row_index_1] = row[i];
            if (row[i] === "X") {
                x_count += 1;
            }
            else if (row[i] === "O") {
                o_count += 1;
            }
        }
        if (x_count === row_length) {
            return "X";
        }
        if (o_count === row_length) {
            return "O";
        }
    }
    //debugger;
    //Check for full columns
    for (var column_index_1 = 0; column_index_1 < column_length; column_index_1 += 1) {
        var column = columns[column_index_1];
        var x_count = 0;
        var o_count = 0;
        for (var i = 0; i < column.length; i += 1) {
            if (column[i] === "X") {
                x_count += 1;
            }
            else if (column[i] === "O") {
                o_count += 1;
            }
            else {
                all_filled = false;
            }
        }
        if (x_count === column_length) {
            return "X";
        }
        if (o_count === column_length) {
            return "O";
        }
    }
    //Get diagnals
    var diagnals = [];
    var left_diangal = [];
    for (var row_index_2 = 0; row_index_2 < row_length; row_index_2 += 1) {
        left_diangal.push(board[row_index_2][row_index_2]);
    }
    var right_diangal = [];
    var row_index = 0;
    var column_index = column_length - 1;
    for (row_index; row_index < row_length; row_index += 1) {
        right_diangal.push(board[row_index][column_index]);
        column_index -= 1;
    }
    diagnals.push(left_diangal);
    diagnals.push(right_diangal);
    //Check diagnals
    for (var diagnal_index = 0; diagnal_index < 2; diagnal_index += 1) {
        var diagnal = diagnals[diagnal_index];
        var x_count = 0;
        var o_count = 0;
        for (var i = 0; i < diagnal.length; i += 1) {
            if (diagnal[i] === "X") {
                x_count += 1;
            }
            else if (diagnal[i] === "O") {
                o_count += 1;
            }
        }
        if (x_count === row_length) {
            return "X";
        }
        if (o_count === row_length) {
            return "O";
        }
    }
    //Check if all squares are filled
    if (all_filled === true) {
        return "D";
    }
    return "";
}
function get_possible_moves(board) {
    var row_length = board.length;
    var possible_moves_arr = [];
    for (var row_index = 0; row_index < row_length; row_index += 1) {
        for (var column_index = 0; column_index < row_length; column_index += 1) {
            var value = board[row_index][column_index];
            if (value === "") {
                var possible_move = [row_index, column_index];
                possible_moves_arr.push(possible_move);
            }
        }
    }
    return possible_moves_arr;
}
function make_move_on_board(board, move, symbol) {
    var local_board = copy_array(board);
    local_board[move[0]][move[1]] = symbol;
    return local_board;
}
function minmax(board, minimize, advantage_symbol, disadvantage_symbol, depth) {
    var outcome = check_game_state(board);
    switch (outcome) {
        case "X":
            if (advantage_symbol === "X") {
                return [1, depth];
            }
            else {
                return [-1, depth];
            }
        case "O":
            if (advantage_symbol === "O") {
                return [1, depth];
            }
            else {
                return [-1, depth];
            }
        case "D":
            return [0, depth];
    }
    if (minimize === true) {
        var worst_score = Infinity;
        var best_depth = Infinity;
        var possible_moves = get_possible_moves(board);
        for (var i = 0; i < possible_moves.length; i += 1) {
            var move = possible_moves[i];
            var current_board = make_move_on_board(board, move, disadvantage_symbol);
            var temp = minmax(current_board, false, advantage_symbol, disadvantage_symbol, depth + 1);
            var current_score = temp[0];
            var current_depth = temp[1];
            if (current_score < worst_score) {
                worst_score = current_score;
                best_depth = current_depth;
            }
            else if (current_score === worst_score) {
                if (current_depth < best_depth) {
                    best_depth = current_depth;
                }
            }
        }
        return [worst_score, best_depth];
    }
    else {
        var best_score = -Infinity;
        var best_depth = Infinity;
        var possible_moves = get_possible_moves(board);
        for (var i = 0; i < possible_moves.length; i += 1) {
            var move = possible_moves[i];
            var current_board = make_move_on_board(board, move, advantage_symbol);
            var temp = minmax(current_board, true, advantage_symbol, disadvantage_symbol, depth + 1);
            var current_score = temp[0];
            var current_depth = temp[1];
            if (current_score > best_score) {
                best_score = current_score;
                best_depth = current_depth;
            }
            else if (current_score === best_score) {
                if (current_depth < best_depth) {
                    best_depth = current_depth;
                }
            }
        }
        return [best_score, best_depth];
    }
}
function select_best_move(board, advantage_symbol, disadvantage_symbol) {
    var best_score = -Infinity;
    var best_depth = Infinity;
    var best_move;
    var possible_moves = get_possible_moves(board);
    for (var i = 0; i < possible_moves.length; i += 1) {
        var move = possible_moves[i];
        var current_local_board = make_move_on_board(board, move, advantage_symbol);
        var temp = minmax(current_local_board, true, advantage_symbol, disadvantage_symbol, 0);
        var current_score = temp[0];
        var current_depth = temp[1];
        console.log(current_score, current_depth);
        if (current_score > best_score) {
            best_score = current_score;
            best_move = move;
            best_depth = current_depth;
        }
        else if (current_score === best_score) {
            if (current_depth < best_depth) {
                best_depth = current_depth;
                best_move = move;
            }
        }
    }
    console.log("\n");
    return best_move;
}
var Field_square = /** @class */ (function (_super) {
    __extends(Field_square, _super);
    function Field_square(props) {
        return _super.call(this, props) || this;
    }
    Field_square.prototype.render = function () {
        var source = "";
        var props_val = this.props.value;
        var props_disabled = this.props.is_disabled;
        if (props_disabled === true) {
            return (React.createElement("div", { className: "square_container disabled" }, props_val));
        }
        else {
            return (React.createElement("div", { className: "square_container", onClick: this.props.onClick }, props_val));
        }
    };
    return Field_square;
}(React.Component));
var Field = /** @class */ (function (_super) {
    __extends(Field, _super);
    function Field(props) {
        var _this = _super.call(this, props) || this;
        _this.handle_click = function (i, j) {
            var new_board = _this.state.board;
            new_board[i][j] = _this.turn;
            _this.setState({
                board: new_board
            });
            if (_this.turn === "X") {
                _this.turn = "O";
            }
            else {
                _this.turn = "X";
            }
            _this.game_state = check_game_state(new_board);
            if (_this.game_state === "" && _this.ai_symbol === _this.turn) {
                var move = select_best_move(_this.state.board, _this.ai_symbol, _this.player_symbol);
                _this.handle_click(move[0], move[1]);
            }
        };
        _this.handle_key_down = function (event) {
            if (event.key === "r") {
                _this.turn = "X";
                _this.player_symbol = _this.props.player_symbol;
                _this.ai_symbol = _this.props.ai_symbol;
                _this.game_state = "";
                _this.setState({
                    board: generate_n_size_array(_this.props.size, "")
                });
                if (_this.ai_symbol === "X") {
                    var move = select_best_move(_this.state.board, _this.ai_symbol, _this.player_symbol);
                    _this.handle_click(move[0], move[1]);
                }
            }
        };
        _this.state = {
            board: generate_n_size_array(_this.props.size, "")
        };
        _this.turn = "X";
        _this.player_symbol = _this.props.player_symbol;
        _this.ai_symbol = _this.props.ai_symbol;
        _this.game_state = "";
        return _this;
    }
    Field.prototype.componentDidMount = function () {
        window.onkeydown = this.handle_key_down;
        if (this.ai_symbol === "X") {
            var move = select_best_move(this.state.board, this.ai_symbol, this.player_symbol);
            this.handle_click(move[0], move[1]);
        }
    };
    Field.prototype.render = function () {
        var _this = this;
        var arr = this.state.board;
        var list_squares = arr.map(function (array, index) {
            var i = index;
            return (React.createElement("div", { key: i, className: "field_row" }, array.map(function (val, index) {
                var j = index;
                var is_disabled;
                if (val != "" || _this.game_state != "") {
                    is_disabled = true;
                }
                else {
                    is_disabled = false;
                }
                return (React.createElement(Field_square, { key: j, value: val, is_disabled: is_disabled, onClick: function () { return _this.handle_click(i, j); } }));
            })));
        });
        var message = "Next turn: " + this.turn;
        if (this.game_state != "") {
            message = this.game_state + " won!";
        }
        if (this.game_state === "D") {
            message = "Draw!";
        }
        return (React.createElement("div", { className: "field_container" },
            React.createElement("h2", null, message),
            this.game_state != "" &&
                React.createElement("h2", null, "Press R to restart"),
            list_squares));
    };
    return Field;
}(React.Component));
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu(props) {
        return _super.call(this, props) || this;
    }
    Menu.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("span", { id: "choose_menu_heading" }, "Choose what symbol you play as")),
            React.createElement("div", { className: "menu" },
                React.createElement("div", { onClick: function () { return _this.props.onClick("X"); }, className: "choose_menu_button" },
                    React.createElement("span", null, "X")),
                React.createElement("div", { onClick: function () { return _this.props.onClick("O"); }, className: "choose_menu_button" },
                    React.createElement("span", null, "O")))));
    };
    return Menu;
}(React.Component));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.handle_symbol_choose_click = function (symbol) {
            _this.player_symbol = symbol;
            if (symbol === "X") {
                _this.ai_symbol = "O";
            }
            else {
                _this.ai_symbol = "X";
            }
            _this.setState({
                menu_enabled: false
            });
        };
        _this.state = {
            menu_enabled: true
        };
        _this.player_symbol;
        _this.ai_symbol;
        _this.field_size = 3;
        return _this;
    }
    App.prototype.render = function () {
        var menu_enabled = this.state.menu_enabled;
        return (React.createElement("div", { className: "app_container" },
            menu_enabled === true &&
                React.createElement(Menu, { onClick: this.handle_symbol_choose_click }),
            menu_enabled === false &&
                React.createElement("div", { className: "game_container" },
                    React.createElement(Field, { size: this.field_size, player_symbol: this.player_symbol, ai_symbol: this.ai_symbol }))));
    };
    return App;
}(React.Component));
react_dom_1.render(React.createElement(App, null), root);
