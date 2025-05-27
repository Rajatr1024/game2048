import React from 'react';
import classNames from 'classnames';

type TileProps = {
  value: number;
};

const Tile: React.FC<TileProps> = ({ value }) => {
  return (
    <div
      className={classNames(
        'flex items-center justify-center w-20 h-20 m-1 rounded text-2xl font-extrabold transition-all duration-200 shadow-md',
        {
          'bg-[#cdc1b4] text-transparent': value === 0, // empty
          'bg-[#eee4da] text-[#776e65]': value === 2,
          'bg-[#ede0c8] text-[#776e65]': value === 4,
          'bg-[#f3b27a] text-white': value === 8,
          'bg-[#f69664] text-white': value === 16,
          'bg-[#f77c5f] text-white': value === 32,
          'bg-[#f75f3b] text-white': value === 64,
          'bg-[#edd073] text-white': value === 128,
          'bg-[#edcc62] text-white': value === 256,
          'bg-[#edc950] text-white': value === 512,
          'bg-[#edc53f] text-white': value === 1024,
          'bg-[#edc22e] text-white': value === 2048,
          'bg-gradient-to-br from-[#3c3a32] to-[#1c1b18] text-white': value > 2048,
        }
      )}
    >
      {value !== 0 ? value : ''}
    </div>
  );
};

export default Tile;
