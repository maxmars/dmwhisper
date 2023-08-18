import * as React from 'react';


const Information = (props) => {

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {props.content.data.textContent}
    </div>
  );

};


export default Information;
