import { StyleSheet } from '@react-pdf/renderer'
const styles = StyleSheet.create({
  page: { 

   },
  section: { 
    padding: '16pt',
    textAlign: 'center', 
    margin: 30,
    height: '10cm',
    width: '15cm',
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
  title: {
    marginTop: '8pt',
    fontSize: 24,
    textAlign: 'center',
  },
  description: {
    marginTop: '32pt',
    fontSize: 18,
    textAlign: 'center',
  },
  brand: {
    marginTop: '4cm',
    fontSize: 20,
    textAlign: 'center',
  }
});

export default styles