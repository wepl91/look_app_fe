export const sucursales = () => {
  return [
    {
      id: 1,
      address: 'Lavalle 2217',
      name: 'Sucursal nro 1'
    },
    {
      id: 2,
      address: 'Tribulato 2450',
      name: 'Sucursal nro 2'
    },
    {
      id: 3,
      address: 'San Martin 3210',
      name: 'Sucursal nro 3'
    },
  ]
}

export const profesionales = () => {
  return [
    {
      id: 1,
      name: 'Nicolas',
      surname: 'González',
      phone: '1115426425',
      mail: 'nicog@gmail.com',
      branch: 'Sucursal nro 1',
      services: 'Corte'
    },
    {
      id: 2,
      name: 'Julieta',
      surname: 'Rodríguez',
      phone: '1175145216',
      mail: 'julietar@gmail.com',
      branch: 'Sucursal nro 2',
      services: ['Corte', 'Tintura']
    },
    {
      id: 3,
      name: 'Mariana',
      surname: 'Pérez',
      phone: '1142654265',
      mail: 'marianap@gmail.com',
      branch: 'Sucursal nro 3',
      services: ['Brushing', 'Tintura']
    },
  ]
}

export const horarios = () => {
  return [
    {
      key: '09:00 hs',
      value: '9',
    },
    {
      key: '10:00 hs',
      value: '10',
    },
    {
      key: '11:00 hs',
      value: '11',
    },
    {
      key: '12:00 hs',
      value: '12',
    },
    {
      key: '13:00 hs',
      value: '13',
    },
    {
      key: '14:00 hs',
      value: '14',
    },
    {
      key: '15:00 hs',
      value: '15',
    },
    {
      key: '16:00 hs',
      value: '16',
    },
    {
      key: '17:00 hs',
      value: '17',
    },
  ]
}

export const horariosFormateados = () => {
  return [
    {
      id: 1,
      hour: '05-17-2018 02:30 PM',
      format: 'MM-DD-YYYY hh:mm A'
    },
    {
      id: 2,
      hour: '05-17-2018 06:00 PM',
      format: 'MM-DD-YYYY hh:mm A'
    },
  ]
}

export const servicios = () => {
  return [
    {
      id: 1,
      name: 'Corte',
    },
    {
      id: 2,
      name: 'Tintura',
    },
    {
      id: 3,
      name: 'Brushing',
    },
  ]
}