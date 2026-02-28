import React, { useMemo, useCallback, useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useScrollToTop } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useJobs } from "../../contexts/JobsContext";
import { useTheme } from "../../contexts/ThemeContext";
import { JobsStackParamList } from "../../navigation/AppNavigator";
import SkeletonLoading from "../../components/SkeletonLoading";
import EmptyState from "../../components/EmptyState";
import ThemeToggle from "../../components/ThemeToggle";
import { Job } from "../../types/job";
import {
  createStyles,
  getPalette,
} from "./JobFinderScreen.styles";
import JobCard from "../../components/JobCard/JobCard";

type Props = NativeStackScreenProps<JobsStackParamList, "Find">;

type FilterKey = "all" | "remote" | "hybrid" | "onsite";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Jobs" },
  { key: "remote", label: "Remote" },
  { key: "hybrid", label: "Hybrid" },
  { key: "onsite", label: "On-Site" },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  return "Good evening.";
};

const JobFinderScreen: React.FC<Props> = ({ navigation }) => {
  const { jobs, isLoading, error, refreshJobs } = useJobs();
  const { isDarkMode } = useTheme();
  const p = getPalette(isDarkMode);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(insets.top, p), [insets.top, p]);
  const listRef = useRef<FlatList<Job>>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  useScrollToTop(listRef);

  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return;
    const unsubscribe = (parent as any).addListener("tabPress", (event: any) => {
      const target = parent.getState().routes.find(
        (r: any) => r.key === event.target,
      );
      if (target?.name === "JobsTab") {
        requestAnimationFrame(() => {
          listRef.current?.scrollToOffset({ offset: 0, animated: true });
        });
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleJobPress = useCallback(
    (job: Job) => navigation.navigate("JobDetails", { job, fromSavedJobs: false }),
    [navigation],
  );

  const handleSearch = useCallback(() => navigation.navigate("Search"), [navigation]);

  const normalizeWM = (v: string) => v.toLowerCase().replace(/[\s-]/g, "");

  const filteredJobs = useMemo(() => {
    switch (activeFilter) {
      case "remote":
        return jobs.filter((j) => normalizeWM(j.workModel || "").includes("remote"));
      case "hybrid":
        return jobs.filter((j) => normalizeWM(j.workModel || "").includes("hybrid"));
      case "onsite":
        return jobs.filter((j) => {
          const wm = normalizeWM(j.workModel || "");
          return wm.includes("onsite") || wm.includes("office");
        });
      default:
        return jobs;
    }
  }, [jobs, activeFilter]);

  const keyExtractor = useCallback((item: Job) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Job }) => (
      <JobCard job={item} onPress={() => handleJobPress(item)} />
    ),
    [handleJobPress],
  );

  // sticky header rendered above the FlatList
  const StickyHeader = useMemo(
    () => (
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.headerTopRow}>
            <Text style={styles.brandLabel}>JobFinder</Text>
            <View style={styles.themeToggleWrap}>
              <ThemeToggle />
            </View>
          </View>
          <Text style={styles.greeting}>
            {getGreeting()}{"\n"}
            <Text style={styles.greetingAccent}>Find your next role.</Text>
          </Text>
        </View>

        {/* floating pill search bar */}
        <View style={styles.searchPill}>
          <TouchableOpacity
            style={styles.searchPillTouchArea}
            onPress={handleSearch}
            activeOpacity={0.95}>
            <Ionicons
              name="search-outline"
              size={17}
              color={p.cloudGray}
              style={styles.searchIcon}
            />
            <Text style={styles.searchPlaceholder}>Where to next in your career?</Text>
          </TouchableOpacity>
        </View>

        {/* filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterRowContent}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.pill, activeFilter === f.key && styles.pillActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.pillText,
                  activeFilter === f.key && styles.pillTextActive,
                ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeFilter, handleSearch, styles],
  );

  // section subheader inside the scrollable list
  const ListHeader = useCallback(
    () => (
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>
          {activeFilter === "all" ? "All Listings" : FILTERS.find((f) => f.key === activeFilter)?.label}
        </Text>
        <Text style={styles.sectionCount}>
          {filteredJobs.length} {filteredJobs.length === 1 ? "role" : "roles"}
        </Text>
      </View>
    ),
    [activeFilter, filteredJobs.length, styles],
  );

  if (isLoading && jobs.length === 0) {
    return (
      <View style={styles.container}>
        {StickyHeader}
        <SkeletonLoading />
      </View>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <View style={styles.container}>
        {StickyHeader}
        <View style={styles.errorContent}>
          <EmptyState
            icon="cloud-offline-outline"
            title="Something Went Wrong"
            message={error || "Failed to load jobs. Please check your connection."}
          />
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refreshJobs}
            activeOpacity={0.8}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {StickyHeader}
      <FlatList
        ref={listRef}
        data={filteredJobs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={100}
        windowSize={5}
        initialNumToRender={6}
        ListEmptyComponent={
          <EmptyState
            icon="briefcase-outline"
            title="No Roles Found"
            message="Try a different filter or pull down to refresh."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshJobs}
            tintColor={p.deepGreen}
            colors={[p.deepGreen]}
          />
        }
      />
    </View>
  );
};

export default JobFinderScreen;