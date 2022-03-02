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
     *
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

  // delete the last number  entered
  del = () => {
    // let newShit = str.slice(0, -1);
    console.log(this.state);
  }
  handelClick = (e) => {
    const isOperator = new RegExp('[+\-/]')
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
        console.log('fuck');
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
    // console.log(formula)
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
      <>
        <div className="calculator">
          <Theme />
          <div className="calculator__screen">
            <Formula formula={this.state.formula} />
            <Output output={this.state.output} />
          </div>
          <Buttons clear={this.clearScreen}
            handelClick={this.handelClick}
            del={this.del}
            eval={this.eval}
            handleDecimal={this.handleDecimal}

          />

        </div>
        <div id="note">
          this calculator uses the Formula/Expression Logic
          EXAMPLE: <mark>3 + 5 x 6 - 2 / 4 =</mark><br />
          Immediate Execution Logic: 11.5<br />
          Formula/Expression Logic: <mark>32.5</mark><br />

        </div>
      </>
    );
  }
}

class Buttons extends React.Component {

  render() {
    return (
      <div className="key-container">
        <button id="seven" className="btn btn-7" onClick={this.props.handelClick} value="7">7</button>
        <button id="eight" className="btn btn-8" onClick={this.props.handelClick} value="8">8</button>
        <button id="nine" className="btn btn-9" onClick={this.props.handelClick} value="9">9</button>
        <button className="btn btn-blue btn-del" onClick={this.props.del} >DEL</button>
        <button id="four" className="btn btn-4" onClick={this.props.handelClick} value="4">4</button>
        <button id="five" className="btn btn-5" onClick={this.props.handelClick} value="5">5</button>
        <button id="six" className="btn btn-6" onClick={this.props.handelClick} value="6">6</button>
        <button id="add"
          onClick={this.props.handelClick}
          className="operator btn  btn-add"
          value="+"
        >+</button>
        <button id="one" className="btn btn-1" onClick={this.props.handelClick} value="1">1</button>
        <button id="two" className="btn btn-2" onClick={this.props.handelClick} value="2">2</button>
        <button id="three" className="btn btn-3" onClick={this.props.handelClick} value="3">3</button>
        <button id="subtract"
          onClick={this.props.handelClick}
          className="operator btn  btn-sub"
          value="‑">‑</button>
        <button id="decimal" className="btn btn-dec" onClick={this.props.handleDecimal} value=".">.</button>
        <button className="btn btn-0 "
          id="zero"
          onClick={this.props.handelClick}
          value="0"
        >0</button>
        <button id="divide"
          onClick={this.props.handelClick}
          className="operator btn btn-div"
          value="/"
        >/</button>
        <button id="multiply"
          onClick={this.props.handelClick}
          className="operator btn btn-mul"
          value="*"
        >x</button>
        <button className=" btn btn-clr btn-lg"
          id="clear"
          onClick={this.props.clear}
          value="AC">clear{this.props.clear}</button>

        <button id="equals"
          onClick={this.props.eval}
          // style={equalsStyle}
          value="=" className="btn btn-eq btn-lg"
        >=</button>
      </div>
    );
  }
}

class Output extends React.Component {
  render() {
    return (

      <div className='calculator__screen-display' >
        {this.props.output}
      </div >
    );
  }
}

class Formula extends React.Component {
  render() {
    return (
      <div className='calculator__screen-formula' >
        {this.props.formula}
      </div >
    );
  }
}

// theme switcher classs
class Theme extends React.Component {
  constructor(props) {
    super(props)
    /**
     * @param {string} theme  store  the  previous theme.
     */
    this.state = {
      theme: 'theme-1'
    }


  }

  setTheme = (theme) => {

    const targetClasses = document.getElementById('root').classList
    const previousTheme = this.state.theme
    targetClasses.replace(previousTheme, theme)
    this.setState({ theme })



    // toggle active class to the the theme toggle theme

    // select All the toggle btns

    // get the theme number form the theme parametre (get the last character of a string )
    const currenThemeNumber = theme.slice(-1)
    const previousThemeNumber = previousTheme.slice(-1)

    // add the 'active' class if the current button is corresponding to the current theme
    // for example
    // theme = 'them-1' the 'active' will be added to the toggle button  which has the class 'btn-toggle-1'
    document.querySelector(`.btn-toggle-${currenThemeNumber}`).classList.toggle('active')

    // remove the 'active' class if the current button is corresponding to the previous theme
    document.querySelector(`.btn-toggle-${previousThemeNumber}`).classList.toggle('active')



    // dumb version
    // toggleBtns.forEach(btn => {
    //   if (btn.classList.contains(`btn-toggle-${currenThemeNumber}`)) {
    //     // add the 'active' class if the current button is corresponding to the current theme
    //     // for example
    //     // theme = 'them-1' the 'active' will be added to the toggle button  which has the class 'btn-toggle-1'
    //     btn.classList.add('active')
    //   }
    //   else if (btn.classList.contains('active')) {
    //     // remove the 'active' class if the current button is corresponding to the previous theme
    //     btn.classList.remove('active')
    //   }
    // });

  }
  render() {
    return (
      <div className="themes-container" >
        <p className="primary">calc</p>
        <div className="themes-toggle">
          <p className="secondary">theme</p>
          <div className="toggle">
            <div className="toggle-numbers">
              <span className="toggle-number">1</span>
              <span className="toggle-number">2</span>
              <span className="toggle-number">3</span></div>
            <div className="toggle-btns">
              <button className="btn-toggle btn-toggle-1 active" type="button" onClick={() => this.setTheme('theme-1')}></button>
              <button className="btn-toggle btn-toggle-2" type="button" onClick={() => this.setTheme('theme-2')}></button>
              <button className="btn-toggle btn-toggle-3" type="button" onClick={() => this.setTheme('theme-3')}></button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}



export default Calculator;
