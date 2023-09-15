import * as React from 'react';


const Information = (props) => {

  return (
    <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{__html: props.content.data.textContent}} />      
  );

};


export default Information;
