import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface TimeBlockProps {
  day: string;
  hour: number;
  children?: React.ReactNode;
}

const TimeBlock: React.FC<TimeBlockProps> = ({ day, hour, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `${day}-${hour}`,
  });

  const style = {
    backgroundColor: isOver ? 'lightblue' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="border-r border-b h-24">
      {children}
    </div>
  );
};

export default TimeBlock;
