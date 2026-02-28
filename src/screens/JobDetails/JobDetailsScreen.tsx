import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../contexts/ThemeContext";
import { useJobs } from "../../contexts/JobsContext";
import { useToast } from "../../contexts/ToastContext";
import { JobsStackParamList } from "../../navigation/AppNavigator";
import { createStyles } from "./JobDetailsScreen.styles";

type Props = NativeStackScreenProps<JobsStackParamList, "JobDetails">;

const JobDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { job } = route.params;
  const fromSavedJobs = route.params.fromSavedJobs === true;
  const { colors } = useTheme();
  const { saveJob, removeJob, isJobSaved } = useJobs();
  const { showToast } = useToast();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const saved = isJobSaved(job.guid);

  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return null;
    const fmt = (n: number) => n.toLocaleString();
    if (min && max) return `${currency} ${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${currency} ${fmt(min)}`;
    return `Up to ${currency} ${fmt(max)}`;
  };

  const salary = formatSalary(job.minSalary, job.maxSalary, job.currency);
  const location = job.locations?.length > 0 ? job.locations.join(", ") : null;

  const handleSave = () => {
    if (saved) {
      removeJob(job.guid);
      showToast({ message: "Job removed from saved", type: "info" });
    } else {
      saveJob(job);
      showToast({ message: "Job saved successfully", type: "success" });
    }
  };

  const handleApply = () => {
    navigation.navigate("ApplicationForm", { job, fromSavedJobs });
  };

  const stripHtml = (html: string) => {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<li>/gi, "  \u2022 ")
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  const parsedDescription = job.description ? stripHtml(job.description) : "";

  const splitDescriptionAndRequirements = (content: string) => {
    if (!content) {
      return {
        description: "No detailed description provided.",
        requirements: [] as string[],
      };
    }

    const marker = content.match(/(?:^|\n)(requirements?|qualifications?)[:\n]/i);

    let descriptionSection = content;
    let requirementsSection = "";

    if (marker && marker.index !== undefined) {
      descriptionSection = content.slice(0, marker.index).trim();
      requirementsSection = content
        .slice(marker.index)
        .replace(/^(\s)*(requirements?|qualifications?)[:\s]*/i, "")
        .trim();
    }

    descriptionSection = descriptionSection.replace(/^\s*description\s*[:\-]?\s*/i, "").trim();

    const parsedRequirements = requirementsSection
      .split(/\n|\u2022|-\s+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 2);

    return {
      description: descriptionSection || "No detailed description provided.",
      requirements: parsedRequirements,
    };
  };

  const { description, requirements } = splitDescriptionAndRequirements(parsedDescription);
  const requirementItems = requirements.length > 0 ? requirements : job.tags;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.logoWrapper}>
            {job.companyLogo ? (
              <Image
                source={{ uri: job.companyLogo }}
                style={styles.logoLarge}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.logoFallbackLarge}>
                <Text style={styles.logoFallbackText}>
                  {job.companyName?.charAt(0)?.toUpperCase() || "?"}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.companyName}</Text>

          <View style={styles.heroMeta}>
            {location ? (
              <View style={styles.heroMetaItem}>
                <Ionicons name="location" size={16} color={colors.primary} />
                <Text style={styles.heroMetaText}>{location}</Text>
              </View>
            ) : null}
            {job.mainCategory ? (
              <View style={styles.heroMetaItem}>
                <Ionicons name="briefcase" size={16} color={colors.primary} />
                <Text style={styles.heroMetaText}>{job.mainCategory}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Overview</Text>
          <View style={styles.detailsGrid}>
            {salary ? (
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="cash" size={24} color={colors.primary} />
                </View>
                <Text style={styles.detailLabel}>Salary</Text>
                <Text style={styles.salaryValue}>{salary}</Text>
              </View>
            ) : null}
            {job.jobType ? (
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="time" size={24} color={colors.primary} />
                </View>
                <Text style={styles.detailLabel}>Job Type</Text>
                <Text style={styles.detailValue}>{job.jobType}</Text>
              </View>
            ) : null}
            {job.workModel ? (
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="laptop" size={24} color={colors.primary} />
                </View>
                <Text style={styles.detailLabel}>Work Model</Text>
                <Text style={styles.detailValue}>{job.workModel}</Text>
              </View>
            ) : null}
            {job.seniorityLevel ? (
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="trophy" size={24} color={colors.primary} />
                </View>
                <Text style={styles.detailLabel}>Seniority</Text>
                <Text style={styles.detailValue}>{job.seniorityLevel}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {job.tags?.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Requirements</Text>
            <View style={styles.tagsContainer}>
              {job.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Role</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.requirementsTitle}>Description</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          <View style={styles.descriptionContainerSecondary}>
            <Text style={styles.requirementsTitle}>Requirements</Text>
            {requirementItems.length > 0 ? (
              requirementItems.map((item, index) => (
                <View key={`${item}-${index}`} style={styles.requirementRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  <Text style={styles.requirementText}>{item}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.descriptionText}>No explicit requirements listed.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveButton, saved && styles.saveButtonSaved]}
          onPress={handleSave}
          activeOpacity={0.7}>
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={20}
            color={saved ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.saveButtonText, saved && styles.saveButtonTextSaved]}>
            {saved ? "Saved" : "Save"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          activeOpacity={0.8}>
          <Text style={styles.applyButtonText}>Apply for this job</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobDetailsScreen;