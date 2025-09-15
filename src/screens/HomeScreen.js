// src/screens/HomeScreen.js

// NEW: Import useEffect and the AsyncStorage library
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, AppState } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import TodoItem from '../components/TodoItem';
import AddTaskModal from '../components/AddTaskModal';
import EditTaskModal from '../components/EditTaskModal';

const HomeScreen = () => {
  // MODIFIED: The initial state is now an empty array.
  const [todos, setTodos] = useState([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // NEW: useEffect hook to LOAD todos from storage when the app starts.
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const savedTodos = await AsyncStorage.getItem('todos');
        if (savedTodos !== null) {
          setTodos(JSON.parse(savedTodos));
        }
      } catch (error) {
        console.error("Failed to load todos.", error);
      }
    };

    loadTodos();
  }, []); // The empty array [] means this effect runs only once on mount.

  // NEW: useEffect hook to SAVE todos to storage whenever the 'todos' state changes.
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem('todos', JSON.stringify(todos));
      } catch (error) {
        console.error("Failed to save todos.", error);
      }
    };
    
    // We prevent saving the initial empty array on the first render.
    // This check can be made more robust, but it works for this case.
    if (todos.length > 0) {
      saveTodos();
    }
  }, [todos]); // The [todos] means this effect runs anytime the 'todos' array changes.

  const handleAddTask = (taskText) => {
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };
    setTodos([newTask, ...todos]);
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  
  const handleOpenEditModal = (todo) => {
    setEditingTodo(todo);
    setIsEditModalVisible(true);
  };
  
  const handleSaveTask = (id, newText) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
    setIsEditModalVisible(false);
    setEditingTodo(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Task Manager</Text>
      </View>

      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onToggle={() => handleToggleTodo(item.id)}
            onDelete={() => handleDeleteTodo(item.id)}
            onEdit={() => handleOpenEditModal(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet. Add one!</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={30} color={COLORS.background} />
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTask={handleAddTask}
      />

      <EditTaskModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTodo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 40,
    backgroundColor: COLORS.accent,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default HomeScreen;