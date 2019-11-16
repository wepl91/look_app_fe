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

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';

@observer
class ProfessionalsReportView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: 'asc',
      data: null,
      branches: null,
      fromDate: moment().startOf('month'),
      toDate: moment(),
      branch: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSort   = this.handleSort.bind(this);
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
      data: this.props.store.reports.getProfessionalsReport(reqParams)
    })
  }

  componentDidMount() {
    this.sendRequest();
    this.setState({
      branches: this.props.store.branches.search({}, 'branches-list', true),
    })
  }
  

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  sort(data) {
    if (this.state.sort == 'asc') {
      return data.sort((a, b) => b.totalAmount - a.totalAmount);
    }
    else {
      return data.sort((a, b) => a.totalAmount - b.totalAmount);
    }
  }

  getChartData() {
    const sortedData = this.sort(this.state.data.toArray());
    return {
      labels: sortedData.map(item => (item.professional.fullName)),
      datasets: [
        {
          label: 'Ingresos',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: sortedData.map(item => (parseFloat(item.totalAmount))),
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
                  value={ !this.state.branch ? 'null' : this.state.branch }
                  icon={ faChevronDown } 
                  options={ this.getBranchesList() } 
                  onChange={this.handleChange} />
                </Field>
              </Column>
              <Column isSize={ 3 }>
                <Field label={ this.getText('Desde') }>
                  <DateTimePicker 
                    name="fromDate" 
                    onChange={ this.handleChange } 
                    value={ this.state.fromDate }/>
                </Field>
              </Column>
              <Column isSize={ 3 }>
                <Field label={ this.getText('Hasta') }>
                  <DateTimePicker 
                    name="toDate"
                    onChange={ this.handleChange } 
                    value={ this.state.toDate } />
                </Field>
              </Column>
              <Column isSize={ 3 }>
                <Field label={ this.getText('Ordernamiento') }>
                  <div style={{display: 'flex', flexDirection:'column'}}>
                    <div style={{display: 'flex', flexDirection:'row', alignItems: 'center'}}>
                      <input 
                        className="ml-1 mr-1" 
                        type="radio" 
                        value="asc" 
                        onChange={ () => (this.handleSort('asc')) }
                        checked={ this.state.sort == 'asc'} />
                        { this.getText('Ascendiente') }
                    </div>
                    <div style={{display: 'flex', flexDirection:'row', alignItems: 'center', marginTop: '8px'}}>
                      <input 
                        className="ml-1 mr-1" 
                        type="radio" 
                        value="desc" 
                        onChange={ () => (this.handleSort('desc')) }
                        checked={ this.state.sort == 'desc'} />
                        { this.getText('Descendiente') }
                    </div>
                  </div>
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