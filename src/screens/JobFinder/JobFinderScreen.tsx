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
import { JobsStackParamList } from "../../navigation/AppNavigator";
import SkeletonLoading from "../../components/SkeletonLoading";
import EmptyState from "../../components/EmptyState";
import ThemeToggle from "../../components/ThemeToggle";
import { Job } from "../../types/job";
import {
  createStyles,
  PALETTE,
  getCardBgColor,
  formatSalary,
} from "./JobFinderScreen.styles";

type Props = NativeStackScreenProps<JobsStackParamList, "Find">;

// filter definitions — each has a key and display label
type FilterKey = "all" | "remote" | "hybrid" | "onsite" | "tech" | "executive" | "parttime";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Jobs" },
  { key: "remote", label: "Remote" },
  { key: "hybrid", label: "Hybrid" },
  { key: "onsite", label: "On-Site" },
  { key: "tech", label: "Tech" },
  { key: "executive", label: "Executive" },
  { key: "parttime", label: "Part-Time" },
];

// greeting based on time of day
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  return "Good evening.";
};

// individual airbnb-style card
interface AirbnbCardProps {
  job: Job;
  onPress: () => void;
  onSave: () => void;
  onApply: () => void;
  isSaved: boolean;
  styles: ReturnType<typeof createStyles>;
}

const AirbnbCard: React.FC<AirbnbCardProps> = React.memo(
  ({ job, onPress, onSave, styles, isSaved }) => {
    const [imgError, setImgError] = useState(false);
    const heroBg = getCardBgColor(job.companyName || job.id);
    const salary = formatSalary(job.minSalary, job.maxSalary, job.currency || "USD");
    const location = job.locations?.[0] ?? "—";
    const workLabel = job.workModel || "";
    const visibleTags = (job.tags ?? []).slice(0, 2);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.97}
        onPress={onPress}>
        {/* hero section */}
        <View style={[styles.cardHero, { backgroundColor: heroBg }]}>
          <View style={styles.cardLogoBox}>
            {job.companyLogo && !imgError ? (
              <Image
                source={{ uri: job.companyLogo }}
                style={styles.cardLogo}
                onError={() => setImgError(true)}
              />
            ) : (
              <Text style={styles.cardLogoFallbackText}>
                {(job.companyName ?? "?").charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          {!!workLabel && (
            <View style={styles.cardWorkBadge}>
              <Text style={styles.cardWorkBadgeText}>{workLabel}</Text>
            </View>
          )}

          {/* bookmark / heart */}
          <TouchableOpacity
            style={styles.cardBookmark}
            onPress={onSave}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.85}>
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={18}
              color={isSaved ? "#EF4444" : PALETTE.slate}
            />
          </TouchableOpacity>
        </View>

        {/* card body */}
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {job.title}
          </Text>

          <View style={styles.cardMetaRow}>
            <Text style={styles.cardCompany} numberOfLines={1}>
              {job.companyName}
            </Text>
            <Text style={styles.cardMetaDivider}>·</Text>
            <Text style={styles.cardLocation} numberOfLines={1}>
              {location}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.cardTagsRow}>
              {visibleTags.map((tag, i) => (
                <View key={i} style={styles.cardTag}>
                  <Text style={styles.cardTagText} numberOfLines={1}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.cardSalaryWrap}>
              <Text style={styles.cardSalary}>{salary}</Text>
              <Text style={styles.cardSalaryUnit}>/ year</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const JobFinderScreen: React.FC<Props> = ({ navigation }) => {
  const { jobs, isLoading, error, refreshJobs, isJobSaved, saveJob, removeJob } = useJobs();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(insets.top), [insets.top]);
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

  const handleApply = useCallback(
    (job: Job) => navigation.navigate("ApplicationForm", { job, fromSavedJobs: false }),
    [navigation],
  );

  const handleSearch = useCallback(() => navigation.navigate("Search"), [navigation]);

  const handleSaveToggle = useCallback(
    (job: Job) => {
      isJobSaved(job.id) ? removeJob(job.id) : saveJob(job);
    },
    [isJobSaved, saveJob, removeJob],
  );

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
      case "tech":
        return jobs.filter((j) =>
          (j.mainCategory || "").toLowerCase().includes("tech") ||
          (j.mainCategory || "").toLowerCase().includes("engineer") ||
          (j.mainCategory || "").toLowerCase().includes("develop") ||
          (j.tags ?? []).some((t) => t.toLowerCase().includes("tech")),
        );
      case "executive":
        return jobs.filter((j) =>
          (j.seniorityLevel || "").toLowerCase().includes("exec") ||
          (j.seniorityLevel || "").toLowerCase().includes("director") ||
          (j.seniorityLevel || "").toLowerCase().includes("senior"),
        );
      case "parttime":
        return jobs.filter((j) =>
          (j.jobType || "").toLowerCase().includes("part"),
        );
      default:
        return jobs;
    }
  }, [jobs, activeFilter]);

  const keyExtractor = useCallback((item: Job) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Job }) => (
      <AirbnbCard
        job={item}
        onPress={() => handleJobPress(item)}
        onSave={() => handleSaveToggle(item)}
        onApply={() => handleApply(item)}
        isSaved={isJobSaved(item.id)}
        styles={styles}
      />
    ),
    [handleJobPress, handleSaveToggle, handleApply, isJobSaved, styles],
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
        <TouchableOpacity
          style={styles.searchPill}
          onPress={handleSearch}
          activeOpacity={0.95}>
          <Ionicons
            name="search-outline"
            size={17}
            color={PALETTE.cloudGray}
            style={styles.searchIcon}
          />
          <Text style={styles.searchPlaceholder}>Where to next in your career?</Text>
          <View style={styles.searchFilterDot}>
            <Ionicons name="options-outline" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

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
            tintColor={PALETTE.deepGreen}
            colors={[PALETTE.deepGreen]}
          />
        }
      />
    </View>
  );
};

export default JobFinderScreen;