import React from 'react';
import LogoComputerChip from '../../assets/LogoComputerChip.png';

const CatLogo = ({ size = 40, className = '' }) => {
  return (
    <img 
      src={LogoComputerChip}
      alt="Computer Chip - Gato Logo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default CatLogo;