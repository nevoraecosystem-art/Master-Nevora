const restrictedActions = new Set<string>([
  'operate_funds',
  'launch_founder_mode',
  'high_risk_investment',
  'perform_financial_operation',
  'execute_external_action',
]);

const advisoryOnly = new Set<string>([
  'create_business',
  'give_life_advice',
  'general_consulting',
]);

export const NorahLitePolicies = {
  canPerform(action: string): boolean {
    if (restrictedActions.has(action)) {
      return false;
    }
    // Lite mode only provides recommendations, not direct execution
    return true;
  },
  description: 'Norah Lite policies restrict high-risk operations and only allow recommendations.',
  advisoryOnly,
};
