// constants/dropdownOptions.ts
export interface OptionType {
  id: string;
  name: string;
}

export const organizationOptions = {
  organizationSize: [
    { value: "SOLO TREADER", label: "Sole Trader" },
    { value: "SMALL TEAM (1-5 staff)", label: "Small Team (1-5 staff)" },
    { value: "CORPORATION", label: "Corporation" },
    { value: "NOT FOR PROFIT", label: "Not for Profit" },
    // { value: "medium-team", label: "Medium Team (6-20 staff)" },
    // { value: "large-team", label: "Large Team (21+ staff)" },
  ],
  frontlineStaffTitle: [
    { value: "WORKERS", label: "Workers" },
    { value: "SUPPORT WORKER", label: "Support Workers" },
    { value: "CLINICIANS", label: "Clinicians" },
    // { value: "care-workers", label: "Care Workers" },
    // { value: "therapists", label: "Therapists" },
    // { value: "nurses", label: "Nurses" },
    // { value: "support-staff", label: "Support Staff" },
  ],
  seniorStaffTitle: [
    { value: "CEO", label: "CEO" },
    { value: "DIRECTOR", label: "Director" },
    { value: "OWNER", label: "Owner" },
    { value: "CHAIRPERSON", label: "Chairperson" },
    // { value: "manager", label: "Manager" },
    // { value: "principal", label: "Principal" },
    // { value: "coordinator", label: "Coordinator" },
  ],
};
