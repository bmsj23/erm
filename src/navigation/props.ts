import { NavigatorScreenParams } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Job } from "../types/job";

export type JobRouteParams = {
  job: Job;
  fromSavedJobs?: boolean;
};

export type JobsStackParamList = {
  Find: undefined;
  Search: undefined;
  JobDetails: JobRouteParams;
  ApplicationForm: JobRouteParams;
};

export type SavedStackParamList = {
  SavedJobs: undefined;
  JobDetails: JobRouteParams;
  ApplicationForm: JobRouteParams;
};

export type SharedJobStackParamList = {
  JobDetails: JobRouteParams;
  ApplicationForm: JobRouteParams;
};

export type RootTabParamList = {
  JobsTab: NavigatorScreenParams<JobsStackParamList> | undefined;
  SavedTab: NavigatorScreenParams<SavedStackParamList> | undefined;
};

export type JobsStackScreenProps<Screen extends keyof JobsStackParamList> =
  NativeStackScreenProps<JobsStackParamList, Screen>;

export type SavedStackScreenProps<Screen extends keyof SavedStackParamList> =
  NativeStackScreenProps<SavedStackParamList, Screen>;

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, Screen>;

export type SharedJobDetailsScreenProps = NativeStackScreenProps<
  SharedJobStackParamList,
  "JobDetails"
>;

export type SharedApplicationFormScreenProps = NativeStackScreenProps<
  SharedJobStackParamList,
  "ApplicationForm"
>;