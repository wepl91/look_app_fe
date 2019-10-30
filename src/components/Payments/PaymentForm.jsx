import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css'

import {
  Field,
  Select,
  SelectItem,
  DateTimePicker,
  Text,
  Panel,
} from 'shipnow-mercurio';

import { Checkbox } from '../../components/Checkbox'

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { withStore } from '../../hocs';

import { observer } from 'mobx-react';

import startCase from 'lodash/startCase';

import { horarios } from '../../lib/Mocks';

import moment from 'moment';
import { resolve } from 'url';
import { reject } from 'q';

import { ClientSuggest } from '../../components/Suggest';

@observer
class PaymentForm extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    // const { appointment } = this.props;
    return(
      <React.Fragment>
        <Text>PaymentForm</Text>
      </React.Fragment> )
  }
}

PaymentForm.PropTypes = {

}

PaymentForm.defaultProps = {

}

export default withStore(PaymentForm);