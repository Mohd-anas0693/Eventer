import React from 'react';
import Logo from '../../../assets/icpLogo2.png';

const Navbar = () => {
    return (
        <div className={`flex flex-row h-[95px] w-full justify-center border-0` }>
            <div className='max-w-7xl w-full p-4 flex justify-between'>
                <div className='p-4'>
                    <img src={Logo} alt="Internet Compouter" className='w-64' />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
