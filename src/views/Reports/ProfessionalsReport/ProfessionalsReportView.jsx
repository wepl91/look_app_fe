import React, { Component } from 'react';
import { withRouter } from 'react-router';

import {Bar} from 'react-chartjs-2';

import withStore from '../../../hocs/withStore';

import { observer } from 'mobx-react';

import { translate } from '../../../lib/Translator'; 

import {
  Column,
  Columns,
  Level,
  LevelLeft
} from 'bloomer';

import {
  Title,
  Select,
  Field,
  DateTimePicker,
} from 'shipnow-mercurio';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

@observer
class ProfessionalsReportView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      branches: null,
    }

    this.handleChangeBranch = this.handleChangeBranch.bind(this);
  }

  handleChangeBranch(sender, value, name, valid) {
    this.setState({
      data: this.props.store.reports.getProfessionalsReport({branchId: value}),
    })
  }

  
  componentDidMount() {
    this.setState({
      data: this.props.store.reports.getProfessionalsReport({}),
      branches: this.props.store.branches.search({}, 'branches-list', true),
    })
  }
  

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  getChartData() {
    debugger
    return {
      labels: this.state.data.toArray().map(item => (item.professional.fullName)),
      datasets: [
        {
          label: 'Ingresos',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: this.state.data.toArray().map(item => (parseFloat(item.totalAmount))),
        }
      ]
    };
  }

  getChartConfig() {
    return {
      maintainAspectRatio: false,
      title: {
        display: true,
        text: this.getText('Ingresos por profesionales'),
        fontSize: '18',
      },
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem) {
            return `Total facturado: $${tooltipItem.yLabel}`
          },
          title: function(tooltipItem) {
            return `Ingresos generados por ${tooltipItem[0].xLabel}`
          } 
        }
      }
    }
  }
  render() {
    const isReportDataLoaded = this.state.data && this.state.data.isOk();
    const isBranchesLoaded = this.state.branches && this.state.branches.isOk();
    if (isReportDataLoaded && isBranchesLoaded) {
      return(
        <React.Fragment>
          <Level>
            <LevelLeft>
              <Title>{ this.getText('Reporte de profesionales') }</Title>
            </LevelLeft>
          </Level>
          <hr/>
            <Columns>
              <Column isSize={ 3 }>
                <Field label={ this.getText('¿Querés filtrar y ver ingresos por sucursal?') }>
                <Select 
                  className="is-fullwidth" 
                  placeholder="Sucursales" 
                  name="branch" 
                  borderless 
                  icon={ faChevronDown } 
                  options={ this.state.branches.toArray().map(branch => ({key: branch.name || branch.cookedAddress, value: branch.id})) } 
                  onChange={this.handleChangeBranch} />
                </Field>
              </Column>
              <Column isSize={ 3 }>
                <Field label={ this.getText('Desde') }>
                  <DateTimePicker />
                </Field>
              </Column>
              <Column isSize={ 3 }>
                <Field label={ this.getText('Hasta') }>
                  <DateTimePicker />
                </Field>
              </Column>
            </Columns>
          <Columns className="pt-5">
          <Bar
            key={ this.state.data }
            data={this.getChartData()}
            width={100}
            height={450}
            options={this.getChartConfig()}
        />
          </Columns>
        </React.Fragment> );
    }
    return null
  }
}

export default withStore(withRouter(ProfessionalsReportView));