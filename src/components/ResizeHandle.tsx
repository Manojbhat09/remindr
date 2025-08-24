import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface ResizeHandleProps {
  taskId: string;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ taskId }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `resize-${taskId}`,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="absolute bottom-0 left-0 w-full h-2 bg-blue-400 cursor-s-resize"
    ></div>
  );
};

export default ResizeHandle;
