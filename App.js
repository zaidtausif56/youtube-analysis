// import React, { useState } from 'react';
import GoogleLogin from "./GoogleLogin";

const App = () => {

  return (
    <div className="App">
      <GoogleLogin className="child google"></GoogleLogin>
      {/* <TwitterLogin className="child twitter"></TwitterLogin> */}
    </div>
  );
};

export default App;
