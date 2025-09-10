import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  preferences: {
    notifications: boolean;
    dashboard: string;
    theme: string;
  };
  customSettings: Record<string, string | number | boolean>;
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

interface WelcomeState {
  currentStep: number;
  completedSteps: number[];
  formData: StepFormData;
}

const initialState: WelcomeState = {
  currentStep: 1,
  completedSteps: [],
  formData: {},
};

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
    updateFormData: (
      state,
      action: PayloadAction<{ step: keyof StepFormData; data: any }>
    ) => {
      const { step, data } = action.payload;
      state.formData[step] = data;
    },
    resetWelcome: (state) => {
      state.currentStep = 1;
      state.completedSteps = [];
      state.formData = {};
    },
  },
});

export const { setCurrentStep, completeStep, updateFormData, resetWelcome } =
  welcomeSlice.actions;
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
};
