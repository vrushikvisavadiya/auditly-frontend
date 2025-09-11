// src/utils/organizationHelpers.ts
import { OptionType } from "@/components/ui/CustomMultiSelect";

// Convert selected states back to number IDs for API submission
export const getSelectedStateIds = (selectedStates: OptionType[]): number[] => {
  return selectedStates.map((state) => parseInt(state.id, 10));
};

// Convert selected registration groups back to comma-separated numbers for API submission
export const getSelectedRegistrationNumbers = (
  selectedGroups: OptionType[]
): string => {
  // Extract the number part from the display name (before the " - ")
  const numbers = selectedGroups.map((group) => {
    const numberPart = group.name.split(" - ")[0];
    return numberPart;
  });
  return numbers.join(",");
};

// Get registration group IDs as numbers
export const getSelectedRegistrationIds = (
  selectedGroups: OptionType[]
): number[] => {
  return selectedGroups.map((group) => parseInt(group.id, 10));
};
