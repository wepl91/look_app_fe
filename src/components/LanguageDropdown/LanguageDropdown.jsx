import React, { Component } from 'react';
import { DropdownMenuItem, Button, DropdownMenu, Dropdown, DropdownToggle } from 'shipnow-mercurio';
import { withStore } from '../../hocs';
import { translate } from '../../lib/Translator';

class LanguageDropdown extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      language: this.props.store.ui.language
    }
  }

  handleChange( sender, value, name ) {
    if (value == 'ESP') {
      this.props.store.ui.setLanguageToSpanish();
    }
    else {
      this.props.store.ui.setLanguageToEnglish();
    }
    this.setState({
      language: this.props.store.ui.language
    })
  }

  render() {
    return(
        <Dropdown direction="bottom-left">
          <DropdownToggle>
            <Button kind="link" invert >{ `${ translate('Idioma', this.props.store.ui.language)}: ${ translate(this.props.store.ui.language, this.props.store.ui.language)}` }</Button>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownMenuItem onClick={ this.handleChange } name="ESP" value="ESP">{ translate('Español', this.props.store.ui.language) }</DropdownMenuItem>
            <DropdownMenuItem onClick={ this.handleChange } name="ENG" value="ENG">{ translate('Ingles', this.props.store.ui.language) }</DropdownMenuItem>
          </DropdownMenu> 
        </Dropdown> )
  }
}

export default withStore(LanguageDropdown);