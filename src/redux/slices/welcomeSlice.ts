import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/src/api/auth";

// Define specific interfaces for each step's data
interface Step1Data {
  welcomed: boolean;
  textContent: string;
}

interface Step2Data {
  providerType: string;
  operatingStates: Array<{ name: string; id: string }>;
  businessDescription?: string;
  registrationNumber?: string;
  registrationGroups?: Array<{ name: string; id: string }>;
}

interface Step3Data {
  understandServices?: boolean | null;
  transportParticipants?: boolean | null;
  supportParticipantsWithBehaviour?: boolean | null;
  provideFundingSupport?: boolean | null;
}

interface Step4Data {
  organizationSize?: string | null;
  frontlineStaffTitle?: string | null;
  seniorStaffTitle?: string | null;
}

interface Step5Data {
  stylePreference?: string | null;
  styleExample?: string | null;
  styleDescription?: string;
  hasStyleGuide?: boolean;
  styleGuideFile?: File | null;
  headerColor?: string;
}

interface Step6Data {
  reviewCompleted: boolean;
  finalComments?: string;
}

// Union type for all step data
type StepFormData = {
  1?: Step1Data;
  2?: Step2Data;
  3?: Step3Data;
  4?: Step4Data;
  5?: Step5Data;
  6?: Step6Data;
};

// Final submission data interface
interface FinalSubmissionData {
  provider_type: string;
  states_operating: number[];
  business_description: string;
  registration_groups: number[];
  administer_medications: boolean;
  handle_hazardous_waste: boolean;
  behaviour_support_plan: boolean;
  complex_nursing_supports: boolean;
  organization_size: string;
  frontline_staff_label: string;
  senior_person_label: string;
  formality_level: string;
  policy_header_color: string;
  branding_guide: string;
  policy_style: string;
  additional_styling: string;
}

interface WelcomeState {
  currentStep: number;
  completedSteps: number[];
  formData: StepFormData;
  submissionStatus: "idle" | "loading" | "succeeded" | "failed";
  submissionError: string | null;
}

// Enhanced initial state with default values
const initialState: WelcomeState = {
  currentStep: 1,
  completedSteps: [],
  submissionStatus: "idle",
  submissionError: null,
  formData: {
    1: {
      welcomed: false,
      textContent: "",
    },
    2: {
      providerType: "",
      operatingStates: [],
      businessDescription: "",
      registrationGroups: [],
    },
    3: {
      understandServices: null,
      transportParticipants: null,
      supportParticipantsWithBehaviour: null,
      provideFundingSupport: null,
    },
    4: {
      organizationSize: null,
      frontlineStaffTitle: null,
      seniorStaffTitle: null,
    },
    5: {
      stylePreference: null,
      styleExample: null,
      styleDescription: "",
      hasStyleGuide: false,
      styleGuideFile: null,
      headerColor: "#FF784B",
    },
    6: {
      reviewCompleted: false,
      finalComments: "",
    },
  },
};

// Default step data for proper initialization
const getDefaultStepData = (step: keyof StepFormData) => {
  switch (step) {
    case 1:
      return { welcomed: false, textContent: "" };
    case 2:
      return {
        providerType: "",
        operatingStates: [],
        businessDescription: "",
        registrationGroups: [],
      };
    case 3:
      return {
        understandServices: null,
        transportParticipants: null,
        supportParticipantsWithBehaviour: null,
        provideFundingSupport: null,
      };
    case 4:
      return {
        organizationSize: null,
        frontlineStaffTitle: null,
        seniorStaffTitle: null,
      };
    case 5:
      return {
        stylePreference: null,
        styleExample: null,
        styleDescription: "",
        hasStyleGuide: false,
        styleGuideFile: null,
        headerColor: "#FF784B",
      };
    case 6:
      return {
        reviewCompleted: false,
        finalComments: "",
      };
    default:
      return {};
  }
};

// Async thunk for onboarding submission
export const submitOnboardingData = createAsyncThunk<
  any,
  FinalSubmissionData,
  { rejectValue: string }
>("welcome/submitOnboardingData", async (data, { rejectWithValue }) => {
  try {
    console.log("Submitting onboarding data:", data);
    // const response = await authService.submitOnboarding(data);
    // return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Submission failed"
    );
  }
});

const welcomeSlice = createSlice({
  name: "welcome",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    completeStep: (state, action: PayloadAction<number>) => {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },
    // Fixed updateFormData with proper type handling
    updateFormData: (
      state,
      action: PayloadAction<{ step: keyof StepFormData; data: any }>
    ) => {
      const { step, data } = action.payload;

      // Ensure the step exists in formData with proper default data
      if (!state.formData[step]) {
        state.formData[step] = getDefaultStepData(step) as any;
      }

      // Merge the new data with existing data
      state.formData[step] = {
        ...state.formData[step],
        ...data,
      };
    },
    resetWelcome: (state) => {
      return initialState;
    },
    resetSubmission: (state) => {
      state.submissionStatus = "idle";
      state.submissionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboardingData.pending, (state) => {
        state.submissionStatus = "loading";
        state.submissionError = null;
      })
      .addCase(submitOnboardingData.fulfilled, (state) => {
        state.submissionStatus = "succeeded";
        state.submissionError = null;
      })
      .addCase(submitOnboardingData.rejected, (state, action) => {
        state.submissionStatus = "failed";
        state.submissionError = action.payload as string;
      });
  },
});

export const {
  setCurrentStep,
  completeStep,
  updateFormData,
  resetWelcome,
  resetSubmission,
} = welcomeSlice.actions;

export default welcomeSlice.reducer;

// Export types for use in components
export type {
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  Step5Data,
  Step6Data,
  StepFormData,
  WelcomeState,
  FinalSubmissionData,
};
