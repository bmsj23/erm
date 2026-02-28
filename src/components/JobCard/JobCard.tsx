import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useJobs } from "../../contexts/JobsContext";
import { useToast } from "../../contexts/ToastContext";
import { Job } from "../../types/job";
import { createStyles } from "./JobCard.styles";

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onApply: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress, onApply }) => {
  const { colors } = useTheme();
  const { saveJob, removeJob, isJobSaved } = useJobs();
  const { showToast } = useToast();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const saved = isJobSaved(job.guid);

  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return "Salary not disclosed";
    const fmt = (n: number) => {
      if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
      return n.toString();
    };
    if (min && max) return `${currency} ${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${currency} ${fmt(min)}`;
    return `Up to ${currency} ${fmt(max)}`;
  };

  const salary = formatSalary(job.minSalary, job.maxSalary, job.currency);
  const hasSalaryRange = Boolean(job.minSalary || job.maxSalary);
  const location = job.locations?.length > 0 ? job.locations.join(", ") : null;

  const getDescriptionPreview = (html: string) => {
    if (!html) return null;
    const plainText = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]*>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
      .replace(/^\s*description\s*[:\-]?\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!plainText) return null;

    const sentenceParts = plainText
      .split(/(?<=[.!?])\s+/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (sentenceParts.length === 0) return null;

    return sentenceParts.slice(0, 2).join(" ");
  };

  const descriptionPreview = getDescriptionPreview(job.description);

  const handleSave = () => {
    if (saved) {
      removeJob(job.guid);
      showToast({ message: "Job removed from saved", type: "info" });
    } else {
      saveJob(job);
      showToast({ message: "Job saved successfully", type: "success" });
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          {job.companyLogo ? (
            <Image
              source={{ uri: job.companyLogo }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.logoFallback}>
              <Text style={styles.logoFallbackText}>
                {job.companyName?.charAt(0)?.toUpperCase() || "?"}
              </Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {job.title}
            </Text>
            <Text style={styles.company} numberOfLines={1}>
              {job.companyName}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={handleSave}
            activeOpacity={0.6}>
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={22}
              color={saved ? colors.primary : colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        {location ? (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
          </View>
        ) : null}

        {descriptionPreview ? (
          <Text style={styles.descriptionPreview} numberOfLines={4}>
            {descriptionPreview}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          {job.jobType ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{job.jobType}</Text>
            </View>
          ) : null}
          {job.workModel ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{job.workModel}</Text>
            </View>
          ) : null}
          {job.seniorityLevel ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{job.seniorityLevel}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={onApply}
              activeOpacity={0.6}>
              <Text style={styles.applyText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
          {salary ? (
            <View style={styles.salaryContainer}>
              <Text style={styles.salary}>{salary}</Text>
              {hasSalaryRange ? <Text style={styles.salaryPeriod}>/month</Text> : null}
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default JobCard;