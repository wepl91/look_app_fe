import React, { Component } from 'react';
import { withRouter } from 'react-router';

import { Bar } from 'react-chartjs-2';

import withStore from '../../../hocs/withStore';

import { observer } from 'mobx-react';

import { translate } from '../../../lib/Translator';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

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

import moment from 'moment';

@observer
class ServicesReportView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: 'asc',
      sortBy: 'totalAmount',
      data: null,
      branches: null,
      fromDate: moment().startOf('month'),
      toDate: moment(),
      branch: null,
    }
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSort   = this.handleSort.bind(this);
    this.handleSortBy = this.handleSortBy.bind(this);
  }

  handleSortBy(sender, value, name) {
    this.setState({
      sortBy: value
    })
  }

  handleSort(sort) {
    this.setState({
      sort,
    })
  }

  handleChange(sender, value, name, valid) {
    if (name == 'branch' && value == 'null') {
      this.setState({
        branch: null,
      })
    }
    else {
      this.setState({
        [name]: value,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.branch != this.state.branch) {
      this.sendRequest();
    }  
    if (prevState.toDate != this.state.toDate) {
      this.sendRequest();
    }  
    if (prevState.fromDate != this.state.fromDate) {
      this.sendRequest();
    }  
  }

  componentDidMount() {
    this.sendRequest();
    this.setState({
      branches: this.props.store.branches.search({}, 'branches-list', true),
    })
  }

  sendRequest() {
    const reqParams = {};
    if (this.state.branch) {
      reqParams['branchId'] = this.state.branch;
    }
    if (this.state.toDate) {
      reqParams['toDate'] = this.state.toDate;
    }
    if (this.state.fromDate) {
      reqParams['fromDate'] = this.state.fromDate;
    }

    this.setState({
      data: this.props.store.reports.getServicesReport(reqParams)
    })
  }

  sort(data) {
    if (this.state.sort == 'asc') {
      return data.sort((a, b) => b[this.state.sortBy] - a[this.state.sortBy]);
    }
    else {
      return data.sort((a, b) => a[this.state.sortBy] - b[this.state.sortBy]);
    }
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  getChartData() {
    const sortedData = this.sort(this.state.data.toArray());
    return {
      labels: sortedData.map(item => (item.service.name)),
      quantity: sortedData.map(item => (item.service.name)),
      datasets: [
        {
          label: 'Ingresos',
          backgroundColor: 'rgba(125,209,112,0.2)',
          borderColor: 'rgba(125,209,112,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(125,209,112,0.4)',
          hoverBorderColor: 'rgba(125,209,112,1)',
          data: this.state.sortBy == 'totalAmount' ?  
            sortedData.map(item => (parseFloat(item.totalAmount))) : 
            sortedData.map(item => (parseFloat(item.quantity))),
        }
      ]
    };
  }

  getChartConfig() {
    const state = this.state.sortBy;
    return {
      maintainAspectRatio: false,
      title: {
        display: true,
        text: this.getText('Ingresos por servicios'),
        fontSize: '18',
      },
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem) {
            return state == 'totalAmount' ? `Total facturado: $${tooltipItem.yLabel}` : `Total de veces consumido: ${ tooltipItem.yLabel }`
          },
          title: function (tooltipItem) {
            return `Ingresos generados por el servicio de ${tooltipItem[0].xLabel}`
          }
        }
      },
      scales: {
        xAxes: [
          {
            stacked: true
          }
        ],
        yAxes: [
          {
            stacked: true
          }
        ]
      }
    }
  }

  getOptions() {
    return [{
      key: this.getText('Ingresos'),
      value: 'totalAmount',
    },
    {
      key: this.getText('Veces consumidas'),
      value: 'quantity'
    }];
  }

  getBranchesList() {
    const ret = [];
    ret.push({
      key: this.getText('- Ninguna -'),
      value: 'null',
    })
    this.state.branches.toArray().forEach(branch => {
      ret.push({
          key: branch.name || branch.cookedAddress, 
          value: branch.id
        });
      });
    return ret;
  }

  render() {
    const isReportDataLoaded = this.state.data && this.state.data.isOk();
    const isBranchesLoaded = this.state.branches && this.state.branches.isOk();
    if (!isReportDataLoaded || !isBranchesLoaded) return null;
    return (
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{this.getText('Reporte de servicios')}</Title>
          </LevelLeft>
        </Level>
        <hr />
        <Columns>
          <Column isSize={3}>
            <Field label={this.getText('¿Querés filtrar y ver ingresos por sucursal?')}>
              <Select
                icon={ faChevronDown } 
                className="is-fullwidth"
                borderless
                name="branch" 
                onChange={this.handleChange}
                value={ !this.state.branch ? 'null' : this.state.branch }
                options={ this.getBranchesList() } 
                placeholder={this.getText('Sucursal')} />
            </Field>
          </Column>
          <Column isSize={2}>
            <Field label={this.getText('Desde')}>
              <DateTimePicker
                name="fromDate" 
                onChange={ this.handleChange } 
                value={ this.state.fromDate } />
            </Field>
          </Column>
          <Column isSize={2}>
            <Field label={this.getText('Hasta')}>
              <DateTimePicker 
                name="toDate"
                onChange={ this.handleChange } 
                value={ this.state.toDate }  />
            </Field>
          </Column>
          <Column isSize={2}>
            <Field label={this.getText('Ordenar por:')}>
              <Select
                onChange={ this.handleSortBy }
                value={ this.state.sortBy }
                icon={ faChevronDown }
                className="is-fullwidth"
                borderless
                options={ this.getOptions() } />
            </Field>
          </Column>
          <Column isSize={2}>
            <Field label={this.getText('Ordernamiento')}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <input
                    className="ml-1 mr-1"
                    type="radio"
                    value="asc"
                    onChange={() => (this.handleSort('asc'))}
                    checked={this.state.sort == 'asc'} />
                  {this.getText('Ascendiente')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '8px' }}>
                  <input
                    className="ml-1 mr-1"
                    type="radio"
                    value="desc"
                    onChange={() => (this.handleSort('desc'))}
                    checked={this.state.sort == 'desc'} />
                  {this.getText('Descendiente')}
                </div>
              </div>
            </Field>
          </Column>
        </Columns>
        <Columns className="pt-5">
          <Bar
            data={this.getChartData()}
            width={100}
            height={450}
            options={this.getChartConfig()}
          />
        </Columns>
      </React.Fragment>)
  }
}

export default withStore(withRouter(ServicesReportView));