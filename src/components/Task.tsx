import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Task as TaskType } from '../App';
import ResizeHandle from './ResizeHandle';

interface TaskProps {
  task: TaskType;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id.toString(),
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    height: `${(task.duration || 1) * 6}rem`, // 6rem per hour (24 * 0.25)
  } : {
    height: `${(task.duration || 1) * 6}rem`,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-200 border-red-400';
      case 'high': return 'bg-orange-200 border-orange-400';
      case 'medium': return 'bg-yellow-200 border-yellow-400';
      case 'low': return 'bg-green-200 border-green-400';
      default: return 'bg-blue-200 border-blue-400';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'complex': return 'border-l-4 border-l-red-500';
      case 'moderate': return 'border-l-4 border-l-yellow-500';
      case 'simple': return 'border-l-4 border-l-green-500';
      default: return 'border-l-4 border-l-blue-500';
    }
  };

  const formatTargetDate = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const target = new Date(date);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days`;
    return target.toLocaleDateString();
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes} 
      className={`p-2 rounded-md shadow-md relative ${getPriorityColor(task.priority)} ${getComplexityColor(task.complexity)}`}
    >
      <div className="text-sm font-medium text-gray-800 mb-1">{task.name}</div>
      
      {task.description && (
        <div className="text-xs text-gray-600 mb-1 line-clamp-2">
          {task.description}
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{task.duration}h</span>
        {task.targetDate && (
          <span className={`px-1 py-0.5 rounded text-xs ${
            new Date(task.targetDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {formatTargetDate(task.targetDate)}
          </span>
        )}
      </div>
      
      <ResizeHandle taskId={task.id.toString()} />
    </div>
  );
};

export default Task;
