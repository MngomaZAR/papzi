import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '../../config/supabase';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { Photographer } from '../../types';
import { PhotographerCard } from '../../components/photographer/PhotographerCard';

interface SearchScreenProps {
  navigation: any;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [filteredPhotographers, setFilteredPhotographers] = useState<Photographer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    specialty: '',
    minRating: 0,
    maxPrice: 1000,
    location: '',
  });

  useEffect(() => {
    fetchPhotographers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, photographers]);

  const fetchPhotographers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'photographer')
        .eq('verified', true);

      if (error) throw error;
      setPhotographers(data || []);
    } catch (error) {
      console.error('Error fetching photographers:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = photographers;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(photographer =>
        photographer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photographer.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photographer.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Specialty filter
    if (filters.specialty) {
      filtered = filtered.filter(photographer =>
        photographer.specialties?.includes(filters.specialty)
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(photographer =>
        (photographer.rating || 0) >= filters.minRating
      );
    }

    // Price filter
    if (filters.maxPrice < 1000) {
      filtered = filtered.filter(photographer =>
        (photographer.hourly_rate || 0) <= filters.maxPrice
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(photographer =>
        photographer.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredPhotographers(filtered);
  };

  const renderPhotographer = ({ item }: { item: Photographer }) => (
    <PhotographerCard
      photographer={item}
      onPress={() => navigation.navigate('PhotographerProfile', { photographerId: item.id })}
    />
  );

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Specialty</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Portrait', 'Wedding', 'Event', 'Fashion', 'Nature', 'Commercial'].map(specialty => (
                <TouchableOpacity
                  key={specialty}
                  style={[
                    styles.specialtyChip,
                    filters.specialty === specialty && styles.specialtyChipActive
                  ]}
                  onPress={() => setFilters(prev => ({ 
                    ...prev, 
                    specialty: prev.specialty === specialty ? '' : specialty 
                  }))}
                >
                  <Text style={[
                    styles.specialtyChipText,
                    filters.specialty === specialty && styles.specialtyChipTextActive
                  ]}>
                    {specialty}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Minimum Rating</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map(rating => (
                <TouchableOpacity
                  key={rating}
                  style={styles.ratingButton}
                  onPress={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                >
                  <Ionicons
                    name="star"
                    size={24}
                    color={rating <= filters.minRating ? colors.primary : colors.border}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Location</Text>
            <TextInput
              style={styles.locationInput}
              value={filters.location}
              onChangeText={(text) => setFilters(prev => ({ ...prev, location: text }))}
              placeholder="Enter location"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setFilters({ specialty: '', minRating: 0, maxPrice: 1000, location: '' })}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search photographers..."
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => setShowMap(!showMap)}
        >
          <Ionicons name={showMap ? "list" : "map"} size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredPhotographers.length} photographer{filteredPhotographers.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Content */}
      {showMap ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -26.2041,
            longitude: 28.0473,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {filteredPhotographers.map(photographer => (
            <Marker
              key={photographer.id}
              coordinate={{
                latitude: -26.2041 + (Math.random() - 0.5) * 0.1,
                longitude: 28.0473 + (Math.random() - 0.5) * 0.1,
              }}
              title={photographer.full_name}
              description={photographer.bio}
              onCalloutPress={() => navigation.navigate('PhotographerProfile', { photographerId: photographer.id })}
            />
          ))}
        </MapView>
      ) : (
        <FlatList
          data={filteredPhotographers}
          renderItem={renderPhotographer}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchPhotographers}
        />
      )}

      <FilterModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: typography.base,
    color: colors.text,
  },
  filterButton: {
    padding: 8,
    marginRight: 8,
  },
  mapButton: {
    padding: 8,
  },
  resultsHeader: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsCount: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  listContainer: {
    padding: 16,
  },
  map: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: 12,
  },
  specialtyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.gray,
    borderRadius: 20,
    marginRight: 8,
  },
  specialtyChipActive: {
    backgroundColor: colors.primary,
  },
  specialtyChipText: {
    fontSize: typography.sm,
    color: colors.text,
  },
  specialtyChipTextActive: {
    color: colors.white,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  ratingButton: {
    marginRight: 8,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: typography.base,
    color: colors.text,
    backgroundColor: colors.white,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  clearButtonText: {
    fontSize: typography.base,
    color: colors.text,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginLeft: 8,
  },
  applyButtonText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.white,
  },
});