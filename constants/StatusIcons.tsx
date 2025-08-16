import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './Colors';
import { EventStatus } from '@/types';

interface StatusIconProps {
  status: EventStatus;
  size?: number;
}

export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = 16,
}) => {
  switch (status) {
    case 'planning':
      return <Ionicons name="time-outline" size={size} color={Colors.warning[500]} />;
    case 'confirmed':
      return <Ionicons name="checkmark-circle-outline" size={size} color={Colors.success[500]} />;
    case 'completed':
      return <Ionicons name="radio-button-off-outline" size={size} color={Colors.gray[500]} />;
    default:
      return <Ionicons name="time-outline" size={size} color={Colors.gray[500]} />;
  }
};
