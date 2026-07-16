package com.example.todo.service;

import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.exception.ResourceNotFoundException;
import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoResponse createTodo(TodoRequest request) {
        Todo todo = Todo.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .completed(request.getCompleted() != null && request.getCompleted())
                .build();

        Todo savedTodo = todoRepository.save(todo);
        return mapToResponse(savedTodo);
    }

    public List<TodoResponse> getTodos(Boolean completed, int page, int limit) {
        // Retrieve newest todos first
        Pageable pageable = PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Todo> todoPage;

        if (completed != null) {
            todoPage = todoRepository.findByCompleted(completed, pageable);
        } else {
            todoPage = todoRepository.findAll(pageable);
        }

        return todoPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TodoResponse getTodoById(String id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        return mapToResponse(todo);
    }

    public TodoResponse updateTodo(String id, TodoRequest request) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }

        Todo updatedTodo = todoRepository.save(todo);
        return mapToResponse(updatedTodo);
    }

    public void deleteTodo(String id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        todoRepository.delete(todo);
    }

    private TodoResponse mapToResponse(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .description(todo.getDescription())
                .completed(todo.isCompleted())
                .createdAt(todo.getCreatedAt())
                .updatedAt(todo.getUpdatedAt())
                .build();
    }
}
