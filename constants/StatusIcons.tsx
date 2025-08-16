import React from 'react';
import { Clock, CircleCheck, Circle } from 'lucide-react-native';
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
      return <Clock size={size} color={Colors.warning[500]} />;
    case 'confirmed':
      return <CircleCheck size={size} color={Colors.success[500]} />;
    case 'completed':
      return <Circle size={size} color={Colors.gray[500]} />;
    default:
      return <Clock size={size} color={Colors.gray[500]} />;
  }
};
