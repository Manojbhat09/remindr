import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Modal from './components/Modal';
import QuickAddForm from './components/QuickAddForm';
import GoalForm from './components/GoalForm';
import AISidebar from './components/AISidebar';
import { DndContext, DragEndEvent, DragMoveEvent } from '@dnd-kit/core';

export interface Task {
  id: number;
  name: string;
  description?: string;
  day?: string;
  hour?: number;
  duration?: number;
  targetDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  complexity: 'simple' | 'moderate' | 'complex';
  status: 'not-started' | 'in-progress' | 'completed';
  goalId?: number;
  subtasks: Subtask[];
  createdAt: Date;
  completedAt?: Date;
}

export interface Subtask {
  id: number;
  name: string;
  completed: boolean;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  tasks: number[];
  smartCriteria: {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: string;
  };
}

export interface Review {
  id: number;
  date: Date;
  type: 'daily' | 'weekly' | 'monthly';
  accomplishments: string[];
  challenges: string[];
  improvements: string[];
  nextActions: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

function App() {
  const [view, setView] = useState('Dashboard');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const handleAddNotes = (newNotes: Note[]) => {
    setNotes(prevNotes => [...newNotes, ...prevNotes]);
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status' | 'subtasks' | 'goalId'>) => {
    const newTask: Task = {
      id: Date.now(),
      name: taskData.name,
      description: taskData.description,
      duration: taskData.duration,
      targetDate: taskData.targetDate,
      priority: taskData.priority,
      complexity: taskData.complexity,
      status: 'not-started',
      subtasks: [],
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setIsTaskModalOpen(false);
  };

  const handleAddGoal = (goal: Omit<Goal, 'id' | 'progress' | 'status' | 'tasks'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now(),
      progress: 0,
      status: 'active',
      tasks: [],
    };
    setGoals([...goals, newGoal]);
    setIsGoalModalOpen(false);
  };

  const handleAddReview = (review: Omit<Review, 'id'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now(),
    };
    setReviews([...reviews, newReview]);
  };

  const toggleAISidebar = () => {
    setIsAISidebarOpen(!isAISidebarOpen);
  };

  const handleUpdateTask = (taskId: number, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleUpdateGoal = (goalId: number, updates: Partial<Goal>) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, delta } = event;

    if (active.id.toString().startsWith('resize-')) {
      const taskId = parseInt(active.id.toString().replace('resize-', ''), 10);
      const newDuration = Math.max(1, Math.round((tasks.find(t => t.id === taskId)?.duration || 1) + delta.y / 96)); // 96px per hour (6rem)

      setTasks(tasks =>
        tasks.map(task =>
          task.id === taskId ? { ...task, duration: newDuration } : task
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (overId.includes('-')) { // Calendar drop
      if (!activeId.startsWith('resize-')) {
        const [day, hourStr] = overId.split('-');
        const hour = parseInt(hourStr, 10);
        const taskId = parseInt(activeId, 10);

        setTasks(tasks =>
          tasks.map(task =>
            task.id === taskId ? { ...task, day, hour } : task
          )
        );
      }
    } else { // Eisenhower Matrix drop
      const task = (active.data.current as { task: Task }).task;
      let newPriority: Task['priority'] = 'medium';
      let newComplexity: Task['complexity'] = 'moderate';

      switch (overId) {
        case 'urgent-important':
          newPriority = 'urgent';
          newComplexity = 'complex';
          break;
        case 'urgent-not-important':
          newPriority = 'urgent';
          newComplexity = 'simple';
          break;
        case 'not-urgent-important':
          newPriority = 'low';
          newComplexity = 'complex';
          break;
        case 'not-urgent-not-important':
          newPriority = 'low';
          newComplexity = 'simple';
          break;
      }

      handleUpdateTask(task.id, { priority: newPriority, complexity: newComplexity });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
      <div className="flex h-screen bg-gray-100">
        <Sidebar onNavigate={setView} tasks={tasks} goals={goals} />
        <div className="flex-1 flex flex-col">
          <Header title={view} onQuickAdd={() => setIsTaskModalOpen(true)} />
          <MainContent 
            view={view} 
            tasks={tasks} 
            goals={goals}
            reviews={reviews}
            notes={notes}
            onUpdateTask={handleUpdateTask}
            onUpdateGoal={handleUpdateGoal}
            onAddGoal={handleAddGoal}
            onAddReview={handleAddReview}
            onAddNotes={handleAddNotes}
          />
        </div>
        <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Quick Add Task">
          <QuickAddForm onSave={handleAddTask} onClose={() => setIsTaskModalOpen(false)} />
        </Modal>
        <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title="Add New Goal">
          <GoalForm onSave={handleAddGoal} onClose={() => setIsGoalModalOpen(false)} />
        </Modal>
      </div>
      
      {/* AI Sidebar */}
      <AISidebar 
        isOpen={isAISidebarOpen} 
        onToggle={toggleAISidebar} 
      />
    </DndContext>
  );
}

export default App;