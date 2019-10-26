import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

import {
  Text
} from 'shipnow-mercurio';

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";

class Checkbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: props.checked
    }

    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck() {
    const prevState = this.state.checked;
    const { value } = this.props;
    this.setState({
      checked: !prevState,
    }, () => ( this.props.onCheck && this.props.onCheck(value, !prevState) ))
  }

  render() {
    const { children, size, className } = this.props;
    const { checked } = this.state;
    return(
      <Text color="black" weight="medium" className={ className } onClick={ this.handleCheck } size={ size }>
        <FontAwesomeIcon className="ml-1 mr-1" size="sm" icon={ checked ? faCheckSquare : faSquare }/>
        { children }
      </Text> );
  }
}

Checkbox.PropTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  checked: PropTypes.bool,
  children: PropTypes.node,
  onCheck: PropTypes.func,
  value: PropTypes.any,
};
Checkbox.defaultProps = {
  className: PropTypes.string,
  size: "lg",
  checked: false,
  children: '',
  onCheck: null,
  value: null
}

export default Checkbox;