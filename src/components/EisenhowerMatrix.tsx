import React from 'react';
import { Task } from '../App';
import { useDraggable, useDroppable } from '@dnd-kit/core';

interface EisenhowerMatrixProps {
  tasks: Task[];
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

interface QuadrantProps {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  tasks: Task[];
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

const Quadrant: React.FC<QuadrantProps> = ({ id, title, description, bgColor, borderColor, tasks, onUpdateTask }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${bgColor} ${borderColor} border-2 rounded-lg p-4 min-h-[300px]`}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-4 opacity-80">{description}</p>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onUpdateTask={onUpdateTask} />
        ))}
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateTask }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id.toString(),
    data: { task }, // Pass the whole task object
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 border-red-300';
      case 'high': return 'bg-orange-100 border-orange-300';
      case 'medium': return 'bg-yellow-100 border-yellow-300';
      case 'low': return 'bg-green-100 border-green-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${getPriorityColor(task.priority)} border rounded p-3 cursor-move hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{task.name}</h4>
          {task.description && (
            <p className="text-xs text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onUpdateTask(task.id, { status: 'completed' })}
            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            ✓
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span className="capitalize">{task.priority}</span>
        <div className="flex items-center space-x-2">
          <span>{task.duration}h</span>
          {task.targetDate && (
            <span className={`px-1 py-0.5 rounded text-xs ${
              new Date(task.targetDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {(() => {
                const now = new Date();
                const target = new Date(task.targetDate);
                const diffTime = target.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays < 0) return 'Overdue';
                if (diffDays === 0) return 'Today';
                if (diffDays === 1) return 'Tomorrow';
                if (diffDays <= 7) return `${diffDays}d`;
                return target.toLocaleDateString();
              })()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks, onUpdateTask }) => {
  const urgentImportant = tasks.filter(t => 
    (t.priority === 'urgent' || t.priority === 'high') && 
    (t.complexity === 'complex' || t.duration && t.duration > 2)
  );
  
  const urgentNotImportant = tasks.filter(t => 
    (t.priority === 'urgent' || t.priority === 'high') && 
    (t.complexity === 'simple' || t.duration && t.duration <= 2)
  );
  
  const notUrgentImportant = tasks.filter(t => 
    (t.priority === 'medium' || t.priority === 'low') && 
    (t.complexity === 'complex' || t.duration && t.duration > 2)
  );
  
  const notUrgentNotImportant = tasks.filter(t => 
    (t.priority === 'medium' || t.priority === 'low') && 
    (t.complexity === 'simple' || t.duration && t.duration <= 2)
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Eisenhower Matrix</h2>
        <p className="text-gray-600">Organize tasks by urgency and importance</p>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <Quadrant
          id="urgent-important"
          title="Urgent & Important"
          description="Do these tasks first - they're critical and time-sensitive"
          bgColor="bg-red-50"
          borderColor="border-red-300"
          tasks={urgentImportant}
          onUpdateTask={onUpdateTask}
        />
        
        <Quadrant
          id="urgent-not-important"
          title="Urgent & Not Important"
          description="Delegate these if possible, or do them quickly"
          bgColor="bg-orange-50"
          borderColor="border-orange-300"
          tasks={urgentNotImportant}
          onUpdateTask={onUpdateTask}
        />
        
        <Quadrant
          id="not-urgent-important"
          title="Not Urgent & Important"
          description="Schedule these for later - they're important but not urgent"
          bgColor="bg-blue-50"
          borderColor="border-blue-300"
          tasks={notUrgentImportant}
          onUpdateTask={onUpdateTask}
        />
        
        <Quadrant
          id="not-urgent-not-important"
          title="Not Urgent & Not Important"
          description="Consider eliminating these tasks - they're not valuable"
          bgColor="bg-gray-50"
          borderColor="border-gray-300"
          tasks={notUrgentNotImportant}
          onUpdateTask={onUpdateTask}
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">How to Use This Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-red-700 mb-2">Urgent & Important</h4>
            <p className="text-gray-600">Crises, deadlines, emergencies. Handle these immediately.</p>
          </div>
          <div>
            <h4 className="font-medium text-orange-700 mb-2">Urgent & Not Important</h4>
            <p className="text-gray-600">Interruptions, some meetings. Delegate when possible.</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-700 mb-2">Not Urgent & Important</h4>
            <p className="text-gray-600">Planning, relationship building. Schedule dedicated time.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Not Urgent & Not Important</h4>
            <p className="text-gray-600">Time wasters, busy work. Eliminate or minimize.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EisenhowerMatrix; 