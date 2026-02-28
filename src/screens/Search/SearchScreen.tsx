import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../contexts/ThemeContext";
import { useJobs } from "../../contexts/JobsContext";
import { JobsStackParamList } from "../../navigation/AppNavigator";
import JobCard from "../../components/JobCard/JobCard";
import EmptyState from "../../components/EmptyState";
import { Job } from "../../types/job";
import { createStyles } from "./SearchScreen.styles";

type Props = NativeStackScreenProps<JobsStackParamList, "Search">;

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { jobs } = useJobs();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const filteredJobs = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase().trim();
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.companyName.toLowerCase().includes(q) ||
        job.mainCategory.toLowerCase().includes(q) ||
        job.locations.some((loc) => loc.toLowerCase().includes(q)) ||
        job.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [jobs, debouncedQuery]);

  const handleJobPress = useCallback(
    (job: Job) => {
      navigation.navigate("JobDetails", { job, fromSavedJobs: false });
    },
    [navigation],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Job }) => (
      <JobCard job={item} onPress={() => handleJobPress(item)} />
    ),
    [handleJobPress],
  );

  const keyExtractor = useCallback((item: Job) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textTertiary} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search jobs, companies, locations..."
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            activeOpacity={0.6}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {debouncedQuery.trim().length > 0 && (
        <View style={styles.resultInfo}>
          <Text style={styles.resultText}>
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "result" : "results"} found
          </Text>
        </View>
      )}

      <FlatList
        data={filteredJobs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          filteredJobs.length === 0 && { flex: 1 },
        ]}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={100}
        windowSize={5}
        initialNumToRender={6}
        ListEmptyComponent={
          debouncedQuery.trim().length > 0 ? (
            <EmptyState
              icon="search-outline"
              title="No Results"
              message={`No jobs matching "${debouncedQuery}". Try a different search term.`}
            />
          ) : (
            <EmptyState
              icon="search-outline"
              title="Search Jobs"
              message="Type to search across job titles, companies, locations, and tags."
            />
          )
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default SearchScreen;