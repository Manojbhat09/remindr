import React from 'react';

interface HeaderProps {
  title: string;
  onQuickAdd: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onQuickAdd }) => {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div>
          <button onClick={onQuickAdd} className="bg-blue-500 text-white px-4 py-2 rounded">Quick Add</button>
        </div>
      </div>
    </header>
  );
};

export default Header;