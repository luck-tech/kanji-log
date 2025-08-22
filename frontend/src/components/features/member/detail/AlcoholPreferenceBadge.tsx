import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseComponentProps } from '../../../../types/common/ui';
import { AlcoholPreference } from '../../../../types/common/base';
import { Colors } from '@/constants';

interface AlcoholPreferenceBadgeProps extends BaseComponentProps {
  preference: AlcoholPreference;
}

/**
 * アルコール嗜好バッジ - アルコールの嗜好を表示
 */
export const AlcoholPreferenceBadge: React.FC<AlcoholPreferenceBadgeProps> = ({
  preference,
  style,
  testID,
}) => {
  const getAlcoholPreferenceStyle = (pref: AlcoholPreference) => {
    switch (pref) {
      case 'yes':
        return {
          container: styles.successContainer,
          text: styles.successText,
          label: '飲める',
        };
      case 'no':
        return {
          container: styles.errorContainer,
          text: styles.errorText,
          label: '飲めない',
        };
      default:
        return {
          container: styles.warningContainer,
          text: styles.warningText,
          label: 'たまに飲む',
        };
    }
  };

  const alcoholStyle = getAlcoholPreferenceStyle(preference);

  return (
    <View style={[alcoholStyle.container, style]} testID={testID}>
      <Text style={alcoholStyle.text}>{alcoholStyle.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  successContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.success[100],
    borderRadius: 12,
  },
  successText: {
    fontWeight: '500',
    color: Colors.success[700],
  },
  errorContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.error[100],
    borderRadius: 12,
  },
  errorText: {
    fontWeight: '500',
    color: Colors.error[700],
  },
  warningContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.warning[100],
    borderRadius: 12,
  },
  warningText: {
    fontWeight: '500',
    color: Colors.warning[700],
  },
});
