import React from 'react';
import classNames from 'classnames';

type TileProps = {
  value: number;
};

const Tile: React.FC<TileProps> = ({ value }) => {
  return (
    <div
      className={classNames(
        'flex items-center justify-center w-20 h-20 m-1 rounded text-xl font-bold',
        {
          'bg-gray-300 text-black': value === 0,
          'bg-yellow-100': value === 2,
          'bg-yellow-200': value === 4,
          'bg-yellow-300': value === 8,
          'bg-orange-400 text-white': value === 16,
          'bg-orange-500 text-white': value === 32,
          'bg-orange-600 text-white': value === 64,
          'bg-red-500 text-white': value >= 128,
        }
      )}
    >
      {value !== 0 ? value : ''}
    </div>
  );
};

export default Tile;
