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
      id: 1,
      hour: '10.00hs a 11.00hs',
    },
    {
      id: 2,
      hour: '12.00hs a 13.00hs',
    },
    {
      id: 3,
      hour: '16.00hs a 17.00hs',
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