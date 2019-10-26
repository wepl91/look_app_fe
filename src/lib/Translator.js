export const translate = (str, lang) => {
  const dictionary = {
    'Idioma': 'Language',
    'Español': 'Spanish',
    'Ingles': 'English',
    'Nuevo cliente': 'New customer',
    'Creando..':'Creating..',
    'Crear cliente': 'Create customer',
    'Nombre y Apellido': 'Name & Lastname',
    '¿Cómo se llama el nuevo cliente?': 'What is the name of the new client?',
    'Nombre': 'Name',
    'Apellido': 'Lastname',
    'Documento': 'Document'


  }
  if (lang == 'Español') { return str }
  else {
    return dictionary[str]; 
  }
};