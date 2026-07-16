package com.example.todo;

import com.example.todo.controller.TodoController;
import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.exception.ResourceNotFoundException;
import com.example.todo.service.TodoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
public class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoService todoService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateTodo_Success() throws Exception {
        TodoRequest request = TodoRequest.builder()
                .title("Test Todo")
                .description("Test Description")
                .build();

        TodoResponse response = TodoResponse.builder()
                .id("123")
                .title("Test Todo")
                .description("Test Description")
                .completed(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(todoService.createTodo(any(TodoRequest.class))).thenReturn(response);

        mockMvc.perform(post("/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("123"))
                .andExpect(jsonPath("$.title").value("Test Todo"))
                .andExpect(jsonPath("$.description").value("Test Description"))
                .andExpect(jsonPath("$.completed").value(false));
    }

    @Test
    public void testCreateTodo_BadRequest_BlankTitle() throws Exception {
        TodoRequest request = TodoRequest.builder()
                .title("") // Blank title to trigger validation error
                .description("Test Description")
                .build();

        mockMvc.perform(post("/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Title is required and cannot be blank"));
    }

    @Test
    public void testGetTodoById_NotFound() throws Exception {
        String nonExistentId = "999";
        when(todoService.getTodoById(nonExistentId))
                .thenThrow(new ResourceNotFoundException("Todo not found with id: " + nonExistentId));

        mockMvc.perform(get("/todos/" + nonExistentId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Todo not found with id: " + nonExistentId));
    }
}
