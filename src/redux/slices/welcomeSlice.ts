// store/welcomeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define specific interfaces for each step's data
interface Step1Data {
  welcomed: boolean;
  textContent: string;
}

interface Step2Data {
  businessName: string;
  businessType: string;
  businessDescription?: string;
  registrationNumber?: string;
}

interface Step3Data {
  services: string[];
  primaryService: string;
  serviceDescription?: string;
}

interface Step4Data {
  teamSize: number;
  keyRoles: Array<{
    title: string;
    name: string;
    responsibilities: string[];
  }>;
  organizationStructure: string;
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
    updateFormData: <T extends keyof StepFormData>(
      state: WelcomeState,
      action: PayloadAction<{ step: T; data: StepFormData[T] }>
    ) => {
      state.formData[action.payload.step] = action.payload.data;
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
