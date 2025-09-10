// constants/dropdownOptions.ts
export interface OptionType {
  id: string;
  name: string;
}

export const stateOptions: OptionType[] = [
  { id: "ACT", name: "Australian Capital Territory (ACT)" },
  { id: "NSW", name: "New South Wales (NSW)" },
  { id: "NT", name: "Northern Territory (NT)" },
  { id: "QLD", name: "Queensland (QLD)" },
  { id: "SA", name: "South Australia (SA)" },
  { id: "TAS", name: "Tasmania (TAS)" },
  { id: "VIC", name: "Victoria (VIC)" },
  { id: "WA", name: "Western Australia (WA)" },
];

export const registrationGroupOptions: OptionType[] = [
  { id: "0136", name: "0136 - Therapeutic Supports" },
  {
    id: "0104",
    name: "0104 - Assistance in Coordinating or Managing Life Stages, Transitions and Supports",
  },
  {
    id: "0117",
    name: "0117 - Management of Funding for Supports (Plan Management)",
  },
  { id: "0125", name: "0125 - Therapeutic Supports" },
  { id: "0122", name: "0122 - Specialist Support Coordination" },
  { id: "0116", name: "0116 - Development of Daily Living and Life Skills" },
  { id: "0101", name: "0101 - Assistance with Self-Care Activities" },
  {
    id: "0102",
    name: "0102 - Assistance with Social and Community Participation",
  },
  { id: "0103", name: "0103 - Daily Tasks/Shared Living" },
  { id: "0106", name: "0106 - Communication and Information Systems" },
  { id: "0107", name: "0107 - Therapeutic Supports" },
  { id: "0108", name: "0108 - Early Childhood Supports" },
  { id: "0109", name: "0109 - Behaviour Support" },
  { id: "0111", name: "0111 - Specialist Disability Accommodation" },
  { id: "0112", name: "0112 - Personal Mobility Equipment" },
  { id: "0113", name: "0113 - Personal Activities High Intensity" },
  { id: "0114", name: "0114 - Hearing Services" },
  { id: "0115", name: "0115 - Vision Services" },
  { id: "0118", name: "0118 - Psychosocial Recovery Coaching" },
  { id: "0119", name: "0119 - Group and Centre Based Activities" },
  { id: "0120", name: "0120 - Accommodation/Tenancy" },
  { id: "0121", name: "0121 - Household Tasks" },
  { id: "0123", name: "0123 - Interpreting and Translation" },
  { id: "0124", name: "0124 - Specialist Behaviour Intervention Supports" },
  { id: "0126", name: "0126 - Innovative Community Participation" },
  { id: "0127", name: "0127 - High Intensity Daily Personal Activities" },
  { id: "0128", name: "0128 - Nursing" },
  { id: "0129", name: "0129 - Meal Preparation" },
  { id: "0130", name: "0130 - Linen Service" },
];

export const suggestedRegistrationGroups: OptionType[] = [
  { id: "0136", name: "0136 - Therapeutic Supports" },
  { id: "0122", name: "0122 - Specialist Support Coordination" },
];

export const organizationOptions = {
  organizationSize: [
    { value: "sole-trader", label: "Sole Trader" },
    { value: "small-team", label: "Small Team (1-5 staff)" },
    { value: "medium-team", label: "Medium Team (6-20 staff)" },
    { value: "large-team", label: "Large Team (21+ staff)" },
    { value: "corporation", label: "Corporation" },
    { value: "not-for-profit", label: "Not for Profit" },
  ],
  frontlineStaffTitle: [
    { value: "workers", label: "Workers" },
    { value: "support-workers", label: "Support Workers" },
    { value: "care-workers", label: "Care Workers" },
    { value: "clinicians", label: "Clinicians" },
    { value: "therapists", label: "Therapists" },
    { value: "nurses", label: "Nurses" },
    { value: "support-staff", label: "Support Staff" },
  ],
  seniorStaffTitle: [
    { value: "ceo", label: "CEO" },
    { value: "director", label: "Director" },
    { value: "owner", label: "Owner" },
    { value: "manager", label: "Manager" },
    { value: "chairperson", label: "Chairperson" },
    { value: "principal", label: "Principal" },
    { value: "coordinator", label: "Coordinator" },
  ],
};
