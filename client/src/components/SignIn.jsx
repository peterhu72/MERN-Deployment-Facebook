import React from 'react';
import Registration from './Registration';
import Login from './Login';

const SignIn = () => {
    return (
        <div className="bg-image login-bg">
            
            <div className='signin-box'>
                <div className='col'>
                    <Registration></Registration>
                </div>
                <div className='col'>
                    <Login></Login>
                </div>
            </div>
            
        </div>
    );
};

export default SignIn;