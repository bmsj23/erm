import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Modal,
  LayoutChangeEvent,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import {
  RootTabParamList,
  SharedApplicationFormScreenProps,
} from "../../navigation/props";
import { createStyles } from "./ApplicationFormScreen.styles";

type Props = SharedApplicationFormScreenProps;

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

type FieldKey = keyof FormData;

const sanitizeName = (value: string): string =>
  value.replace(/\s{2,}/g, " ").replace(/^[\s]+/, "");

const sanitizeEmail = (value: string): string =>
  value.replace(/\s+/g, "").toLowerCase();

const sanitizeContactNumber = (value: string): string =>
  value.replace(/\D/g, "").slice(0, 11);

const normalizeEssay = (value: string): string =>
  value.replace(/\s{2,}/g, " ").trim();

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
  const whyHireLength = normalizeEssay(formData.whyHireYou).length;
  const scrollViewRef = useRef<ScrollView>(null);
  const fieldPositions = useRef<Record<FieldKey, number>>({
    name: 0,
    email: 0,
    contactNumber: 0,
    whyHireYou: 0,
  });
  const currentScrollY = useRef(0);

  const validate = useCallback((data: FormData): FormErrors => {
    const errors: FormErrors = {};
    const normalizedName = sanitizeName(data.name).trim();
    const normalizedEmail = sanitizeEmail(data.email);
    const normalizedContactNumber = sanitizeContactNumber(data.contactNumber);
    const normalizedWhyHireYou = normalizeEssay(data.whyHireYou);

    if (!normalizedName) {
      errors.name = "Name is required";
    } else if (normalizedName.length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (normalizedName.length > 80) {
      errors.name = "Name must not exceed 80 characters";
    } else if (!/^[A-Za-z][A-Za-z\s'.-]*$/.test(normalizedName)) {
      errors.name = "Name contains invalid characters";
    }

    if (!normalizedEmail) {
      errors.email = "Email is required";
    } else if (normalizedEmail.length > 254) {
      errors.email = "Email must not exceed 254 characters";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      errors.email = "Please enter a valid email address";
    }

    if (!normalizedContactNumber) {
      errors.contactNumber = "Contact number is required";
    } else if (!/^09\d{9}$/.test(normalizedContactNumber)) {
      errors.contactNumber = "Must start with 09 and be exactly 11 digits";
    }

    if (!normalizedWhyHireYou) {
      errors.whyHireYou = "This field is required";
    } else if (normalizedWhyHireYou.length < 50) {
      errors.whyHireYou = "Please provide at least 50 characters";
    } else if (normalizedWhyHireYou.length > 1000) {
      errors.whyHireYou = "Response must not exceed 1000 characters";
    }

    return errors;
  }, []);

  const errors = useMemo(() => validate(formData), [formData, validate]);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => {
      switch (field) {
        case "name":
          return { ...prev, name: sanitizeName(value) };
        case "email":
          return { ...prev, email: sanitizeEmail(value) };
        case "contactNumber":
          return { ...prev, contactNumber: sanitizeContactNumber(value) };
        case "whyHireYou":
          return { ...prev, whyHireYou: value };
        default:
          return prev;
      }
    });
  }, []);

  const handleBlur = useCallback((field: keyof FieldTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFocusedField(null);
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    currentScrollY.current = event.nativeEvent.contentOffset.y;
  }, []);

  const handleFieldLayout = useCallback(
    (field: FieldKey, event: LayoutChangeEvent) => {
      fieldPositions.current[field] = event.nativeEvent.layout.y;
    },
    [],
  );

  const handleFocus = useCallback((field: FieldKey) => {
    setFocusedField(field);
    const targetY = Math.max(fieldPositions.current[field] - 24, 0);

    if (targetY === currentScrollY.current) {
      return;
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: targetY,
        animated: true,
      });
    }, 180);
  }, []);

  const handleSubmit = useCallback(async () => {
    Keyboard.dismiss();

    const sanitizedData: FormData = {
      name: sanitizeName(formData.name).trim(),
      email: sanitizeEmail(formData.email),
      contactNumber: sanitizeContactNumber(formData.contactNumber),
      whyHireYou: normalizeEssay(formData.whyHireYou),
    };

    setTouched({
      name: true,
      email: true,
      contactNumber: true,
      whyHireYou: true,
    });

    setFormData(sanitizedData);

    if (Object.keys(validate(sanitizedData)).length > 0) return;

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
  }, [formData, showToast, validate]);

  const handleSuccessDismiss = useCallback(() => {
    setShowSuccess(false);
    const parentNavigation = navigation.getParent<
      BottomTabNavigationProp<RootTabParamList>
    >();

    setTimeout(() => {
      if (fromSavedJobs) {
        parentNavigation?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "JobsTab",
                state: {
                  routes: [{ name: "Find" }],
                },
              },
              {
                name: "SavedTab",
                state: {
                  routes: [{ name: "SavedJobs" }],
                },
              },
            ],
          }),
        );
        return;
      }

      navigation.popToTop();
    }, 220);
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
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}>

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
          <View
            style={styles.fieldContainer}
            onLayout={(event) => handleFieldLayout("name", event)}>
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
              maxLength={80}
              textContentType="name"
            />
            {touched.name && errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>

          <View
            style={styles.fieldContainer}
            onLayout={(event) => handleFieldLayout("email", event)}>
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
              maxLength={254}
              textContentType="emailAddress"
            />
            {touched.email && errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          <View
            style={styles.fieldContainer}
            onLayout={(event) => handleFieldLayout("contactNumber", event)}>
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
              textContentType="telephoneNumber"
            />
            {touched.contactNumber && errors.contactNumber ? (
              <Text style={styles.errorText}>{errors.contactNumber}</Text>
            ) : null}
          </View>

          <View
            style={styles.fieldContainer}
            onLayout={(event) => handleFieldLayout("whyHireYou", event)}>
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
              maxLength={1000}
            />
            <View style={styles.helperTextRow}>
              {touched.whyHireYou && errors.whyHireYou ? (
                <Text style={styles.errorTextInline}>{errors.whyHireYou}</Text>
              ) : (
                <View style={styles.helperTextSpacer} />
              )}
              <Text
                style={[
                  styles.charCount,
                  whyHireLength < 50 &&
                    touched.whyHireYou &&
                    styles.charCountError,
                ]}>
                {whyHireLength}/50 characters minimum
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isValid || isSubmitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={!isValid || isSubmitting}>
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