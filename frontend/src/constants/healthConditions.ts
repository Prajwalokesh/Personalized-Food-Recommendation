export const healthConditionMap: Record<string, string> = {
  diabetes: "Diabetes",
  hypertension: "Hypertension",
  heart_disease: "Heart Disease",
  obesity: "Obesity",
  kidney_disease: "Kidney Disease",
  allergies: "Food Allergies",
  none: "No Medical Conditions",
};

// Helper function to get formatted health condition name
export const getFormattedConditionName = (conditionKey: string): string => {
  return healthConditionMap[conditionKey] || conditionKey;
};
