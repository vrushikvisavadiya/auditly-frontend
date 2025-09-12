// src/hooks/useOrganizationData.ts
import { useState, useEffect } from "react";
import {
  organizationService,
  State,
  RegistrationGroup,
  MatchedGroup,
} from "@/src/api/organization";
import { OptionType } from "@/components/ui/CustomMultiSelect";

interface UseStatesReturn {
  states: OptionType[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseRegistrationGroupsReturn {
  registrationGroups: OptionType[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseMatchGroupsReturn {
  matchedGroups: OptionType[];
  loading: boolean;
  error: string | null;
  matchGroups: (context: string) => Promise<void>;
}

// Hook to fetch states
export const useStates = (): UseStatesReturn => {
  const [states, setStates] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStates = async () => {
    try {
      setLoading(true);
      setError(null);
      const statesData = await organizationService.getStates();

      const transformedStates: OptionType[] = statesData.map(
        (state: State) => ({
          id: state.id.toString(),
          name: state.name,
        })
      );

      setStates(transformedStates);
    } catch (err: any) {
      setError(err.message || "Failed to fetch states");
      console.error("Error in useStates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  return {
    states,
    loading,
    error,
    refetch: fetchStates,
  };
};

// Hook to fetch registration groups
export const useRegistrationGroups = (): UseRegistrationGroupsReturn => {
  const [registrationGroups, setRegistrationGroups] = useState<OptionType[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrationGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const groupsData = await organizationService.getRegistrationGroups();

      const transformedGroups: OptionType[] = groupsData.map(
        (group: RegistrationGroup) => ({
          id: group.id.toString(),
          name: `${group.number} - ${group.name}`,
        })
      );

      setRegistrationGroups(transformedGroups);
    } catch (err: any) {
      setError(err.message || "Failed to fetch registration groups");
      console.error("Error in useRegistrationGroups:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrationGroups();
  }, []);

  return {
    registrationGroups,
    loading,
    error,
    refetch: fetchRegistrationGroups,
  };
};

// Hook to match groups based on context
export const useMatchGroups = (): UseMatchGroupsReturn => {
  const [matchedGroups, setMatchedGroups] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matchGroups = async (context: string) => {
    try {
      setLoading(true);
      setError(null);
      const matchedData = await organizationService.matchGroups(context);

      const transformedGroups: OptionType[] = matchedData.map(
        (group: MatchedGroup, index: number) => {
          return {
            id: `${group.id}`,
            name: `${group.number} - ${group.name}`,
          };
        }
      );

      setMatchedGroups(transformedGroups);
    } catch (err: any) {
      setError(err.message || "Failed to match groups");
      console.error("Error in useMatchGroups:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    matchedGroups,
    loading,
    error,
    matchGroups,
  };
};
