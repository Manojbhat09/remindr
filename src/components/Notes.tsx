import React, { useState } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface NotesProps {}

const Notes: React.FC<NotesProps> = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isImportingFromKeep, setIsImportingFromKeep] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  
  // New state for dropdown functionality
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeView, setActiveView] = useState<'notes' | 'reminders' | 'labels' | 'archive' | 'trash'>('notes');
  const [reminders, setReminders] = useState<Array<{id: string, text: string, date: Date, completed: boolean}>>([]);
  const [labels, setLabels] = useState<Array<{id: string, name: string, color: string}>>([]);
  const [archivedNotes, setArchivedNotes] = useState<Note[]>([]);
  const [trashedNotes, setTrashedNotes] = useState<Note[]>([]);

  const noteColors = [
    '#ffffff', '#f28b82', '#fbbd04', '#fff475', '#ccff90', 
    '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8'
  ];

  // Sample data for demonstration
  React.useEffect(() => {
    // Add some sample reminders
    if (reminders.length === 0) {
      setReminders([
        { id: '1', text: 'Review project notes', date: new Date(Date.now() + 86400000), completed: false },
        { id: '2', text: 'Prepare meeting agenda', date: new Date(Date.now() + 172800000), completed: true },
      ]);
    }
    
    // Add some sample labels
    if (labels.length === 0) {
      setLabels([
        { id: '1', name: 'Work', color: '#4285f4' },
        { id: '2', name: 'Personal', color: '#ea4335' },
        { id: '3', name: 'Ideas', color: '#fbbc04' },
      ]);
    }
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleAddNote = () => {
    if (formData.title.trim() || formData.content.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        content: formData.content.trim(),
        color: selectedColor,
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };
      
      setNotes(prev => [newNote, ...prev]);
      setFormData({ title: '', content: '', tags: '' });
      setSelectedColor('#ffffff');
      setIsAddingNote(false);
    }
  };

  const handleImportFromKeep = async () => {
    try {
      setIsImportingFromKeep(true);
      
      // Simulate import process with sample data
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      const sampleImportedNotes = [
        {
          title: 'Meeting Notes',
          content: 'Discussion about project timeline and deliverables for Q4.',
          color: noteColors[Math.floor(Math.random() * noteColors.length)],
          tags: ['work', 'meeting'],
          isPinned: false,
        },
        {
          title: 'Shopping List',
          content: 'Milk, bread, eggs, vegetables, and some snacks for the week.',
          color: noteColors[Math.floor(Math.random() * noteColors.length)],
          tags: ['personal', 'shopping'],
          isPinned: true,
        },
        {
          title: 'Project Ideas',
          content: 'New features to consider: dark mode, mobile app, integration with calendar.',
          color: noteColors[Math.floor(Math.random() * noteColors.length)],
          tags: ['ideas', 'development'],
          isPinned: false,
        }
      ];
      
      // Add imported notes to local state
      const newNotes = sampleImportedNotes.map(note => ({
        ...note,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      
      setNotes(prev => [...newNotes, ...prev]);
      setIsImportingFromKeep(false);
      
      // Show success feedback
      alert('Successfully imported 3 sample notes!');
      
    } catch (error) {
      console.error('Import failed:', error);
      setIsImportingFromKeep(false);
      alert('Import failed. Please try again.');
    }
  };

  const togglePin = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const deleteNote = (noteId: string) => {
    const noteToDelete = notes.find(note => note.id === noteId);
    if (noteToDelete) {
      setTrashedNotes(prev => [noteToDelete, ...prev]);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  const archiveNote = (noteId: string) => {
    const noteToArchive = notes.find(note => note.id === noteId);
    if (noteToArchive) {
      setArchivedNotes(prev => [noteToArchive, ...prev]);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  const restoreNote = (noteId: string, from: 'archive' | 'trash') => {
    if (from === 'archive') {
      const noteToRestore = archivedNotes.find(note => note.id === noteId);
      if (noteToRestore) {
        setNotes(prev => [noteToRestore, ...prev]);
        setArchivedNotes(prev => prev.filter(note => note.id !== noteId));
      }
    } else if (from === 'trash') {
      const noteToRestore = trashedNotes.find(note => note.id === noteId);
      if (noteToRestore) {
        setNotes(prev => [noteToRestore, ...prev]);
        setTrashedNotes(prev => prev.filter(note => note.id !== noteId));
      }
    }
  };

  const permanentlyDeleteNote = (noteId: string) => {
    setTrashedNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);

  return (
    <div className="min-h-screen bg-gray-100 animate-fade-in">
      {/* Google Keep Style Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 animate-slide-in-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-medium text-gray-800">Notes</h1>
            </div>
            {activeView !== 'notes' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 rounded-full">
                <span className="text-sm font-medium text-yellow-800">
                  {activeView === 'reminders' && '🔔 Reminders'}
                  {activeView === 'labels' && '✏️ Edit Labels'}
                  {activeView === 'archive' && '📦 Archive'}
                  {activeView === 'trash' && '🗑️ Trash'}
                </span>
              </div>
            )}
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search your notes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all-smooth"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                🔍
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-sm p-2 hover:bg-gray-100 transition-all-smooth" title="Refresh">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button 
              className={`btn btn-sm p-2 transition-all-smooth ${
                showDropdown ? 'btn-primary bg-blue-500 text-white' : 'btn-ghost hover:bg-gray-100'
              }`} 
              title="Grid View"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button className="btn btn-ghost btn-sm p-2 hover:bg-gray-100 transition-all-smooth" title="Settings">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid View Dropdown Menu */}
      <div className="relative dropdown-container">
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in">
            <div className="py-2">
              <button
                onClick={() => { setActiveView('notes'); setShowDropdown(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-all-smooth ${
                  activeView === 'notes' ? 'bg-yellow-50 text-yellow-800' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">📝</span>
                <span className="font-medium">Notes</span>
              </button>
              
              <button
                onClick={() => { setActiveView('reminders'); setShowDropdown(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-all-smooth ${
                  activeView === 'reminders' ? 'bg-yellow-50 text-yellow-800' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">🔔</span>
                <span className="font-medium">Reminders</span>
              </button>
              
              <button
                onClick={() => { setActiveView('labels'); setShowDropdown(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-all-smooth ${
                  activeView === 'labels' ? 'bg-yellow-50 text-yellow-800' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">✏️</span>
                <span className="font-medium">Edit Labels</span>
              </button>
              
              <button
                onClick={() => { setActiveView('archive'); setShowDropdown(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-all-smooth ${
                  activeView === 'archive' ? 'bg-yellow-50 text-yellow-800' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">📦</span>
                <span className="font-medium">Archive</span>
              </button>
              
              <button
                onClick={() => { setActiveView('trash'); setShowDropdown(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-all-smooth ${
                  activeView === 'trash' ? 'bg-yellow-50 text-yellow-800' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">🗑️</span>
                <span className="font-medium">Trash</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 bg-gray-100">
        {/* Note Creation Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all-smooth cursor-pointer"
            onClick={() => setIsAddingNote(true)}
          >
            <div className="text-gray-500 text-sm mb-2">Take a note...</div>
            <div className="flex justify-end gap-2">
              <button className="btn btn-ghost btn-sm p-2" title="Checklist">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </button>
              <button className="btn btn-ghost btn-sm p-2" title="Color">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </button>
              <button className="btn btn-ghost btn-sm p-2" title="Image">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Import Button */}
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <button
            onClick={handleImportFromKeep}
            disabled={isImportingFromKeep}
            className="btn btn-success btn-outline hover-lift hover-glow transition-all-smooth"
          >
            <span className="animate-pulse-slow">📝</span>
            {isImportingFromKeep ? (
              <span className="loading-dots">Importing</span>
            ) : (
              'Import Notes'
            )}
          </button>
        </div>

        {/* Conditional Content Based on Active View */}
        {activeView === 'notes' && (
          <div className="space-y-6 animate-fade-in">
            {/* Notes Grid */}
            <div className="space-y-6">
              {/* Pinned Notes */}
              {pinnedNotes.length > 0 && (
                <div className="animate-slide-in-top" style={{ animationDelay: '0.2s' }}>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="animate-bounce-in">📌</span>
                    Pinned Notes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {pinnedNotes.map((note, index) => (
                      <div key={note.id} className="stagger-item" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                        <NoteCard
                          note={note}
                          onTogglePin={togglePin}
                          onDelete={deleteNote}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unpinned Notes */}
              <div className="animate-slide-in-top" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Notes ({unpinnedNotes.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {unpinnedNotes.map((note, index) => (
                    <div key={note.id} className="stagger-item" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                      <NoteCard
                        note={note}
                        onTogglePin={togglePin}
                        onDelete={deleteNote}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reminders View */}
        {activeView === 'reminders' && (
          <div className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-in-top border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className="text-3xl animate-bounce-in">🔔</span>
                  Reminders
                </h2>
                
                {reminders.length === 0 ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="text-6xl mb-4 animate-bounce-slow">🔔</div>
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No reminders yet</h3>
                    <p className="text-gray-500">Create your first reminder to stay on track</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reminders.map((reminder, index) => (
                      <div key={reminder.id} className="stagger-item flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all-smooth" style={{ animationDelay: `${index * 0.1}s` }}>
                        <input
                          type="checkbox"
                          checked={reminder.completed}
                          onChange={() => {
                            setReminders(prev => prev.map(r => 
                              r.id === reminder.id ? { ...r, completed: !r.completed } : r
                            ));
                          }}
                          className="checkbox checkbox-primary"
                        />
                        <span className={`flex-1 ${reminder.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {reminder.text}
                        </span>
                        <span className="text-sm text-gray-500">
                          {reminder.date.toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Labels View */}
        {activeView === 'labels' && (
          <div className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-in-top border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className="text-3xl animate-bounce-in">✏️</span>
                  Edit Labels
                </h2>
                
                {labels.length === 0 ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="text-6xl mb-4 animate-bounce-slow">🏷️</div>
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No labels yet</h3>
                    <p className="text-gray-500">Create labels to organize your notes</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {labels.map((label, index) => (
                      <div key={label.id} className="stagger-item p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all-smooth" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: label.color }}></div>
                          <span className="font-medium text-gray-700">{label.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Archive View */}
        {activeView === 'archive' && (
          <div className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-in-top border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className="text-3xl animate-bounce-in">📦</span>
                  Archive
                </h2>
                
                {archivedNotes.length === 0 ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="text-6xl mb-4 animate-bounce-slow">📦</div>
                    <h3 className="text-xl font-medium text-gray-600 mb-2">Archive is empty</h3>
                    <p className="text-gray-500">Archived notes will appear here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {archivedNotes.map((note, index) => (
                      <div key={note.id} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <NoteCard
                          note={note}
                          onTogglePin={togglePin}
                          onDelete={deleteNote}
                          onRestore={restoreNote}
                          isArchived={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trash View */}
        {activeView === 'trash' && (
          <div className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-in-top border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className="text-3xl animate-bounce-in">🗑️</span>
                  Trash
                </h2>
                
                {trashedNotes.length === 0 ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="text-6xl mb-4 animate-bounce-slow">🗑️</div>
                    <div className="text-xl font-medium text-gray-600 mb-2">Trash is empty</div>
                    <p className="text-gray-500">Deleted notes will appear here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {trashedNotes.map((note, index) => (
                      <div key={note.id} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <NoteCard
                          note={note}
                          onTogglePin={togglePin}
                          onDelete={deleteNote}
                          onRestore={restoreNote}
                          onPermanentlyDelete={permanentlyDeleteNote}
                          isTrashed={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Note Modal - Google Keep Style */}
        {isAddingNote && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 animate-bounce-in">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="font-bold text-xl text-gray-800">Create Note</h3>
                <button
                  onClick={() => setIsAddingNote(false)}
                  className="btn btn-ghost btn-sm hover:bg-gray-100 transition-all-smooth"
                >
                  ✕
                </button>
              </div>
              
              {/* Note Content */}
              <div className="p-6">
                {/* Color Picker */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Note Color</label>
                  <div className="flex gap-3 flex-wrap">
                    {noteColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-4 transition-all-smooth hover:scale-110 ${
                          selectedColor === color ? 'border-blue-500 shadow-lg' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAddNote(); }} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full text-lg font-medium text-gray-800 bg-transparent border-none outline-none placeholder-gray-400"
                      placeholder="Title"
                    />
                  </div>
                  
                  <div>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full text-gray-700 bg-transparent border-none outline-none placeholder-gray-400 resize-none"
                      rows={8}
                      placeholder="Take a note..."
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full text-sm text-gray-600 bg-transparent border-none outline-none placeholder-gray-400"
                      placeholder="Add tags (comma-separated)"
                    />
                  </div>
                </form>
              </div>

              {/* Action Bar - Google Keep Style */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <button className="btn btn-ghost btn-sm p-2 hover:bg-gray-200 transition-all-smooth" title="Text formatting">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button className="btn btn-ghost btn-sm p-2 hover:bg-gray-200 transition-all-smooth" title="Color">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </button>
                  <button className="btn btn-ghost btn-sm p-2 hover:bg-gray-200 transition-all-smooth" title="Reminder">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h6m-6 4h6m-6 4h6" />
                    </svg>
                  </button>
                  <button className="btn btn-ghost btn-sm p-2 hover:bg-gray-200 transition-all-smooth" title="Collaborator">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </button>
                  <button className="btn btn-ghost btn-sm p-2 hover:bg-gray-200 transition-all-smooth" title="Image">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="btn btn-ghost btn-sm p-2 hover:bg-gray-200 transition-all-smooth" title="Archive">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </button>
                  <button className="btn btn-ghost btn-sm p-2 hover:bg-gray-200 transition-all-smooth" title="More">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="btn btn-ghost btn-sm p-2 hover:bg-gray-200 transition-all-smooth" title="Undo">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button className="btn btn-ghost btn-sm p-2 hover:bg-gray-200 transition-all-smooth" title="Redo">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="btn btn-primary btn-sm hover-lift hover-glow transition-all-smooth"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Note Card Component
interface NoteCardProps {
  note: Note;
  onTogglePin: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onArchive?: (noteId: string) => void;
  onRestore?: (noteId: string, from: 'archive' | 'trash') => void;
  onPermanentlyDelete?: (noteId: string) => void;
  isArchived?: boolean;
  isTrashed?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onTogglePin, 
  onDelete, 
  onArchive, 
  onRestore, 
  onPermanentlyDelete,
  isArchived = false,
  isTrashed = false
}) => {
  return (
    <div 
      className="card bg-base-100 shadow-lg hover-lift hover-scale transition-all-smooth cursor-pointer ripple"
      style={{ backgroundColor: note.color }}
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="card-title text-gray-800 line-clamp-2 text-lg">
            {note.title || 'Untitled Note'}
          </h3>
          <div className="flex gap-2">
            {!isArchived && !isTrashed && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onTogglePin(note.id); }}
                  className="btn btn-ghost btn-sm hover:btn-primary transition-all-smooth"
                  title={note.isPinned ? 'Unpin note' : 'Pin note'}
                >
                  <span className={note.isPinned ? 'animate-bounce-in' : ''}>
                    {note.isPinned ? '📌' : '📍'}
                  </span>
                </button>
                {onArchive && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onArchive(note.id); }}
                    className="btn btn-ghost btn-sm hover:btn-warning transition-all-smooth"
                    title="Archive note"
                  >
                    📦
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                  className="btn btn-ghost btn-sm hover:btn-error transition-all-smooth"
                  title="Delete note"
                >
                  🗑️
                </button>
              </>
            )}
            
            {isArchived && onRestore && (
              <button
                onClick={(e) => { e.stopPropagation(); onRestore(note.id, 'archive'); }}
                className="btn btn-ghost btn-sm hover:btn-success transition-all-smooth"
                title="Restore note"
              >
                🔄
              </button>
            )}
            
            {isTrashed && (
              <>
                {onRestore && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onRestore(note.id, 'trash'); }}
                    className="btn btn-ghost btn-sm hover:btn-success transition-all-smooth"
                    title="Restore note"
                  >
                    🔄
                  </button>
                )}
                {onPermanentlyDelete && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onPermanentlyDelete(note.id); }}
                    className="btn btn-ghost btn-sm hover:btn-error transition-all-smooth"
                    title="Permanently delete"
                  >
                    ⚠️
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        
        <p className="text-gray-700 text-sm line-clamp-4 mb-3 leading-relaxed">
          {note.content}
        </p>
        
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="badge badge-outline badge-sm hover:badge-primary transition-all-smooth"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="card-actions justify-end">
          <div className="text-xs text-gray-500 italic">
            {note.updatedAt.toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes; 