export const translate = (str, lang) => {
  const dictionary = {
    'Bienvenido': 'Welcome',
    'Idioma': 'Language',
    'Español': 'Spanish',
    'Ingles': 'English',
    'Clientes': 'Customers',
    'Nuevo cliente': 'New customer',
    'Creando..':'Creating..',
    'Crear cliente': 'Create customer',
    'Nombre y Apellido': 'Name & Last Name',
    '¿Cómo se llama el nuevo cliente?': 'What is the name of the new customer?',
    'Nombre': 'Name',
    'Apellido': 'Last Name',
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
    'Listado de servicios': 'List of services',
    'Activo': 'Active',
    'Inactivo': 'Inactive',
    'Ups! Parece que hubo un error al guardar!': 'Ups! It seems there was a problem when saving!',
    'La sucursal ha sido creado exitosamente!': 'The branch was successfully created!',
    '- sin nombre -': '- without name -',
    '- sin dirección -': '- without address -',
    '- sin teléfono -': '- without phone -',
    '- sin email -': '- without email -',
    '- Sin servicios -': '- without services -',
    '- sin fecha -' : '- without date -',
    'Modificar sucursal': 'Edit branch',
    'Guardando..': 'Saving..',
    'Cargando profesionales..': 'Loading professionals..',
    'Listado de profesionales': 'List of professionals',
    'Teléfono': 'Phone',
    'Servicios ofrecidos': 'Services offered',
    'Servicios': 'Services',
    'Días de trabajo': 'Working days',
    'a': 'to',
    'Días y horarios': 'Days and hours',
    'Lunes': 'Monday',
    'Martes': 'Tuesday',
    'Miércoles': 'Wednesday',
    'Miercoles': 'Wednesday',
    'Jueves': 'Thursday',
    'Viernes': 'Friday',
    'Sábado': 'Saturday',
    'Sabado': 'Saturday',
    'Domingo': 'Sunday',
    'Nuevo profesional': 'New professional',
    'Agregar profesional': 'Add professional',
    'El profesional fue agregado exitosamente!': 'The professional was successfully added!',
    '¿Qué servicios ofrece?': 'What services does the professional offer?',
    'Seleccioná los servicios': 'Choose the services',
    '¿En qué días y horarios va a trabajar?': 'What days and times will the professional work?',
    'Seleccioná los horarios semanales': 'Select the weekly schedules',
    'Los horarios y/o días ingresados son incorrectos': 'The schedules and/or days entered are incorrect',
    'Entrada': 'Entry',
    'Salida': 'Exit',
    'Turnos': 'Appointments',
    'Nuevo turno': 'New appointment',
    'Reportes': 'Reports',
    'Profesionales': 'Professionals',
    'Usuarios': 'Users',
    'Nuevo usuario': 'New user',
    'Rol': 'Role',
    'Administrador':'Administrator',
    'Contador':'Accountant',
    '¿Cómo se llama el nuevo usuario?':'What\'s the new user\'s name?',
    'Crear usuario': 'Create user',
    'El usuario ha sido creado exitosamente!': 'The user has been created successfully!',
    'Cargando..': 'Loading..',
    'Editar usuario': 'Edit user',
    'Guardando': 'Saving',
    'Ups! Parece que hubo un error al guardar!': 'Ups! an error occurred while saving',
    'Creando usuario..': 'Creating user..',
    'El usuario ha sido modificado exitosamente!': 'The user has been modified successfully!',
    'Modificar usuario': 'Modify user',
    'Editar perfil': 'Edit profile',
    'Cerrar sesión': 'Logout',
    'Nombre..': 'Name..',
    'Apellido..': 'Last Name..',
    'Ups! Parece que hubo un error al activar el usuario!"': 'Ups! an error occurred while activating the user',
    '¡El usuario ha sido marcado como activo!': 'The user has been marked as active!',
    'Ups! Parece que hubo un error al desactivar el usuario!': 'Ups! an error occurred while deactivating the user',
    '¡El usuario ha sido marcado como inactivo!': 'The user has been marked as inactive!',
    'Cargando los usuarios..': 'Loading users..',
    'Listado de usuarios': 'List of users',
    'Contraseña': 'Password',
    'Confirmación de contraseña': 'Password confirmation',
    'Rol': 'Role',
    '¿Cómo se llama el nuevo usuario?': 'What is the name of the new user?',
    'Monto': 'Amount',
    'Historial de pagos': 'Payment history',
    'Fecha de pago': 'Payment date',
    'Sucursal': 'Branch',
    'Puntos': 'Points',
    'Listado de clientes': 'List of customers',
    'Cargando los clientes..': 'Loading customers..',
    'Calendario de turnos': 'Appointments calendar',
    '¿Querés ver los turnos de un único profesional?': 'Do you want to see the appointments of a single professional?',
    'Selecciona un profesional': 'Choose a professional',
    'Profesionales': 'Professionals',
    '- sin profesional -': '- without professional -',
    'Cargando los turnos..': 'Loading appointments..',
    'Enero': 'January',
    'Febrero': 'February',
    'Marzo': 'March',
    'Abril': 'April',
    'Mayo': 'May',
    'Junio': 'June',
    'Julio': 'July',
    'Agosto': 'August',
    'Septiembre': 'September',
    'Octubre': 'October',
    'Noviembre': 'November',
    'Diciembre': 'December',
    'Turno': 'Appointment',
    'a las': 'at',
    'Ups! Parece que hubo problema! El profesional seleccionado se encuentra ocupado en el horario en el que se quiere crear el turno!': 'Ups! It seems there was an error! The professional selected is bussy at the selected time!',
    'Ups! Parece que hubo problema! No hay profesionales que puedan atender en ese horario!': 'Ups! It seems there was a problem! The selected professional is not working at the selected time!',
    'Ups! Parece que hubo un error al guardar los cambios!': 'Ups! It seems there was an error when saving changes!',
    'El turno se reservó existosamente!': 'The appointment wass successfully created!',
    'Al cambiar a la pantalla de visualización de turnos, vas a perder los datos que hayas cargado.': 'When you switch to the appointment display screen, you will lose the data you have loaded.',
    'Cancelación de turno': 'Appointment cancellation',
    'El turno será cancelado. Luego de ejecutar esta acción, no podrá revertirse.': 'The appointment will be canceled. After executing this action, it cannot be reversed.',
    'Acabas de editar el turno, recordá que podes descargar un comprobante con la informació actualizada!': 'You have just edited the appointment, remember that you can download a ticket with the updated information!',
    'Comprobante de pago': 'Payment ticket',
    'Comprobante de cancelación': 'Cancelation ticket',
    'Comprobante de reserva': 'Reservation ticket',
    'Comprobantes': 'Tickets',
    'Acciones': 'Actions',
    'Cancelar turno': 'Cancel appointment',
    'Efectuar pago': 'Make payment',
    '- sin cliente -': '- without customer -',
    'De': 'From',
    'a': 'to',
    'Cliente': 'Customer',
    'Profesional': 'Professional',
    'Horario': 'Hour',
    'Precio': 'Price',
    'Detalles': 'Details',
    'No hay turnos para la fecha': 'There are no appointments for the date',
    'Nuevo turno': 'New appointment',
    'Crear un turno para hoy': 'Create an appointment for today',
    '¿Cuál de nuestros servicios requerís?': 'Which of our services do you require?',
    'Seleccioná un servicio': 'Choose a service',
    'No hay servicios existentes para ofrecer.': 'There are no existing services to offer.',
    '¿Por quién querés ser atendido?': 'Who do you want to treat you?',
    'Seleccioná un profesional': 'Choose a professional',
    '¿Quién quiere ser atendido?': 'Who wants to be treated?',
    'Seleccioná un cliente': 'Choose a customer',
    '¿A cual de nuestras sucursales querés venir?': 'Which of our branches do you want to come to?',
    'Seleccioná una sucursal': 'Choose a branch',
    '¿Que día querés venir?': 'What day do you want to come?',
    'Seleccioná una fecha': 'Choose a day',
    '¿A que hora querés venir?': 'What time do you want to come?',
    'Seleccioná un horario': 'Select a schedule',
    'Sucursales': 'Branches',
    'Horarios': 'Schedules',
    'La fecha seleccionada es un día no laboral.': 'The selected date is a non-work day.',
    '- Ninguno -': '- None -',
    '- Cliente no registrado -': '- Unregistered customer -',
    'Ver los turnos de hoy': "See today's appointments", 
    'Reservar turno': 'Book appointment',
    'El turno no posee ningún pago aún': 'The appointment has no payment yet',
    'Aviso': 'Advise',
    'Aceptar': 'Accept',
    'Se ha creado un nuevo ususario.': 'A new user have been created.',
    'Su contraseña es:': 'His/her password is:',
    'Actualizarla una vez que inicie sesión.': 'Update it once he/she logs in.',
    'Recomendación': 'Recommendation: ',
    'Los campos están vacíos': 'The fields are empty',
    'El monto en efectivo ingresado no es válido': 'The entered money amount is not valid',
    'Los puntos ingresados no son válidos': 'The entered points are not valid',
    'El monto excede el total a pagar': 'The amount exceeds the total price',
    'Tipo de pago': 'Payment type',
    '¿De qué manera desea realizar el pago?': 'How would you like to make your payment?',
    'Fiar': 'Loan',
    'Efectivo': 'Cash',
    'Puntos': 'Points',
    'Efectivo y puntos': 'Cash and points',
    'Ingrese los montos': 'Enter the amounts',
    '¿Cuánto va abonar?': 'How much are you gonna pay?',
    '(Equivale a: $': '(Equivalent to: $',
    'Abonar turno': 'Pay appointment',
    'Estás por efectuar el pago. ¿Estás seguro?': 'You\'re about to realize the payment. Are you sure?',
    'Total a abonar: $': 'Total amount: $',
    'puntos disponibles ': 'available points ',
    'Efectuar pago': 'Pay',
    'El campo está vacío': 'The field is empty',
    'El cliente no cuenta con puntos suficientes': 'The costumer doesn\'t have enough points',
    'El monto ingresado no es válido': 'The entered amount is invalid',
    'Ups! Parece que hubo problema! El profesional seleccionado no trabaja en el horario o dia seleccionado!': 'Ups! It seems there was a problem! The selected professional is not working on the selected date or at the selected hour!',
    '¿En qué sucursal va a trabajar el ususario?': 'In which branch is the user going to work?',
    '¿Cuál es el dni del nuevo cliente?': 'What\'s the new customer\'s Document number?',
    '¿En qué sucursal va a atender?': 'In which branch is the professional going to work?',
    'Promociones' : 'Discounts',
    'Nueva promoción' : 'New discount',
    'Beneficio' : 'Benefit',
    'x puntos' : 'x points',
    '% de descuento' : '% off',
    'Fecha de inicio' : 'Starting date',
    'Fecha de finalización' : 'Ending date',
    'Servicios incluidos' : 'Included services',
    'Activa' : 'Active',
    'Cargando las promociones..' : 'Loading discounts..',
    'Listado de promociones' : 'Discounts List',
    'La promoción ha sido creada exitosamente!' : 'The discount was successfully created!',
    'Crear promoción' : 'Create discount',
    'Los cambios se han guardado exitosamente!' : 'The changes have been saved successfully!',
    'Modificar promoción' : 'Modify discount',
    '¿Qué servicios incluye?' : 'Which services are included?',
    'Beneficio' : 'Benefit',
    '¿Qué tipo de beneficio ofrece la promoción?' : 'What kind of benefit does the discount offer?',
    'Descuento en el pago' : 'Payment discount',
    'Multiplicador de puntos' : 'Points multiplier',
    'Descuento' : 'Discount',
    'Multiplicador' : 'Multiplier',
    'Desde' : 'From',
    'Hasta' : 'To',
    '¿Cuándo inicia la promoción?' : 'When does the discount start?',
    '¿Cuándo finaliza la promoción?' : 'When does the discount end?',
    'Los días ingresados son incorrectos' : 'The days entered are incorrect',
    '¿Querés filtrar y ver ingresos por sucursal?': 'Do you want to filter and view revenue by branch?',
    'Ordernamiento': 'Ordering',
    'Ascendiente': 'Ascendant',
    'Descendiente': 'Descendant',
    'Ingresos por profesionales': 'Revenue by professionals', 
    'Reporte de profesionales': 'Professionals report',
    'Reporte de servicios': 'Services report',
    'Ordenar por:': 'Sort by:',
    'Ingresos': 'Income',
    'Veces consumidas': 'Consumption',
    'Ingresos por servicios': 'Services revenues',
    'Configuración de puntos promocionales': 'Transaction awarded points settings',
    'Valor de puntos promocionales para pagar': 'Value of promotional points to pay',
    'Valor de puntos promocionales para asignar': 'Value of promotional points to assign',
    'Cantidad de puntos necesarios para representar 1$': 'Quantity of points needed to represent $ 1',
    'No se ha podido enviar la reserva del turno a través de Google Calendar': 'Failed to send appointment reservation through Google Calendar',
    'Se ha enviado la reserva del turno a través de Google Calendar': 'Appointment reservation has been sent through Google Calendar',
    'Promoción ': 'Discount ',
    'los puntos del turno se multiplican por ' : 'appointment points are multiplied by ',
    '% de descuento en ' : '% off in ',
    'Costo total: $' : 'Total price: $',
    'Ahorrados ' : 'Saved ',
    'en ' : 'in ',
    'con la promo: ' : 'using discount: ',
    'Multiplicados los puntos por ' : 'Multiplied points by ',
    '- sin sucursal -' : '- without branch -',
    '- Ninguna -' : '- None -',
    'Configuración de base de datos' : 'Database settings',
    'Cuenta corriente de clientes' : 'Customer\'s payments balance',
    'Selecciona un cliente para ver su cuenta' : 'Select a customer to see his balance',
    'Configuración' : 'Settings',
    'Puntos promocionales' : 'Transaction points',
    'Base de datos' : 'Database',
    'Total restante: $' : 'Remaining total: $',
    'Total abonado: $' : 'Paid for: $',
    'Cuentas corrientes' : 'Payments balance',
    'Descargar Backup': 'Download Backup',
    'Se descargará un archivo de texto con toda la información de la base de datos': 'A text file with all the information in the database will be downloaded',
    'Descargar': 'Download',
    'Importar Backup': 'Import Backup',
    'Se cargará la información del archivo que se cargue a la base de datos': 'The information of the file that is uploaded to the database will be loaded',
    'Arrastrá acá el archivo': 'Drag the file here',
    'La información se importó exitosamente!': 'The information was imported successfully!',
    'Ups! Parece que hubo un error al importar la información!': 'Ups! It seems that there was an error importing the information!',
    'Recuerda que luego de importar información, deberás iniciar sesión nuevamente.': 'Remember that after importing information, you must log in again.',
    'Email enviado!': 'Email sent!',
    'Reenviar email de reserva': 'Resend booking Email',
    'Ups! Parece que hubo un problema al reenviar el email.': 'Ups! It seems that there was a problem resending the email.',
    'con el servicio: ' : 'with service: ',
    'por la promo: ' : 'with the discount: '
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