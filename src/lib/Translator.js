export const translate = (str, lang) => {
  const dictionary = {
    'Bienvenido': 'Welcome',
    'Idioma': 'Language',
    'Español': 'Spanish',
    'Ingles': 'English',
    'Nuevo cliente': 'New customer',
    'Creando..':'Creating..',
    'Crear cliente': 'Create customer',
    'Nombre y Apellido': 'Name & Lastname',
    '¿Cómo se llama el nuevo cliente?': 'What is the name of the new customer?',
    'Nombre': 'Name',
    'Apellido': 'Lastname',
    'Documento': 'Document',
    '¿Cuál es el email del nuevo cliente?': 'What is the email of the new customer?',
    'Teléfono principal': 'Primary phone number',
    '¿Cuál es el nro de teléfono del cliente?': 'What is the primary phone number of the new customer?',
    'Teléfono secundario': 'Secondary phone number',
    'Es necesario una segunda opción de comunicación': 'A second communication option is necessary',
    'Categoría': 'Category',
    '¿Dentro de qué categoría se encuentra el cliente?': 'What category is the customer in?',
    'Moroso': 'Defaulter',
    'Sucursales': 'Branches',
    'Listado': 'List',
    'Nueva sucursal': 'New branch',
    'Listado de sucursales': 'List of branches',
    'Nombre': 'Name',
    'Estado': 'Status',
    'Dirección': 'Address',
    'Cargando las sucursales..': 'Loading branches..',
    'Crear sucursal': 'Create branch',
    '¿Cuál es el nombre de la nueva sucursal?': 'What is the name of the branch?',
    'Localidad': 'Location',
    '¿En qué localidad se ubica la nueva sucursal?': 'In which location is the new branch located?',
    'Calle': 'Street',
    '¿Sobre qué calle se encuentra la nueva sucursal?': 'On which street is the new branch?',
    'Número': 'Street number',
    '¿A qué altura se encuentra la nueva sucursal?': 'What street number is the new branch?',
    'Servicio': 'Service',
    'Precio': 'Price',
    'Duración': 'Duration',
    'Cargando servicios..': 'Loading services..',
    'minutos': 'minutes',
    'Minutos': 'Minutes',
    'Nuevo servicio': 'New service',
    'Crear servicio': 'Create service',
    '¿En cuál sucursal querés ofrecer este servicio?': 'In which branch do you want to offer this service?',
    '¿Cómo se llama el servicio que querés ofrecer?': 'What is the the name of the service you want to offer?',
    '¿Cuánto deseas cobrar por el servicio': 'How much do you want to charge for the service',
    '¿Cuánto tiempo toma el servicio?': 'How long does the service take?',
    'Guardar': 'Save',
    'Cancelar': 'Cancel',
    'Modificar servicio': 'Edit service',
    'Lista de servicios': 'Services list',
    'Activo': 'Active',
    'Inactivo': 'Inactive',
    'Ups! Parece que hubo un error al guardar!': 'Ups! It seems there was a problem when saving!',
    'La sucursal ha sido creado exitosamente!': 'The branch was successfully created!',
    '- sin nombre -': '- without name -',
    '- sin dirección -': '- without address -',
    'Modificar sucursal': 'Edit branch',
    'Guardando..': 'Saving..'
  }

  /**
   * If language is spanish do not transalate becouse every word should be past as parameter in spanish
   */
  if (lang == 'Español' || lang == 'Spanish') { return str }
  else {
    /**
     * If translation is not mapped, instead of breaking down the app, we return the string not translated
     */
    return dictionary[str] || str; 
  }
};