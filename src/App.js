import React from 'react';

/**
 * this calculator uses the Formula/Expression Logic
 * EXAMPLE: 3 + 5 x 6 - 2 / 4 =
 * Immediate Execution Logic: 11.5
 * Formula/Expression Logic: 32.5
 */

class Calculator extends React.Component {
  constructor(props) {
    super(props)
    /**
     * As I input numbers, I should be able to see my input in the element with the id of display
     * @param {string} output  fulfil this functionality
     *
     *
     * When the decimal element is clicked, a . should append to the currently displayed value; two .
     * in one number should not be accepted.
     * @param {string} decimal  tell if the current number has . or not
     *
     * Pressing an operator immediately following = should start a new calculation
     * that operates on the result of the previous evaluation.
     * @param {string} evalutated tell  if = clicked or not 
     * @param {string} lastResult  store  the result of the previous evaluation.
     */
    this.state = {
      output: "0",
      formula: "",
      lastResult: "",
      evalutated: false,
      decimal: false
    }



  }
  /**
   * pressing the clear button clears the input and output values, and returns the calculator to its initialized state;
   * 0 should be shown in the element with the id of display.
   */
  clearScreen = () => {
    this.setState({
      output: "0",
      formula: "",
      lastResult: "",
      evalutated: false,
      decimal: false
    }
    )
  }
  handelClick = (e) => {
    console.log("fuck" + this.state.output);
    const isOperator = /[x/+]/
    let { output, formula, evalutated, lastResult, decimal } = this.state
    if (e.currentTarget.value.match(isOperator)) {
      this.state.decimal = false
    }
    /**
     *  When inputting numbers, my calculator should not allow a number to begin with multiple zeros.
     */
    if (output === "0" && formula === "") {
      this.updateState(e.currentTarget.value, e.currentTarget.value);

    }
    else if (output === "0" && formula != "") {
      this.updateState(e.currentTarget.value, formula.concat(e.currentTarget.value));

    }
    /***
     *  Pressing an operator immediately following = should start a new calculation
     * that operates on the result of the previous evaluation.
    */
    else if (e.currentTarget.value.match(isOperator) && evalutated) {

      output = lastResult + e.currentTarget.value;
      this.setState({ evalutated: false })

      this.updateState(output, output)
    }
    else if (!formula.includes("=")) {
      // hna
      if (!formula.slice(-1).match(isOperator)) {
        if (!decimal) {
          this.updateState(e.currentTarget.value, formula.concat(e.currentTarget.value));
        }
        else if (decimal) {
          output = output.concat(e.currentTarget.value)
          this.updateState(output, formula.concat(e.currentTarget.value));

        }
      }
      else if (formula.slice(-1).match(isOperator) && !e.currentTarget.value.match(isOperator)) {
        this.updateState(e.currentTarget.value, formula.concat(e.currentTarget.value));
      }
      /**
       * If 2 or more operators are entered consecutively, the operation performed should be the last operator
       *   entered (excluding the negative (-) sign).
       * For example, if 5 + * 7 = is entered, the result should be 35 (i.e. 5 * 7);
       * if 5 * - 5 = is entered, * the result should be -25 (i.e. 5 * (-5)).
       * */
      else if (formula.slice(-1).match(isOperator) && e.currentTarget.value.match(isOperator)) {
        if (e.currentTarget.value.match(/‑/)) {
          this.updateState(e.currentTarget.value, formula.concat(e.currentTarget.value))
        } else {
          this.setState({
            formula: formula.slice(0, -1) + e.currentTarget.value,
            output: e.currentTarget.value
          })
          this.updateState(e.currentTarget.value, formula.replace(/.$/, e.currentTarget.value))
        }

      }
    }
    else if (formula.includes("=")) {
      this.updateState(e.currentTarget.value, e.currentTarget.value)
    }
  }
  handleDecimal = () => {
    let { decimal, _ } = this.state
    if (!decimal) {
      let output = this.state.output.concat('.')
      this.setState({
        output: output,
        formula: this.state.formula.concat('.'),
        decimal: true
      });
    }
  }

