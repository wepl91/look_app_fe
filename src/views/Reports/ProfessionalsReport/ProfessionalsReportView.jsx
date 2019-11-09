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

const data = {
  labels: ['Juan', 'Pedro', 'Bruno', 'Walter', 'Jeremias', 'Nicolas', 'Agustin'],
  datasets: [
    {
      label: 'Ingresos',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65.5, 59, 80, 81, 56, 55, 49],
    }
  ]
};

@observer
class ProfessionalsReportView extends Component {
  constructor(props) {
    super(props);
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
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
          data={data}
          width={100}
          height={450}
          options={{
            maintainAspectRatio: false,
            title: {
              display: true,
              text: this.getText('Ingresos por profesionales'),
              fontSize: '18',
            },
            legend: {
              display: false,
            }
          }}
      />
        </Columns>
      </React.Fragment> )
  }
}

export default withStore(withRouter(ProfessionalsReportView));