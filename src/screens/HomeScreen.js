// src/screens/HomeScreen.js

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Dimensions,
  Platform,
  Switch 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TodoItem from '../components/TodoItem';
import AddTaskModal from '../components/AddTaskModal';
import EditTaskModal from '../components/EditTaskModal';

const { width } = Dimensions.get('window');

// Theme definitions
const lightTheme = {
  background: '#0F172A',
  surface: '#1E293B',
  primary: '#6366F1',
  primaryLight: '#334155',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#475569',
  shadow: '#000',
  accent: '#10B981',
  danger: '#EF4444',
  statusBar: 'light-content'
};

const darkTheme = {


  background: '#F8F9FA',
  surface: '#FFFFFF',
  primary: '#4F46E5',
  primaryLight: '#F3F4F6',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#D1D5DB',
  shadow: '#000',
  accent: '#10B981',
  danger: '#EF4444',
  statusBar: 'dark-content'
};

const HomeScreen = () => {
  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Load todos and theme preference from storage when the app starts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load todos
        const savedTodos = await AsyncStorage.getItem('todos');
        if (savedTodos !== null) {
          setTodos(JSON.parse(savedTodos));
        }

        // Load theme preference
        const savedTheme = await AsyncStorage.getItem('darkMode');
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error("Failed to load data.", error);
      }
    };

    loadData();
  }, []);

  // Save todos to storage whenever the 'todos' state changes
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem('todos', JSON.stringify(todos));
      } catch (error) {
        console.error("Failed to save todos.", error);
      }
    };
    
    if (todos.length > 0) {
      saveTodos();
    }
  }, [todos]);

  // Save theme preference whenever it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      } catch (error) {
        console.error("Failed to save theme.", error);
      }
    };

    saveTheme();
  }, [isDarkMode]);

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

  // Calculate task statistics
  const completedTasks = todos.filter(todo => todo.completed).length;
  const totalTasks = todos.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: theme.primaryLight }]}>
        <MaterialIcons name="assignment" size={80} color={theme.textSecondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>No Tasks Yet</Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Tap the + button below to create your first task
      </Text>
    </View>
  );

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.surface} />
      
      {/* Enhanced Header */}
      <View style={[styles.headerContainer, { backgroundColor: theme.surface }]}>
        <View style={styles.headerContent}>
          {/* Header Top Row with Title and Theme Toggle */}
          <View style={styles.headerTopRow}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: theme.text }]}>Task Manager</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Stay organized, stay productive
              </Text>
            </View>
            
            {/* Theme Toggle */}
            <View style={styles.themeToggleContainer}>
              <MaterialIcons 
                name={isDarkMode ? "light-mode" : "dark-mode"} 
                size={20} 
                color={theme.textSecondary} 
                style={styles.themeIcon}
              />
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={isDarkMode ? theme.surface : '#FFFFFF'}
              />
            </View>
          </View>
          
          {/* Task Statistics */}
          {totalTasks > 0 && (
            <View style={[styles.statsContainer, { backgroundColor: theme.primaryLight }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.text }]}>{totalTasks}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.text }]}>{completedTasks}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Done</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.accent }]}>{completionRate}%</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Progress</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Task List */}
      <View style={[styles.contentContainer, { backgroundColor: theme.background }]}>
        <FlatList
          data={todos}
          renderItem={({ item, index }) => (
            <View style={[styles.taskItemWrapper, index === 0 && styles.firstItem]}>
              <TodoItem
                item={item}
                onToggle={() => handleToggleTodo(item.id)}
                onDelete={() => handleDeleteTodo(item.id)}
                onEdit={() => handleOpenEditModal(item)}
                theme={theme}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      {/* Enhanced Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }, dynamicStyles.fabShadow]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTask={handleAddTask}
        theme={theme}
      />

      <EditTaskModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTodo}
        theme={theme}
      />
    </SafeAreaView>
  );
};

const createDynamicStyles = (theme) => {
  return StyleSheet.create({
    fabShadow: {
      ...Platform.select({
        ios: {
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  themeIcon: {
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  taskItemWrapper: {
    marginBottom: 2,
  },
  firstItem: {
    marginTop: 0,
  },
  separator: {
    height: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;