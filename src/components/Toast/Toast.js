import React from 'react';
import { DefaultToast } from 'react-toast-notifications';
import '../../styles.css'
export const MyCustomToast = ({ children, ...props }) => (
  <div className="div-toast" style={{ zIndex: '10000000000000' }}>
    <DefaultToast {...props}>
      {children}
    </DefaultToast>
  </div>);