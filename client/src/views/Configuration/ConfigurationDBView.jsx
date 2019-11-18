import React, { Component } from 'react';

import { withRouter } from 'react-router';
import { withStore } from '../../hocs';
import { withToastManager } from 'react-toast-notifications';

import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator';

import {
  Column,
  Columns,
  Level,
  LevelLeft
} from 'bloomer';

import {
  Title,
  Field,
  Button,
  Dropzone,
  Panel,
  Text,
} from 'shipnow-mercurio';

import { 
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";

import moment from 'moment';


import { ReactComponent as SvgDraw } from '../../assets/undraw_server_q2pb.svg';

@observer
class ConfigurationDBView extends Component {
  reader
  constructor(props) {
    super(props);

    this.state = {
      backupJSON: null,
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleGetFile = this.handleGetFile.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
  }

  handleClick() {
    this.downloadFile(this.state.backupJSON.toArray()[0].toJS(), `backup-${moment().format('DD-MM-YYYY')}.txt`, 'text/plain');
  }

  handleFileRead( e ) {
    const content = this.reader.result;
    const jsonContent = JSON.parse(content);
    this.props.store.backups.sendImport(jsonContent).then( response => {
      if(response.ok) {
        this.successToast();
      }
      else {
        this.errorToast();
      }
    });
  }

  successToast() {
    const { toastManager } = this.props;
    toastManager.add(this.getText('La información se importó exitosamente!'), {
      appearance: 'success',
      autoDismiss: true,
      pauseOnHover: true,
    });
    this.reader = null;
    setTimeout(()=> window.location.reload(), 2000)
  }

  errorToast() {
    const { toastManager } = this.props;
    toastManager.add(this.getText('Ups! Parece que hubo un error al importar la información!'), {
      appearance: 'error',
      autoDismiss: true,
      pauseOnHover: true,
    });
    this.reader = null;
  }

  handleGetFile(files) {
    if (!files.length) return;
    const file = files[0];
    this.reader = new FileReader();
    this.reader.onloadend = this.handleFileRead;
    this.reader.readAsText(file)
  }

  componentDidMount() {
    this.setState({
      backupJSON: this.props.store.backups.getBackup(),
    })
  }

  downloadFile(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content)], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  renderSkeleton() {
    return (
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{this.getText('Configuración de base de datos')}</Title>
          </LevelLeft>
        </Level>
        <hr />
      </React.Fragment>)
  }

  render() {
    const isBackupLoaded = this.state.backupJSON && this.state.backupJSON.isOk();
    if (!isBackupLoaded) return this.renderSkeleton()
    return (
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{this.getText('Configuración de base de datos')}</Title>
          </LevelLeft>
        </Level>
        <hr />
        <Columns>
          <Column isSize={ 4 } className="pt-5 pl-5">
            <Field 
              label={ this.getText('Descargar Backup') } 
              labelNote={ this.getText('Se descargará un archivo de texto con toda la información de la base de datos') }>
              <Button onClick={ this.handleClick } className="mt-2" kind="outline">{ this.getText('Descargar') }</Button>
            </Field>
            <br />
            <Field
              label={ this.getText('Importar Backup') } 
              labelNote={ this.getText('Se cargará la información del archivo que se cargue a la base de datos') }>
              <Dropzone
                disableClick
                className="mt-2"
                onInputElementClick={this.handleGetFile}
                onFileAdd={this.handleGetFile}
                icon={ faDatabase }
                label={ this.getText('Arrastrá acá el archivo') }/>
            </Field>
            <Panel className="mt-3" color="warning" invert style={{padding: '8px',}}>
              <Text multiline>
                { this.getText('Recuerda que luego de importar información, deberás iniciar sesión nuevamente.') }
              </Text>
            </Panel>
          </Column>
          <Column isSize={ 8 }>
            <SvgDraw style={{width: '40%', position: 'absolute', right: '10%', top:'-5%'}}/>
          </Column>
        </Columns>
      </React.Fragment>)
  }
}

export default withToastManager(withStore(withRouter(ConfigurationDBView)));