import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RestaurantCard } from './RestaurantCard';
import { BaseComponentProps } from '../../../../types/common/ui';
import { RestaurantSuggestion } from '../../../../types/features/event';

interface RestaurantSelectionProps extends BaseComponentProps {
  restaurants: RestaurantSuggestion[];
  selectedRestaurant: RestaurantSuggestion | null;
  onRestaurantSelect: (restaurant: RestaurantSuggestion) => void;
}

/**
 * レストラン選択状態管理 - レストラン一覧と選択状態を管理するコンポーネント
 */
export const RestaurantSelection: React.FC<RestaurantSelectionProps> = ({
  restaurants,
  selectedRestaurant,
  onRestaurantSelect,
  style,
  testID,
}) => {
  return (
    <View style={[styles.restaurantList, style]} testID={testID}>
      {restaurants.map((restaurant) => {
        const isSelected = selectedRestaurant?.id === restaurant.id;

        return (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            isSelected={isSelected}
            onPress={onRestaurantSelect}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  restaurantList: {
    gap: 16,
  },
});
