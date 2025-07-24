import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { Photographer } from '../../types';

interface PhotographerCardProps {
  photographer: Photographer;
  onPress: () => void;
}

export const PhotographerCard: React.FC<PhotographerCardProps> = ({
  photographer,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: photographer.avatar_url || 'https://via.placeholder.com/80' }}
        style={styles.avatar}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{photographer.full_name}</Text>
          {photographer.verified && (
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
          )}
        </View>
        
        <Text style={styles.location} numberOfLines={1}>
          {photographer.location || 'Location not specified'}
        </Text>
        
        {photographer.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {photographer.bio}
          </Text>
        )}
        
        <View style={styles.specialties}>
          {photographer.specialties?.slice(0, 3).map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={colors.primary} />
            <Text style={styles.ratingText}>
              {photographer.rating?.toFixed(1) || '5.0'}
            </Text>
            <Text style={styles.reviewCount}>
              ({photographer.total_bookings || 0} bookings)
            </Text>
          </View>
          
          <Text style={styles.price}>
            R{photographer.hourly_rate || 500}/hr
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.text,
    marginRight: 8,
  },
  location: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  bio: {
    fontSize: typography.sm,
    color: colors.text,
    lineHeight: typography.lineHeight.normal * typography.sm,
    marginBottom: 8,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  specialtyTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: typography.xs,
    color: colors.primary,
    fontWeight: typography.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: typography.sm,
    color: colors.text,
    marginLeft: 4,
    fontWeight: typography.medium,
  },
  reviewCount: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  price: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.primary,
  },
});