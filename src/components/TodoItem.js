// src/components/TodoItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// NEW: Add onEdit to the props
const TodoItem = ({ item, onToggle, onDelete, onEdit }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggle} style={styles.taskContainer}>
        <MaterialIcons
          name={item.completed ? 'check-box' : 'check-box-outline-blank'}
          size={24}
          color={item.completed ? COLORS.success : COLORS.accent}
        />
        <Text
          style={[
            styles.taskText,
            item.completed && styles.completedTaskText,
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>

      {/* NEW: Container for the action icons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={onEdit}>
          <MaterialIcons name="edit" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons name="delete-outline" size={24} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allows text to take up available space
  },
  taskText: {
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 12,
    marginRight: 10, // Add space between text and icons
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  // NEW: Style for the icon group
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, // Adds space between the edit and delete icons
  },
});

export default TodoItem;