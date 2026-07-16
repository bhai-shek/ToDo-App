const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred';
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export async function fetchTodos(completed, page = 0, limit = 10) {
  let url = `${BASE_URL}/todos?page=${page}&limit=${limit}`;
  if (completed !== null && completed !== undefined) {
    url += `&completed=${completed}`;
  }
  const response = await fetch(url);
  return handleResponse(response);
}

export async function fetchTodoById(id) {
  const response = await fetch(`${BASE_URL}/todos/${id}`);
  return handleResponse(response);
}

export async function createTodo(todoData) {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoData),
  });
  return handleResponse(response);
}

export async function updateTodo(id, todoData) {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoData),
  });
  return handleResponse(response);
}

export async function deleteTodo(id) {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}
