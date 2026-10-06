const { withEntitlementsPlist } = require('expo/config-plugins');

/**
 * expo-notifications auto-adds the `aps-environment` (Push Notifications) entitlement.
 * SalahSync v1 only uses local notifications, and free Apple developer teams cannot
 * sign apps with that capability. Remove it. Drop this plugin if remote push is added.
 */
module.exports = function withoutPushEntitlement(config) {
  return withEntitlementsPlist(config, (c) => {
    delete c.modResults['aps-environment'];
    return c;
  });
};
