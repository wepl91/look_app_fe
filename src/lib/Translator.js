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