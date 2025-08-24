import React, { useState, useRef, useEffect } from 'react';

type AITab = 'assistant' | 'daily' | 'weekly' | 'monthly' | 'yearly';

interface AISidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AISidebar: React.FC<AISidebarProps> = ({ isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState<AITab>('assistant');
  const [isLoading, setIsLoading] = useState(false);
  const [isScrollingLeft, setIsScrollingLeft] = useState(false);
  const [isScrollingRight, setIsScrollingRight] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const tabs: { id: AITab; label: string; icon: string; description: string }[] = [
    {
      id: 'assistant',
      label: 'AI Assistant',
      icon: '🤖',
      description: 'Get personalized productivity advice and task suggestions'
    },
    {
      id: 'daily',
      label: 'Daily Summary',
      icon: '📅',
      description: 'AI-powered daily productivity insights and recommendations'
    },
    {
      id: 'weekly',
      label: 'Weekly Summary',
      icon: '📊',
      description: 'Weekly progress analysis and planning suggestions'
    },
    {
      id: 'monthly',
      label: 'Monthly Summary',
      icon: '📈',
      description: 'Monthly performance review and goal optimization'
    },
    {
      id: 'yearly',
      label: 'Yearly Summary',
      icon: '🎯',
      description: 'Annual productivity assessment and strategic planning'
    }
  ];

  const handleTabClick = (tabId: AITab) => {
    setActiveTab(tabId);
    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => setIsLoading(false), 1000);
  };

  const startScrolling = (direction: 'left' | 'right') => {
    if (scrollIntervalRef.current) return;
    
    scrollIntervalRef.current = setInterval(() => {
      if (tabsRef.current) {
        const scrollAmount = direction === 'left' ? -50 : 50;
        tabsRef.current.scrollLeft += scrollAmount;
      }
    }, 50);
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const handleScrollAreaHover = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setIsScrollingLeft(true);
      startScrolling('left');
    } else {
      setIsScrollingRight(true);
      startScrolling('right');
    }
  };

  const handleScrollAreaLeave = () => {
    setIsScrollingLeft(false);
    setIsScrollingRight(false);
    stopScrolling();
  };

  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'assistant':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">AI Productivity Assistant</h3>
              <p className="text-sm opacity-90">I'm here to help you optimize your productivity and achieve your goals!</p>
            </div>
            
            <div className="space-y-3">
              <button className="btn btn-primary w-full text-left hover-lift hover-glow transition-all-smooth">
                <div className="font-medium">🎯 Set SMART Goals</div>
                <div className="text-sm opacity-90">Get AI help creating specific, measurable goals</div>
              </button>
              
              <button className="btn btn-success w-full text-left hover-lift hover-glow transition-all-smooth">
                <div className="font-medium">📋 Task Prioritization</div>
                <div className="text-sm opacity-90">AI-powered task prioritization using Eisenhower Matrix</div>
              </button>
              
              <button className="btn btn-secondary w-full text-left hover-lift hover-glow transition-all-smooth">
                <div className="font-medium">⏰ Time Management</div>
                <div className="text-sm opacity-90">Get personalized time management strategies</div>
              </button>
              
              <button className="btn btn-warning w-full text-left hover-lift hover-glow transition-all-smooth">
                <div className="font-medium">💡 Productivity Tips</div>
                <div className="text-sm opacity-90">Daily productivity tips based on your patterns</div>
              </button>
              
              <button className="btn btn-accent w-full text-left hover-lift hover-glow transition-all-smooth">
                <div className="font-medium">🤖 AI Autofill</div>
                <div className="text-sm opacity-90">Let AI populate your productivity insights</div>
              </button>
            </div>
          </div>
        );
        
      case 'daily':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Daily AI Summary</h3>
              <p className="text-sm opacity-90">Your personalized daily productivity insights</p>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Analyzing your day...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Today's Focus Areas</h4>
                    <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors">
                      🤖 Autofill
                    </button>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Complete high-priority tasks first</li>
                    <li>• Take breaks every 90 minutes</li>
                    <li>• Review your goals progress</li>
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">AI Recommendations</h4>
                    <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors">
                      🤖 Autofill
                    </button>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Try the Pomodoro technique for focus</li>
                    <li>• Schedule your most important task for 9 AM</li>
                    <li>• Review your Eisenhower Matrix</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'weekly':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Weekly AI Summary</h3>
              <p className="text-sm opacity-90">Your weekly productivity analysis and planning</p>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Analyzing your week...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Weekly Insights</h4>
                    <button className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors">
                      🤖 Autofill
                    </button>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Task completion rate: 78%</li>
                    <li>• Most productive day: Wednesday</li>
                    <li>• Peak focus time: 10 AM - 12 PM</li>
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Next Week Planning</h4>
                    <button className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">
                      🤖 Autofill
                    </button>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Schedule complex tasks for Wednesday</li>
                    <li>• Plan breaks during low-energy periods</li>
                    <li>• Set realistic daily goals</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'monthly':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Monthly AI Summary</h3>
              <p className="text-sm opacity-90">Monthly performance review and optimization</p>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Analyzing your month...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Monthly Metrics</h4>
                    <button className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 transition-colors">
                      🤖 Autofill
                    </button>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Overall productivity score: 82/100</li>
                    <li>• Goals completed: 6/8</li>
                    <li>• Average daily focus time: 6.2 hours</li>
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Optimization Tips</h4>
                    <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                      🤖 Autofill
                    </button>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Reduce context switching</li>
                    <li>• Implement time blocking</li>
                    <li>• Review and adjust goals</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'yearly':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Yearly AI Summary</h3>
              <p className="text-sm opacity-90">Annual assessment and strategic planning</p>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Analyzing your year...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Annual Achievements</h4>
                    <button className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">
                      🤖 Autofill
                    </button>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Major goals accomplished: 4/5</li>
                    <li>• Productivity improvement: +23%</li>
                    <li>• New skills developed: 3</li>
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Strategic Planning</h4>
                    <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors">
                      🤖 Autofill
                    </button>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Set ambitious but achievable goals</li>
                    <li>• Focus on high-impact activities</li>
                    <li>• Build sustainable habits</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      {/* Toggle Button - Positioned on the bottom-right side */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all-smooth hover-lift hover-glow animate-float"
        title="Toggle AI Assistant"
      >
        <span className="text-2xl">
          {isOpen ? '✕' : '🤖'}
        </span>
      </button>

      {/* AI Sidebar - Slides in from the right */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 animate-slide-in-top">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 animate-fade-in">AI Assistant</h2>
                <p className="text-sm opacity-90 animate-fade-in" style={{ animationDelay: '0.1s' }}>Your intelligent productivity companion</p>
              </div>
              <button
                onClick={onToggle}
                className="btn btn-ghost btn-sm text-white hover:bg-white/20 transition-all-smooth hover-scale"
                title="Close AI Assistant"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs with Horizontal Scroll */}
          <div className="relative border-b border-gray-200 bg-gray-50">
            {/* Left Scroll Area */}
            <div
              className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 cursor-pointer flex items-center justify-center"
              onMouseEnter={() => handleScrollAreaHover('left')}
              onMouseLeave={handleScrollAreaLeave}
            >
              {isScrollingLeft && (
                <div className="w-4 h-4 border-l-2 border-t-2 border-blue-600 transform rotate-[-45deg]"></div>
              )}
            </div>

            {/* Right Scroll Area */}
            <div
              className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 cursor-pointer flex items-center justify-center"
              onMouseEnter={() => handleScrollAreaHover('right')}
              onMouseLeave={handleScrollAreaLeave}
            >
              {isScrollingRight && (
                <div className="w-4 h-4 border-r-2 border-t-2 border-blue-600 transform rotate-45"></div>
              )}
            </div>

            {/* Scrollable Tabs Container */}
            <div 
              ref={tabsRef}
              className="flex overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex-shrink-0 px-4 py-3 text-xs font-medium transition-all-smooth min-w-[80px] hover-scale ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                  title={tab.description}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-lg mb-1 animate-bounce-in">{tab.icon}</div>
                  <div className="truncate">{tab.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 animate-fade-in">
            {renderTabContent()}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center text-xs text-gray-500">
              <p>AI-powered insights</p>
              <p>Updated in real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop - Only show when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={onToggle}
        />
      )}

      {/* Custom CSS for hiding scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default AISidebar; 