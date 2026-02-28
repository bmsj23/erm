import { NavigationProp } from "@react-navigation/native";
import { Job } from "../types/job";

export type RootStackParamList = {
  Home: undefined;
  Find: undefined;
  JobDetails: {
    job: Job;
    fromSavedJobs?: boolean;
  };
};

export interface Props {
  navigation: NavigationProp<any>;
}