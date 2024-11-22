// components/project-list/ProjectButton.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProjectButton = ({ project, onPress, searchText = '' }) => {
  const highlightText = (text) => {
    if (!searchText) return text;

    const parts = text.split(new RegExp(`(${searchText})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchText.toLowerCase() ? (
            <Text key={index} style={styles.highlight}>{part}</Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </>
    );
  };

  return (
    <View style={styles.projectContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onPress(project)}
      >
        <Text style={styles.projectText}>
          <Text style={{ fontWeight: 'bold' }}>[{highlightText(project.project_id)}]</Text>
          {' '}
          {highlightText(project.project_name)}
          {' '}
          ({project.dimension_display_value.split('|')[0]})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#FF8C00',
    borderRadius: 5,
    padding: 10,
  },
  highlight: {
    backgroundColor: '#FFEB3B',
    color: '#000000',
  },
  projectContainer: {
    marginHorizontal: 8,
    marginVertical: 4,
  },
  projectText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'left',
    width: '100%',
  },
});

export default ProjectButton;
