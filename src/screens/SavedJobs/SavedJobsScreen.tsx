import React, { useMemo, useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager, RefreshControl, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useJobs } from "../../contexts/JobsContext";
import { useToast } from "../../contexts/ToastContext";
import { SavedStackParamList } from "../../navigation/AppNavigator";
import EmptyState from "../../components/EmptyState";
import { Job } from "../../types/job";
import { createStyles } from "./SavedJobsScreen.styles";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<SavedStackParamList, "SavedJobs">;

const SavedJobsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { savedJobs, removeJob, removeAllJobs, loadSavedJobs } = useJobs();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets.top), [colors, insets.top]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleJobPress = useCallback(
    (job: Job) => {
      navigation.navigate("JobDetails", { job, fromSavedJobs: true });
    },
    [navigation],
  );

  const handleApply = useCallback(
    (job: Job) => {
      navigation.navigate("ApplicationForm", { job, fromSavedJobs: true });
    },
    [navigation],
  );

  const handleRemove = useCallback(
    (guid: string) => {
      Alert.alert(
        "Remove Job",
        "Are you sure you want to remove this saved job?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              removeJob(guid);
              showToast({ message: "Job removed from saved", type: "info" });
            },
          },
        ],
      );
    },
    [removeJob, showToast],
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

  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return null;
    const fmt = (n: number) => {
      if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
      return n.toString();
    };
    if (min && max) return `${currency} ${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${currency} ${fmt(min)}`;
    return `Up to ${currency} ${fmt(max)}`;
  };

  const renderItem = useCallback(
    ({ item }: { item: Job }) => {
      const salary = formatSalary(item.minSalary, item.maxSalary, item.currency);
      return (
        <TouchableOpacity
          style={styles.savedCard}
          onPress={() => handleJobPress(item)}
          activeOpacity={0.7}>
          <View style={styles.cardContent}>
            <View style={styles.header}>
              {item.companyLogo ? (
                <View style={styles.logoContainer}>
                  <Image
                    source={{ uri: item.companyLogo }}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View style={styles.logoFallback}>
                  <Text style={styles.logoFallbackText}>
                    {item.companyName?.charAt(0)?.toUpperCase() || "?"}
                  </Text>
                </View>
              )}
              <View style={styles.headerInfo}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.company} numberOfLines={1}>
                  {item.companyName}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(item.guid)}
                activeOpacity={0.6}>
                <Ionicons name="trash" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>

            <View style={styles.metaRow}>
              {item.jobType ? (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{item.jobType}</Text>
                </View>
              ) : null}
              {item.workModel ? (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{item.workModel}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => handleApply(item)}
                  activeOpacity={0.6}>
                  <Text style={styles.applyText}>Apply Now</Text>
                </TouchableOpacity>
              </View>
              {salary ? (
                <View style={styles.salaryContainer}>
                  <Text style={styles.salary}>{salary}</Text>
                  <Text style={styles.salaryPeriod}>/month</Text>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [styles, colors, handleJobPress, handleApply, handleRemove],
  );

  const keyExtractor = useCallback((item: Job) => item.id, []);

  const renderHeader = () => (
    <>
      <View style={{ position: 'absolute', top: -1000, left: 0, right: 0, height: 1000, backgroundColor: colors.primary }} />
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Saved Jobs</Text>
            <Text style={styles.headerSubtitle}>
              {savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved
            </Text>
          </View>
          {savedJobs.length > 0 ? (
            <TouchableOpacity
              style={styles.deleteAllButton}
              onPress={handleDeleteAll}
              activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </>
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
            tintColor="#FFFFFF"
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SavedJobsScreen;