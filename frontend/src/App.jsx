import { useState, useEffect, useCallback } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [page, setPage] = useState(0);
  const limit = 5; // 5 items per page to make pagination easy to see

  // Input states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Editing modal states
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Feedback states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Load Todos
  const loadTodos = useCallback(async () => {
    setLoading(true);
    try {
      const completedParam = 
        filter === 'completed' ? true : 
        filter === 'active' ? false : null;
      
      const data = await fetchTodos(completedParam, page, limit);
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Handle Form Submit (Create)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }
    try {
      await createTodo({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
      setSuccess('Todo created successfully!');
      setPage(0); // Go back to first page to see the new todo
      loadTodos();
    } catch (err) {
      setError(err.message || 'Failed to create todo');
    }
  };

  // Toggle Complete Checkbox
  const handleToggleComplete = async (todo) => {
    try {
      await updateTodo(todo.id, {
        title: todo.title,
        description: todo.description,
        completed: !todo.completed
      });
      setSuccess(`Todo marked as ${!todo.completed ? 'completed' : 'active'}`);
      loadTodos();
    } catch (err) {
      setError(err.message || 'Failed to update todo');
    }
  };

  // Open Edit Modal
  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  // Save Edit Modal
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }
    try {
      await updateTodo(editingTodo.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        completed: editingTodo.completed
      });
      setEditingTodo(null);
      setSuccess('Todo updated successfully!');
      loadTodos();
    } catch (err) {
      setError(err.message || 'Failed to update todo');
    }
  };

  // Delete Todo
  const handleDeleteTodo = async (todo) => {
    if (!window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      return;
    }
    try {
      await deleteTodo(todo.id);
      setSuccess('Todo deleted successfully!');
      // If we deleted the last item on the page, go to previous page
      if (todos.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        loadTodos();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete todo');
    }
  };

  // Filter change helper
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(0); // Reset page on filter change
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">TaskForge</h1>
        <p className="app-subtitle">A gorgeous, responsive full-stack task manager</p>
      </header>

      {/* Error and Success Banners */}
      {error && (
        <div className="alert-banner alert-error">
          <span>⚠️ {error}</span>
          <button className="alert-close" onClick={() => setError('')}>&times;</button>
        </div>
      )}

      {success && (
        <div className="alert-banner alert-success">
          <span>✨ {success}</span>
          <button className="alert-close" onClick={() => setSuccess('')}>&times;</button>
        </div>
      )}

      {/* Todo Form */}
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group">
          <label className="form-label" htmlFor="todo-title">Task Title</label>
          <input
            id="todo-title"
            className="form-input"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="todo-description">Description (Optional)</label>
          <textarea
            id="todo-description"
            className="form-textarea"
            placeholder="Add details about this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">Add Task</button>
      </form>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => handleFilterChange('active')}
          >
            Active
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('completed')}
          >
            Completed
          </button>
        </div>
        <div className="todo-stats">
          Showing {todos.length} task{todos.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Todo List */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-text">Loading tasks...</div>
        </div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <div className="empty-text">No tasks found</div>
          <p className="empty-subtext">Get started by creating a new task above!</p>
        </div>
      ) : (
        <div className="todo-list">
          {todos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-item-content">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo)}
                  />
                  <span className="checkmark"></span>
                </label>
                <div className="todo-text">
                  <span className="todo-item-title">{todo.title}</span>
                  {todo.description && (
                    <span className="todo-item-description">{todo.description}</span>
                  )}
                </div>
              </div>
              <div className="todo-actions">
                <button
                  className="action-btn action-btn-edit"
                  title="Edit task"
                  onClick={() => openEditModal(todo)}
                >
                  ✎
                </button>
                <button
                  className="action-btn action-btn-delete"
                  title="Delete task"
                  onClick={() => handleDeleteTodo(todo)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-container">
        <button
          className="btn btn-secondary pagination-btn"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          &larr; Previous
        </button>
        <span>Page {page + 1}</span>
        <button
          className="btn btn-secondary pagination-btn"
          disabled={todos.length < limit}
          onClick={() => setPage(page + 1)}
        >
          Next &rarr;
        </button>
      </div>

      {/* Edit Modal */}
      {editingTodo && (
        <div className="modal-overlay" onClick={() => setEditingTodo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Task</h2>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="todo-form" style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-title">Task Title</label>
                  <input
                    id="edit-title"
                    className="form-input"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label" htmlFor="edit-description">Description</label>
                  <textarea
                    id="edit-description"
                    className="form-textarea"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingTodo(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
