import React from 'react';
import emailjs from '@emailjs/browser';

export const sendAuthMail = (userMail,userId) => {
    const serviceId = process.env.REACT_APP_SERVICEID
    const templateId = process.env.REACT_APP_TEMPLATEID
    const publicKey = process.env.REACT_APP_PUBLICKEY
    
    const templateParams = {
        to_email:userMail,
        message:userId,
    };

    emailjs
      .send(serviceId, templateId, templateParams,publicKey)
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
};