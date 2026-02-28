import React, { useMemo, useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, LayoutAnimation, Platform, UIManager, RefreshControl, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useJobs } from "../../contexts/JobsContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { SavedStackParamList } from "../../navigation/AppNavigator";
import EmptyState from "../../components/EmptyState";
import JobCard from "../../components/JobCard/JobCard";
import { Job } from "../../types/job";
import { createStyles } from "./SavedJobsScreen.styles";
import { getPalette } from "../JobFinder/JobFinderScreen.styles";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<SavedStackParamList, "SavedJobs">;

const SavedJobsScreen: React.FC<Props> = ({ navigation }) => {
  const { savedJobs, removeJob, removeAllJobs, loadSavedJobs } = useJobs();
  const { isDarkMode } = useTheme();
  const p = getPalette(isDarkMode);
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(insets.top, p), [insets.top, p]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleJobPress = useCallback(
    (job: Job) => {
      navigation.navigate("JobDetails", { job, fromSavedJobs: true });
    },
    [navigation],
  );

  const handleDeleteAll = useCallback(() => {
    Alert.alert(
      "Delete All Saved Jobs",
      "Are you sure you want to remove all saved jobs? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            removeAllJobs();
            showToast({ message: "All saved jobs removed", type: "info" });
          },
        },
      ],
    );
  }, [removeAllJobs, showToast]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadSavedJobs();
    setIsRefreshing(false);
  }, [loadSavedJobs]);

  const handleRemove = useCallback(
    (job: Job) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      removeJob(job.guid);
      showToast({ message: "Job removed", type: "info" });
    },
    [removeJob, showToast],
  );

  const renderItem = useCallback(
    ({ item }: { item: Job }) => (
      <JobCard
        job={item}
        onPress={() => handleJobPress(item)}
        onDelete={() => handleRemove(item)}
      />
    ),
    [handleJobPress, handleRemove],
  );

  const keyExtractor = useCallback((item: Job) => item.id, []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>
          Saved <Text style={styles.headerTitleAccent}>Jobs</Text>
        </Text>
        {savedJobs.length >= 2 ? (
          <TouchableOpacity
            style={styles.deleteAllButton}
            onPress={handleDeleteAll}
            activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={14} color="#EF4444" />
            <Text style={styles.deleteAllText}>Delete All</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.headerSubtitle}>
        {savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={savedJobs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.listContent,
          savedJobs.length === 0 && { flex: 1 },
        ]}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={100}
        windowSize={5}
        initialNumToRender={6}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title="No Saved Jobs"
            message="Jobs you save will appear here. Start browsing and save jobs you're interested in."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={p.deepGreen}
            colors={[p.deepGreen]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SavedJobsScreen;