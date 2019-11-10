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

@observer
class ServicesReportView extends Component {
  constructor(props) {
    super(props);
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  getChartData() {
    return {
      labels: ['Corte', 'Peinado', 'Tintura', 'Brushing'],
      datasets: [
        {
          label: 'Ingresos',
          backgroundColor: 'rgba(155,204,132,0.2)',
          borderColor: 'rgba(155,204,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(155,204,132,0.4)',
          hoverBorderColor: 'rgba(155,204,132,1)',
          data: [1250, 980, 700, 50],
        }
      ]
    };
  }

  getChartConfig() {
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
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{ this.getText('Reporte de servicios') }</Title>
          </LevelLeft>
        </Level>
        <hr/>
          <Columns>
            <Column isSize={ 3 }>
              <Field label={ this.getText('¿Querés filtrar y ver ingresos por sucursal?') }>
                <Select 
                  className="is-fullwidth"
                  borderless
                  placeholder={this.getText('Sucursal')}/>
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
          data={this.getChartData()}
          width={100}
          height={450}
          options={this.getChartConfig()}
      />
        </Columns>
      </React.Fragment> )
  }
}

export default withStore(withRouter(ServicesReportView));