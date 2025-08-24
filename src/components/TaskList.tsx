import React from 'react';
import { Task as TaskType } from '../App';
import Task from './Task';

interface TaskListProps {
  tasks: TaskType[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Tasks</h2>
      <div className="space-y-2">
        {tasks.map(task => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
