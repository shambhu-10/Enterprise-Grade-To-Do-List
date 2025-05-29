import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiCalendar, FiUser, FiZap, FiFilter, FiX, FiSave } from 'react-icons/fi';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle keyboard events for edit mode
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (editingTask) {
        if (e.key === 'Enter') {
          handleSaveEdit(editingTask.id);
        } else if (e.key === 'Escape') {
          setEditingTask(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [editingTask]);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleParseTask = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/parse-task', { input });
      const newTask = {
        ...response.data,
        id: Date.now(),
        status: false
      };
      setTasks(prev => [...prev, newTask]);
      setInput('');
      showToastMessage('Task added successfully!');
    } catch (err) {
      setError('Failed to parse task. Please try again.');
      console.error('Error parsing task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    showToastMessage('Task deleted successfully!');
  };

  const handleToggleStatus = (taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: !task.status } : task
    ));
  };

  const handleEditTask = (task) => {
    setEditingTask({ ...task });
  };

  const handleSaveEdit = (taskId) => {
    if (!editingTask) return;
    
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...editingTask } : task
    ));
    setEditingTask(null);
    showToastMessage('Task updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.status;
    if (filter === 'completed') return task.status;
    return task.priority === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 transition-all duration-300">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center font-sans">
            Natural Language Task Manager
          </h1>
          
          <div className="relative mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., Finish report for Anjali by 7pm tomorrow urgent"
                  className="input pl-12 pr-4 py-4 text-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-xl"
                  onKeyPress={(e) => e.key === 'Enter' && handleParseTask()}
                />
                <FiZap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
              </div>
              <button
                onClick={handleParseTask}
                disabled={loading}
                className="btn px-6 py-4 text-lg flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiZap className="w-5 h-5" />
                {loading ? 'Parsing...' : 'Parse Task'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 text-red-500 dark:text-red-200 p-4 rounded-xl mb-6 animate-fade-in">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <FiFilter className="text-gray-500 dark:text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl w-full sm:w-auto"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="P1">Priority 1</option>
                <option value="P2">Priority 2</option>
                <option value="P3">Priority 3</option>
                <option value="P4">Priority 4</option>
              </select>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredTasks.length} tasks
            </span>
          </div>

          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No tasks yet. Add one above!
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 p-4 border-b border-gray-100 dark:border-gray-600">
                  <div className="col-span-5">Task</div>
                  <div className="col-span-2">Assignee</div>
                  <div className="col-span-2">Due Date</div>
                  <div className="col-span-2">Priority</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                {filteredTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`p-4 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                      index !== filteredTasks.length - 1 ? 'border-b border-gray-100 dark:border-gray-600' : ''
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        {editingTask?.id === task.id ? (
                          <input
                            type="text"
                            value={editingTask.task}
                            onChange={(e) => setEditingTask({ ...editingTask, task: e.target.value })}
                            className="input bg-gray-50 dark:bg-gray-600 dark:text-white rounded-lg w-full"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleStatus(task.id)}
                              className={`p-2 rounded-full transition-colors ${
                                task.status ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-gray-100 dark:bg-gray-600'
                              }`}
                            >
                              <FiCheck className={`w-5 h-5 ${
                                task.status ? 'text-emerald-500' : 'text-gray-400'
                              }`} />
                            </button>
                            <span className={`text-lg font-medium ${
                              task.status ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                            }`}>
                              {task.task}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="col-span-2">
                        {editingTask?.id === task.id ? (
                          <input
                            type="text"
                            value={editingTask.assignee}
                            onChange={(e) => setEditingTask({ ...editingTask, assignee: e.target.value })}
                            className="input bg-gray-50 dark:bg-gray-600 dark:text-white rounded-lg w-full"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <FiUser className="text-emerald-500" />
                            <span className="text-gray-600 dark:text-gray-300">{task.assignee}</span>
                          </div>
                        )}
                      </div>

                      <div className="col-span-2">
                        {editingTask?.id === task.id ? (
                          <input
                            type="text"
                            value={editingTask.due}
                            onChange={(e) => setEditingTask({ ...editingTask, due: e.target.value })}
                            className="input bg-gray-50 dark:bg-gray-600 dark:text-white rounded-lg w-full"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-emerald-500" />
                            <span className="text-gray-600 dark:text-gray-300">{task.due}</span>
                          </div>
                        )}
                      </div>

                      <div className="col-span-2">
                        {editingTask?.id === task.id ? (
                          <select
                            value={editingTask.priority}
                            onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                            className="input bg-gray-50 dark:bg-gray-600 dark:text-white rounded-lg w-full"
                          >
                            <option value="P1">P1</option>
                            <option value="P2">P2</option>
                            <option value="P3">P3</option>
                            <option value="P4">P4</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            task.priority === 'P1' ? 'bg-red-500' :
                            task.priority === 'P2' ? 'bg-orange-500' :
                            task.priority === 'P3' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          } text-white`}>
                            {task.priority}
                          </span>
                        )}
                      </div>

                      <div className="col-span-1 flex justify-end gap-2">
                        {editingTask?.id === task.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(task.id)}
                              className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-full transition-colors"
                              title="Save"
                            >
                              <FiSave className="w-5 h-5 text-emerald-500" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
                              title="Cancel"
                            >
                              <FiX className="w-5 h-5 text-red-500" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 className="w-5 h-5 text-blue-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App; 