import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { JobsStackParamList } from "../../navigation/AppNavigator";
import { createStyles } from "./ApplicationFormScreen.styles";

type Props = NativeStackScreenProps<JobsStackParamList, "ApplicationForm">;

interface FormData {
  name: string;
  email: string;
  contactNumber: string;
  whyHireYou: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  contactNumber?: string;
  whyHireYou?: string;
}

interface FieldTouched {
  name: boolean;
  email: boolean;
  contactNumber: boolean;
  whyHireYou: boolean;
}

const ApplicationFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { job } = route.params;
  const fromSavedJobs = route.params.fromSavedJobs === true;
  const { colors } = useTheme();
  const { showToast } = useToast();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    contactNumber: "",
    whyHireYou: "",
  });

  const [touched, setTouched] = useState<FieldTouched>({
    name: false,
    email: false,
    contactNumber: false,
    whyHireYou: false,
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = useCallback((data: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!data.name.trim()) {
      errors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(data.name.trim())) {
      errors.name = "Name must contain only letters and spaces";
    }

    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!data.contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    } else if (!/^09\d{9}$/.test(data.contactNumber.trim())) {
      errors.contactNumber = "Must start with 09 and be exactly 11 digits";
    }

    if (!data.whyHireYou.trim()) {
      errors.whyHireYou = "This field is required";
    } 

    return errors;
  }, []);

  const errors = useMemo(() => validate(formData), [formData, validate]);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field: keyof FieldTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFocusedField(null);
  }, []);

  const handleFocus = useCallback((field: string) => {
    setFocusedField(field);
  }, []);

  const handleSubmit = useCallback(async () => {
    Keyboard.dismiss();

    setTouched({
      name: true,
      email: true,
      contactNumber: true,
      whyHireYou: true,
    });

    if (!isValid) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setFormData({ name: "", email: "", contactNumber: "", whyHireYou: "" });
    setTouched({
      name: false,
      email: false,
      contactNumber: false,
      whyHireYou: false,
    });
    setShowSuccess(true);
    showToast({
      message: "Application submitted successfully",
      type: "success",
    });
  }, [isValid, showToast]);

  const handleSuccessDismiss = useCallback(() => {
    setShowSuccess(false);

    // pop the native modal and all intermediate screens back to root
    navigation.popToTop();

    if (fromSavedJobs) {
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate("JobsTab" as never);
      }
    }
  }, [fromSavedJobs, navigation]);

  const getInputStyle = (field: keyof FormData) => [
    styles.input,
    focusedField === field && styles.inputFocused,
    touched[field] && errors[field] && styles.inputError,
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Apply for this role</Text>
          <Text style={styles.headerSubtitle}>Please fill out the form below to submit your application.</Text>
        </View>

        <View style={styles.jobInfo}>
          <View style={styles.jobLogoContainer}>
            {job.companyLogo ? (
              <Image
                source={{ uri: job.companyLogo }}
                style={styles.jobLogo}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
            ) : (
              <View style={styles.jobLogoFallback}>
                <Text style={styles.jobLogoText}>
                  {job.companyName?.charAt(0)?.toUpperCase() || "?"}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.jobInfoContent}>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {job.title}
            </Text>
            <Text style={styles.jobCompany} numberOfLines={1}>
              {job.companyName}
            </Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={getInputStyle("name")}
              placeholder="e.g. Jane Doe"
              placeholderTextColor={colors.textTertiary}
              value={formData.name}
              onChangeText={(v) => handleChange("name", v)}
              onBlur={() => handleBlur("name")}
              onFocus={() => handleFocus("name")}
              autoCapitalize="words"
            />
            {touched.name && errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Email Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={getInputStyle("email")}
              placeholder="e.g. jane@example.com"
              placeholderTextColor={colors.textTertiary}
              value={formData.email}
              onChangeText={(v) => handleChange("email", v)}
              onBlur={() => handleBlur("email")}
              onFocus={() => handleFocus("email")}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {touched.email && errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Contact Number <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={getInputStyle("contactNumber")}
              placeholder="09XXXXXXXXX"
              placeholderTextColor={colors.textTertiary}
              value={formData.contactNumber}
              onChangeText={(v) => handleChange("contactNumber", v)}
              onBlur={() => handleBlur("contactNumber")}
              onFocus={() => handleFocus("contactNumber")}
              keyboardType="phone-pad"
              maxLength={11}
            />
            {touched.contactNumber && errors.contactNumber ? (
              <Text style={styles.errorText}>{errors.contactNumber}</Text>
            ) : null}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Why should we hire you? <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[...getInputStyle("whyHireYou"), styles.textArea]}
              placeholder="Tell us about your relevant experience and why you're a great fit for this role..."
              placeholderTextColor={colors.textTertiary}
              value={formData.whyHireYou}
              onChangeText={(v) => handleChange("whyHireYou", v)}
              onBlur={() => handleBlur("whyHireYou")}
              onFocus={() => handleFocus("whyHireYou")}
              multiline
              numberOfLines={6}
            />
            <View style={styles.charCountContainer}>
              <Text
                style={[
                  styles.charCount,
                  formData.whyHireYou.trim().length < 50 &&
                    touched.whyHireYou &&
                    styles.charCountError,
                ]}>
                {formData.whyHireYou.trim().length}/50 characters minimum
              </Text>
            </View>
            {touched.whyHireYou && errors.whyHireYou ? (
              <Text style={styles.errorText}>{errors.whyHireYou}</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isValid || isSubmitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isSubmitting}>
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        statusBarTranslucent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.modalTitle}>Application Sent!</Text>
            <Text style={styles.modalMessage}>
              Your application for <Text style={styles.boldText}>{job.title}</Text> at <Text style={styles.boldText}>{job.companyName}</Text> has been submitted successfully.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSuccessDismiss}
              activeOpacity={0.8}>
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ApplicationFormScreen;