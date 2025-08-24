import React from 'react';
import { Task, Goal, Review } from '../App';

interface ProductivityInsightsProps {
  tasks: Task[];
  goals: Goal[];
  reviews: Review[];
}

const ProductivityInsights: React.FC<ProductivityInsightsProps> = ({ tasks, goals, reviews }) => {
  const getTaskCompletionRate = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getAverageTaskDuration = () => {
    if (tasks.length === 0) return 0;
    const totalDuration = tasks.reduce((sum, task) => sum + (task.duration || 0), 0);
    return Math.round(totalDuration / tasks.length);
  };

  const getPriorityDistribution = () => {
    const distribution = {
      urgent: tasks.filter(t => t.priority === 'urgent').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    };
    return distribution;
  };

  const getComplexityDistribution = () => {
    const distribution = {
      simple: tasks.filter(t => t.complexity === 'simple').length,
      moderate: tasks.filter(t => t.complexity === 'moderate').length,
      complex: tasks.filter(t => t.complexity === 'complex').length,
    };
    return distribution;
  };

  const getGoalProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.round(totalProgress / goals.length);
  };

  const getRecentProductivity = () => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentTasks = tasks.filter(task => 
      task.createdAt >= lastWeek || (task.completedAt && task.completedAt >= lastWeek)
    );
    
    const completed = recentTasks.filter(t => t.status === 'completed').length;
    return { total: recentTasks.length, completed };
  };

  const getDueTasks = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const overdue = tasks.filter(task => 
      task.targetDate && new Date(task.targetDate) < today && task.status !== 'completed'
    ).length;
    
    const dueToday = tasks.filter(task => 
      task.targetDate && 
      new Date(task.targetDate) >= today && 
      new Date(task.targetDate) < tomorrow && 
      task.status !== 'completed'
    ).length;
    
    const dueTomorrow = tasks.filter(task => 
      task.targetDate && 
      new Date(task.targetDate) >= tomorrow && 
      new Date(task.targetDate) < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) && 
      task.status !== 'completed'
    ).length;
    
    return { overdue, dueToday, dueTomorrow };
  };

  const getProductivityTrend = () => {
    if (reviews.length < 2) return 'stable';
    
    const recentReviews = reviews
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2);
    
    const firstReview = recentReviews[1];
    const latestReview = recentReviews[0];
    
    if (firstReview && latestReview) {
      const firstScore = firstReview.accomplishments.length - firstReview.challenges.length;
      const latestScore = latestReview.accomplishments.length - latestReview.challenges.length;
      
      if (latestScore > firstScore) return 'improving';
      if (latestScore < firstScore) return 'declining';
    }
    
    return 'stable';
  };

  const getProductivityScore = () => {
    let score = 0;
    
    // Task completion rate (40% weight)
    score += (getTaskCompletionRate() / 100) * 40;
    
    // Goal progress (30% weight)
    score += (getGoalProgress() / 100) * 30;
    
    // Recent productivity (20% weight)
    const recent = getRecentProductivity();
    if (recent.total > 0) {
      score += (recent.completed / recent.total) * 20;
    }
    
    // Priority balance (10% weight)
    const priorityDist = getPriorityDistribution();
    const totalPriority = priorityDist.urgent + priorityDist.high + priorityDist.medium + priorityDist.low;
    if (totalPriority > 0) {
      const balancedPriority = (priorityDist.medium + priorityDist.low) / totalPriority;
      score += balancedPriority * 10;
    }
    
    return Math.round(score);
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (getTaskCompletionRate() < 70) {
      recommendations.push("Focus on completing more tasks to improve your productivity score");
    }
    
    if (getPriorityDistribution().urgent > getPriorityDistribution().medium + getPriorityDistribution().low) {
      recommendations.push("Consider reducing urgent tasks by planning ahead and setting better priorities");
    }
    
    if (getGoalProgress() < 50) {
      recommendations.push("Break down your goals into smaller, more manageable tasks");
    }
    
    if (getRecentProductivity().completed < 3) {
      recommendations.push("Try the Pomodoro technique to maintain focus and complete more tasks");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Great job! You're maintaining excellent productivity. Keep up the good work!");
    }
    
    return recommendations;
  };

  const productivityScore = getProductivityScore();
  const trend = getProductivityTrend();
  const recommendations = getRecommendations();
  const dueTasks = getDueTasks();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Productivity Insights</h3>
      
      {/* Main Score */}
      <div className="text-center mb-8">
        <div className="text-4xl font-bold text-gray-800 mb-2">{productivityScore}</div>
        <div className="text-lg text-gray-600 mb-2">Productivity Score</div>
        <div className="flex items-center justify-center space-x-2">
          <span className={`text-sm px-2 py-1 rounded-full ${
            trend === 'improving' ? 'bg-green-100 text-green-800' :
            trend === 'declining' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {trend === 'improving' ? '↗ Improving' :
             trend === 'declining' ? '↘ Declining' :
             '→ Stable'}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{getTaskCompletionRate()}%</div>
          <div className="text-sm text-gray-600">Task Completion</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{getGoalProgress()}%</div>
          <div className="text-sm text-gray-600">Goal Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{getAverageTaskDuration()}</div>
          <div className="text-sm text-gray-600">Avg Duration (h)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{getRecentProductivity().completed}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
      </div>

      {/* Due Tasks Alert */}
      {(dueTasks.overdue > 0 || dueTasks.dueToday > 0) && (
        <div className="mb-6 p-4 rounded-lg border-2 border-red-200 bg-red-50">
          <h4 className="font-medium text-red-800 mb-2">⚠️ Due Tasks Alert</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {dueTasks.overdue > 0 && (
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">{dueTasks.overdue}</div>
                <div className="text-red-700">Overdue</div>
              </div>
            )}
            {dueTasks.dueToday > 0 && (
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">{dueTasks.dueToday}</div>
                <div className="text-orange-700">Due Today</div>
              </div>
            )}
            {dueTasks.dueTomorrow > 0 && (
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600">{dueTasks.dueTomorrow}</div>
                <div className="text-yellow-700">Due Tomorrow</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Priority Distribution */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Task Priority Distribution</h4>
        <div className="space-y-2">
          {Object.entries(getPriorityDistribution()).map(([priority, count]) => (
            <div key={priority} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 capitalize">{priority}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      priority === 'urgent' ? 'bg-red-500' :
                      priority === 'high' ? 'bg-orange-500' :
                      priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(count / Math.max(tasks.length, 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800 w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complexity Distribution */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Task Complexity Distribution</h4>
        <div className="space-y-2">
          {Object.entries(getComplexityDistribution()).map(([complexity, count]) => (
            <div key={complexity} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 capitalize">{complexity}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      complexity === 'simple' ? 'bg-green-500' :
                      complexity === 'moderate' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(count / Math.max(tasks.length, 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800 w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Recommendations</h4>
        <div className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">💡</span>
              <span className="text-sm text-gray-700">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductivityInsights; 