import React, { Component } from 'react';
import { DropdownMenuItem, Button, DropdownMenu, Dropdown, DropdownToggle } from 'shipnow-mercurio';
import { withStore } from '../../hocs';

class LanguageDropdown extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      languag: this.props.store.ui.language
    }
  }

  handleChange( sender, value, name ) {
    this.props.store.ui.language = value;
    this.setState({
      language: this.props.store.ui.language
    })
  }

  render() {
    return(
        <Dropdown direction="bottom-left">
          <DropdownToggle>
            <Button kind="link" invert >{ `Idioma: ${ this.props.store.ui.language }` }</Button>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownMenuItem onClick={ this.handleChange } name="ESP" value="ESP">Español</DropdownMenuItem>
            <DropdownMenuItem onClick={ this.handleChange } name="ENG" value="ENG">English</DropdownMenuItem>
          </DropdownMenu> 
        </Dropdown> )
  }
}

export default withStore(LanguageDropdown);