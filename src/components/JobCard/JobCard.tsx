import React, { useMemo, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useJobs } from "../../contexts/JobsContext";
import { useToast } from "../../contexts/ToastContext";
import { Job } from "../../types/job";
import { getPalette, formatSalary } from "../../screens/JobFinder/JobFinderScreen.styles";
import { createCardStyles } from "./JobCard.styles";

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onDelete?: () => void;
}

const JobCard: React.FC<JobCardProps> = React.memo(
  ({ job, onPress, onDelete }) => {
    const { isDarkMode } = useTheme();
    const { saveJob, removeJob, isJobSaved } = useJobs();
    const { showToast } = useToast();
    const p = getPalette(isDarkMode);
    const styles = useMemo(() => createCardStyles(p, isDarkMode), [p, isDarkMode]);
    const [imgError, setImgError] = useState(false);

    const saved = isJobSaved(job.guid);
    const location = job.locations?.[0] ?? "";
    const visibleTags = (job.tags ?? []).slice(0, 3);
    const salary = formatSalary(job.minSalary, job.maxSalary, job.currency || "USD");
    const hasSalary = job.minSalary > 0 || job.maxSalary > 0;

    const metaParts: string[] = [];
    if (job.companyName) metaParts.push(job.companyName);
    if (location) metaParts.push(location);

    const handleToggleSave = useCallback(() => {
      if (saved) {
        removeJob(job.guid);
        showToast({ message: "Job removed from saved jobs", type: "info" });
      } else {
        saveJob(job);
        showToast({ message: "Job saved", type: "success" });
      }
    }, [saved, job, removeJob, saveJob, showToast]);

    const confirmDelete = useCallback(() => {
      Alert.alert(
        "Remove Job",
        `Remove "${job.title}" from saved jobs?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Remove", style: "destructive", onPress: onDelete },
        ],
      );
    }, [job.title, onDelete]);

    return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.96}>
        {/* bookmark / delete icon positioned relative to full card */}
        {onDelete ? (
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={confirmDelete}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={handleToggleSave}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={20}
              color={saved ? p.deepGreen : p.cloudGray}
            />
          </TouchableOpacity>
        )}

        <View style={styles.topSection}>
          <View style={styles.topLeft}>
            <View style={styles.logoWrap}>
              {job.companyLogo && !imgError ? (
                <Image
                  source={{ uri: job.companyLogo }}
                  style={styles.logo}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Text style={styles.logoFallback}>
                  {(job.companyName ?? "?").charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <Text style={styles.companyName} numberOfLines={2}>
              {job.companyName}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          {job.workModel ? (
            <View style={styles.workModelChip}>
              <Text style={styles.workModelText}>{job.workModel}</Text>
            </View>
          ) : null}
          <Text style={styles.jobTitle} numberOfLines={2}>
            {job.title}
          </Text>
          {metaParts.length > 0 ? (
            <Text style={styles.metaText} numberOfLines={1}>
              {metaParts.join("  \u00b7  ")}
            </Text>
          ) : null}

          <View style={styles.footerRow}>
            {visibleTags.length > 0 ? (
              <View style={styles.tagsRow}>
                {visibleTags.map((tag, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            ) : <View />}
            {hasSalary ? (
              <View style={styles.salaryColumn}>
                <Text style={styles.salaryText}>{salary}</Text>
                <Text style={styles.salaryInterval}>/ year</Text>
              </View>
            ) : (
              <Text style={styles.salaryUndisclosed}>Salary undisclosed</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

export default JobCard;