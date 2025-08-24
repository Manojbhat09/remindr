import React, { useState } from 'react';
import { Task, Subtask } from '../App';

interface TaskBreakdownProps {
  task: Task;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

const TaskBreakdown: React.FC<TaskBreakdownProps> = ({ task, onUpdateTask }) => {
  const [newSubtask, setNewSubtask] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const subtask: Subtask = {
        id: Date.now(),
        name: newSubtask.trim(),
        completed: false,
      };
      
      const updatedSubtasks = [...task.subtasks, subtask];
      onUpdateTask(task.id, { subtasks: updatedSubtasks });
      setNewSubtask('');
      setIsAddingSubtask(false);
    }
  };

  const handleToggleSubtask = (subtaskId: number) => {
    const updatedSubtasks = task.subtasks.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    
    onUpdateTask(task.id, { subtasks: updatedSubtasks });
  };

  const handleDeleteSubtask = (subtaskId: number) => {
    const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
    onUpdateTask(task.id, { subtasks: updatedSubtasks });
  };

  const getProgressPercentage = () => {
    if (task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'complex': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Task Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.name}</h3>
            {task.description && (
              <p className="text-gray-600 mb-3">{task.description}</p>
            )}
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority} priority
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(task.complexity)}`}>
                {task.complexity} complexity
              </span>
              <span className="text-sm text-gray-500">
                {task.duration}h estimated
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{getProgressPercentage()}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>

        <div className="text-sm text-gray-600">
          {task.subtasks.filter(s => s.completed).length} of {task.subtasks.length} subtasks completed
        </div>
      </div>

      {/* Subtasks Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-800">Subtasks</h4>
          <button
            onClick={() => setIsAddingSubtask(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            + Add Subtask
          </button>
        </div>

        {task.subtasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p>No subtasks yet. Break down this task into smaller steps!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {task.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  subtask.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <button
                  onClick={() => handleToggleSubtask(subtask.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    subtask.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {subtask.completed && <span className="text-xs">✓</span>}
                </button>
                
                <span
                  className={`flex-1 text-sm ${
                    subtask.completed
                      ? 'text-green-700 line-through'
                      : 'text-gray-700'
                  }`}
                >
                  {subtask.name}
                </span>
                
                <button
                  onClick={() => handleDeleteSubtask(subtask.id)}
                  className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Subtask Modal */}
      {isAddingSubtask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Subtask</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtask Name
                </label>
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subtask name..."
                  autoFocus
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleAddSubtask}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Subtask
                </button>
                <button
                  onClick={() => {
                    setIsAddingSubtask(false);
                    setNewSubtask('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Breakdown Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-800 mb-2">💡 Task Breakdown Tips</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Break complex tasks into 15-30 minute chunks</li>
          <li>• Each subtask should be specific and actionable</li>
          <li>• Start with the most important or time-sensitive subtasks</li>
          <li>• Review and adjust subtasks as you progress</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskBreakdown; 