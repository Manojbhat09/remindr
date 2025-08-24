import React, { useState } from 'react';
import { Task, Goal, Review, Note } from '../App';
import Calendar from './Calendar';
import EisenhowerMatrix from './EisenhowerMatrix';
import GoalsDashboard from './GoalsDashboard';
import Notes from './Notes';
import ReviewsPanel from './ReviewsPanel';
import ProductivityInsights from './ProductivityInsights';
import TaskBreakdown from './TaskBreakdown';

interface MainContentProps {
  view: string;
  tasks: Task[];
  goals: Goal[];
  reviews: Review[];
  notes: Note[];
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onUpdateGoal: (goalId: number, updates: Partial<Goal>) => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'progress' | 'status' | 'tasks'>) => void;
  onAddReview: (review: Omit<Review, 'id'>) => void;
  onAddNotes: (notes: Note[]) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  view, 
  tasks, 
  goals, 
  reviews, 
  notes,
  onUpdateTask, 
  onUpdateGoal, 
  onAddGoal, 
  onAddReview,
  onAddNotes
}) => {
  return (
    <main className="flex-1 p-4 overflow-y-auto">
      {view === 'Dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Task Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Tasks</span>
                  <span className="font-semibold text-gray-800">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">{tasks.filter(t => t.status === 'in-progress').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{tasks.filter(t => t.status === 'completed').length}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Goals Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Goals</span>
                  <span className="font-semibold text-gray-800">{goals.filter(g => g.status === 'active').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{goals.filter(g => g.status === 'completed').length}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Today's Focus</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">High Priority Tasks</div>
                <div className="font-semibold text-red-600">
                  {tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length}
                </div>
              </div>
            </div>
          </div>
          
          <ProductivityInsights tasks={tasks} goals={goals} reviews={reviews} />
        </div>
      )}
      
      {view === 'Calendar' && <Calendar tasks={tasks} />}
      
      {view === 'Eisenhower Matrix' && (
        <EisenhowerMatrix 
          tasks={tasks} 
          onUpdateTask={onUpdateTask} 
        />
      )}
      
      {view === 'Goals' && (
        <GoalsDashboard 
          goals={goals} 
          tasks={tasks}
          onUpdateGoal={onUpdateGoal}
          onAddGoal={onAddGoal}
        />
      )}
      
      {view === 'Notes' && (
        <Notes notes={notes} onAddNotes={onAddNotes} />
      )}
      
      {view === 'Reviews' && (
        <ReviewsPanel 
          reviews={reviews}
          onAddReview={onAddReview}
        />
      )}
      
      {view === 'Task Breakdown' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Task Breakdown</h2>
            <p className="text-gray-600">Break down complex tasks into manageable subtasks</p>
          </div>
          
          {tasks.filter(t => t.complexity === 'complex' || (t.duration && t.duration > 2)).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Complex Tasks Yet</h3>
              <p className="text-gray-600">Create tasks with high complexity or long duration to see them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasks
                .filter(t => t.complexity === 'complex' || (t.duration && t.duration > 2))
                .map(task => (
                  <TaskBreakdown
                    key={task.id}
                    task={task}
                    onUpdateTask={onUpdateTask}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default MainContent;