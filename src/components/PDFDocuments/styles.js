import { StyleSheet } from '@react-pdf/renderer'
const styles = StyleSheet.create({
  page: { 

   },
  section: { 
    padding: '16pt', 
    margin: 30,
    height: 'auto',
    width: '12cm',
    borderTopStyle: 'solid',
    borderTopWidth: '2pt',
    borderTopColor: '#830d0d',
    borderBottomStyle: 'solid',
    borderBottomWidth: '2pt',
    borderBottomColor: '#830d0d',
    borderLeftStyle: 'solid',
    borderLeftWidth: '2pt',
    borderLeftColor: '#830d0d',
    borderRightStyle: 'solid',
    borderRightWidth: '2pt',
    borderRightColor: '#830d0d',
    borderTopLeftRadius: '5pt',
    borderTopRightRadius: '5pt',
    borderBottomLeftRadius: '5pt',
    borderBottomRightRadius: '5pt',
  },
  details: {
    width: '100%',
    height: 'auto',
  },
  service: {
    fontSize: 12,
    textAlign: 'left'
  },  
  title: {
    marginTop: '8pt',
    fontSize: 16,
    textAlign: 'left',
  },
  subtitle: {
    marginTop: '8pt',
    fontSize: 13,
    textAlign: 'left',
  },
  description: {
    marginTop: '10pt',
    fontSize: 12,
    textAlign: 'left',
    marginBottom: '10pt',
  },
  brand: {
    position: 'absolute',
    top: '0',
    left: '16pt',
    fontSize: 20,
    textAlign: 'left',
    marginBottom: '24pt',
    marginTop: '6pt',
  }
});

export default styles