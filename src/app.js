"use strict";var __extends=this&&this.__extends||function(){var r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)};return function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}}();exports.__esModule=!0;var React=require("react"),react_dom_1=require("react-dom"),main=document.querySelector("#root"),Field_square=function(t){function e(e){return t.call(this,e)||this}return __extends(e,t),e.prototype.render=function(){var e=this.props.value;return React.createElement("div",{className:"square_container",onClick:this.props.onClick},React.createElement("span",null,e))},e}(React.Component),Field=function(n){function e(e){var t=n.call(this,e)||this;return t.handle_click=function(e,t){console.log(e,t)},t.state={board:Array(3).fill(Array(3).fill("O"))},t}return __extends(e,n),e.prototype.render=function(){var n=this,e=this.state.board.map(function(e,t){return React.createElement("div",{key:t,className:"field_row"},e.map(function(e,t){return React.createElement(Field_square,{key:t,value:e,onClick:function(e){n.handle_click(id,e)}})}))});return React.createElement("div",{className:"field_container"},e)},e}(React.Component),App=function(t){function e(e){return t.call(this,e)||this}return __extends(e,t),e.prototype.render=function(){return React.createElement("div",{className:"game_container"},React.createElement(Field,null))},e}(React.Component);react_dom_1.render(React.createElement(App,null),main);turn _this;
    }
    Field.prototype.render = function () {
        var _this = this;
        var arr = this.state.board;
        var list_squares = arr.map(function (array, index) {
            var i = index;
            return (React.createElement("div", { key: i, className: "field_row" }, array.map(function (val, index) {
                var j = index;
                return React.createElement(Field_square, { key: j, value: val, onClick: function (e) { _this.handle_click(id, e); } });
            })));
        });
        return (React.createElement("div", { className: "field_container" }, list_squares));
    };
    return Field;
}(React.Component));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        return _super.call(this, props) || this;
    }
    App.prototype.render = function () {
        return (React.createElement("div", { className: "game_container" },
            React.createElement(Field, null)));
    };
    return App;
}(React.Component));
react_dom_1.render(React.createElement(App, null), main);