  /**
   * when I hit =, the correct result should be shown in the element with the id of display.
   * eval() handel this functionality

   }
   */
  eval = () => {
    let { formula, _ } = this.state, endsWithOperator = /[*+‑/]$/,
      endsWithNegativeSign = /\d[x/+‑]{1}‑$/
    /** Never use eval()!,
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!
     * */

    while (endsWithOperator.test(formula) || endsWithNegativeSign.test(formula)) {
      formula = formula.slice(0, -1);
    }
    while (formula.match(/[+|-|/|*]0/)) {
      formula = formula.replace("+0", "+")
      formula = formula.replace("-0", "-")
      formula = formula.replace("/0", "/")
      formula = formula.replace("*0", "*")
    }

    formula = formula.replace(/‑/g, "-").replace('--', '+').replace(/[+|*|/|-]0/g,)/** ?_? */
    console.log(formula)
    let evaluateMe = Math.round(1000000000000 * eval(formula)) / 1000000000000;

    this.setState({
      output: evaluateMe,
      formula: formula.concat("=" + evaluateMe),
      lastResult: evaluateMe,
      evalutated: true


    })

  }


  updateState(output, formula) {
    this.setState({
      output: output,
      formula: formula
    });
  }



  render() {
    return (
    <div>
      <div className="calculator">
        <Formula formula={this.state.formula} />
        <Output output={this.state.output} />
        <Buttons clear={this.clearScreen}
          handelClick={this.handelClick}
          eval={this.eval}
          handleDecimal={this.handleDecimal}

        />
     
      </div>
      <div id="note">
          this calculator uses the Formula/Expression Logic
           EXAMPLE: <mark>3 + 5 x 6 - 2 / 4 =</mark><br/>
           Immediate Execution Logic: 11.5<br/>
           Formula/Expression Logic: <mark>32.5</mark><br/>
          
          </div>
      </div>
    );
  }
}
class Buttons extends React.Component {

  render() {
    return (
      <div>
        <button
          className="btn-lg"
          id="clear"
          onClick={this.props.clear}
          className="btn-lg"
          value="AC"
        >
          AC{this.props.clear}
        </button>
        <button
          id="divide"
          onClick={this.props.handelClick}
          className="operator"
          value="/"
        >
          /
        </button>
        <button
          id="multiply"
          onClick={this.props.handelClick}
          className="operator"
          value="*"
        >
          x
        </button>
        <button id="seven" onClick={this.props.handelClick} value="7">
          7
        </button>
        <button id="eight" onClick={this.props.handelClick} value="8">
          8
        </button>
        <button id="nine" onClick={this.props.handelClick} value="9">
          9
        </button>
        <button
          id="subtract"
          onClick={this.props.handelClick}
          className="operator"
          value="‑"
        >
          ‑
        </button>
        <button id="four" onClick={this.props.handelClick} value="4">
          4
        </button>
        <button id="five" onClick={this.props.handelClick} value="5">
          5
        </button>
        <button id="six" onClick={this.props.handelClick} value="6">
          6
        </button>
        <button
          id="add"
          onClick={this.props.handelClick}
          className="operator"
          value="+"
        >
          +
        </button>
        <button id="one" onClick={this.props.handelClick} value="1">
          1
        </button>
        <button id="two" onClick={this.props.handelClick} value="2">
          2
        </button>
        <button id="three" onClick={this.props.handelClick} value="3">
          3
        </button>
        <button
          className="btn-lg"
          id="zero"
          onClick={this.props.handelClick}
          value="0"
        >
          0
        </button>
        <button id="decimal" onClick={this.props.handleDecimal} value=".">
          .
        </button>
        <button
          id="equals"
          onClick={this.props.eval}
          // style={equalsStyle}
          value="="
        >
          =
        </button>
      </div>
    );
  }
}
class Output extends React.Component {
  render() {
    return (

      <div id="display-screen">
        {this.props.output}
      </div>
    );
  }
}

class Formula extends React.Component {
  render() {
    return (
      <div id="formula-screen" >
        {this.props.formula}
      </div>
    );
  }
}



export default Calculator;
