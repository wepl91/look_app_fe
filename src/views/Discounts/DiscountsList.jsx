import React, { Component } from 'react';

import withStore from '../../hocs/withStore';
import { withToastManager } from 'react-toast-notifications';

import { observer } from 'mobx-react';

import startCase from 'lodash/startCase';

import { faSpinner, faPercent, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import {
  Loader,
  Title,
  Text,
  Table,
  Button,
  SelectableIcon,
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight
} from 'bloomer';

import { DiscountEditModal } from '../../components/Discounts';

import { translate } from '../../lib/Translator';

@observer
class DiscountsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      discounts: null,
      showModal: false,
    }
    
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.setState({
      discounts: this.props.store.discounts.search({}, 'discount-list-view', true),
    });    
  }

  handleSave() {
    this.setState({
      showModal: false,
      discounts: this.props.store.discounts.search({}, 'discount-list-view', true),
    });   
  }

  handleCloseModal() {
    this.setState({
      discount: null,
      showModal: false,
    })
  }

  handleShowModal( discount ) {
    this.setState({
      showModal: true,
      discount: discount,
    })
  }

  handleActivate( discount ) {
    const { toastManager } = this.props;
    discount.activate().andThen( (savedDiscount, responseError) => {
      if (responseError) {
        toastManager.add("Ups! Parece que hubo un error al activar la promoción!", {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
      else {
        let text = <Text color="warning" weight="medium" className="mt-1 mb-1">¡La promoción ha sido marcada como activa!</Text>
        toastManager.add(text, {
          appearance: 'warning',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
    })
  }

  handleInactivate( discount ) {
    const { toastManager } = this.props;
    discount.deactivate().andThen( (savedDiscount, responseError) => {
      if (responseError) {
        toastManager.add("Ups! Parece que hubo un error al desactivar la promoción!", {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
      else {
        let text = <Text color="warning" weight="medium" className="mt-1 mb-1">¡La promoción ha sido marcada como inactiva!</Text>
        toastManager.add(text, {
          appearance: 'warning',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
    })
  }

  renderTable() {
    const data = this.state.discounts.toArray();

    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon  className="ml-2" icon={ faPercent } readOnly/>),
        size: 'is-1',
      },
      {
        label: this.getText('Nombre'),
        content: (data) => (<Text>{ startCase( data.name ) || this.getText('- sin nombre -') }</Text>),
        size: 'is-2'
      },
      {
        label: this.getText('Beneficio'),
        content: (data) => (<Text>{ 
          !data.pointFactor && !data.discount ? this.getText('- sin beneficio -') :
            data.type=='POINT' ? data.pointFactor + this.getText('x puntos') : data.discount + this.getText('% de descuento')
          }</Text>),
        size: 'is-1'
      },
      {
        label: this.getText('Fecha de inicio'),
        content: (data) => (<Text>{ data.cookedStartingDate || this.getText('- sin fecha -') }</Text>),
        size: 'is-2',
      },
      {
        label: this.getText('Fecha de finalización'),
        content: (data) => (<Text>{ data.cookedEndingDate || this.getText('- sin fecha -') }</Text>),
        size: 'is-2',
      },
      {
        label: this.getText('Servicios incluidos'),
        content: (data) => (
          data.discountedServices.length > 0 ?
          <Dropdown className="is-fullwidth">
            <DropdownToggle className="is-fullwidth">
              <Text>
                { `${ this.getText('Servicios') } ` }
                <FontAwesomeIcon className="mr-1" icon={ faChevronDown } size="xs" fixedWidth/>
              </Text>
            </DropdownToggle>
            <DropdownPanel>
            {data.discountedServices.map(name => (
                  <Text className="mb-1" size="md" ><FontAwesomeIcon className="mr-1" icon={ faDotCircle } size="xs" fixedWidth/>{ name }</Text> 
            ))}
            </DropdownPanel>
        </Dropdown>
        :
        <Text>{ this.getText('- Sin servicios -') }</Text>
        ),
      },
      {
        label: this.getText('Activa'),
        content: (data) => (<Toggle checked={ data.isActive } checkedColor="success" unCheckedColor="delete" onChange={ () => (data.isActive ? this.handleInactivate(data) : this.handleActivate(data)) }/>),
        size: 'is-1',
      },
      {
        label: '',
        content: (data) => (<Button icon={ faPencilAlt } kind="link" onClick={ () => (this.handleShowModal(data)) } />),
        size: 'is-1',
        align: 'center'
      },
    ]

    return <Table columns={ columns } data={ data } striped={ false }/>
  }

  renderModal() {
    return <DiscountEditModal discount={ this.state.discount } onClose={ this.handleCloseModal } onSave={ this.handleSave }/>;
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }
  
  render() {
    const isDiscountsLoaded = this.state.discounts && this.state.discounts.isOk();
    if (!isDiscountsLoaded) {
      return <Loader icon={ faSpinner } label={ this.getText('Cargando las promociones..') } className="fullscreen" />
    }
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{ this.getText('Listado de promociones') }</Title>
          </LevelLeft>
        </Level>
        <hr/>
        { this.renderTable() }
        { this.state.showModal && this.renderModal() }
      </React.Fragment> )
  }
}

export default withToastManager(withStore(DiscountsList));