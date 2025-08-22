import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EditProfileButtonProps } from '@/types/features/setting';
import { Colors } from '@/constants';

export const EditProfileButton: React.FC<EditProfileButtonProps> = ({
  onPress,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
    >
      <Ionicons name="pencil" size={20} color={Colors.primary[600]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
});
