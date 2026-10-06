const fs = require('fs');
const path = require('path');
const {
  withDangerousMod,
  withInfoPlist,
  withXcodeProject,
  IOSConfig,
} = require('expo/config-plugins');

/**
 * iOS 27 traps at launch unless the app adopts the UIScene life cycle.
 * Expo SDK 57 ships `ExpoAppSceneDelegate` but its prebuild template does not wire it up
 * (the SDK 58 template does). This plugin mirrors the SDK 58 template:
 *   - adds SceneDelegate.swift
 *   - adds UIApplicationSceneManifest to Info.plist
 *   - makes AppDelegate an ExpoReactNativeFactoryProvider and moves window/RN start to the scene.
 * Remove this plugin after upgrading to an SDK whose template does this itself.
 */

const SCENE_DELEGATE = `internal import Expo

@objc(SceneDelegate)
class SceneDelegate: ExpoAppSceneDelegate {
  // Extension point for config plugins.
}
`;

const withSceneInfoPlist = (config) =>
  withInfoPlist(config, (c) => {
    c.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
          },
        ],
      },
    };
    return c;
  });

const withSceneFiles = (config) =>
  withDangerousMod(config, [
    'ios',
    (c) => {
      const dir = path.join(c.modRequest.platformProjectRoot, c.modRequest.projectName);

      fs.writeFileSync(path.join(dir, 'SceneDelegate.swift'), SCENE_DELEGATE);

      const appDelegatePath = path.join(dir, 'AppDelegate.swift');
      let src = fs.readFileSync(appDelegatePath, 'utf8');

      if (!src.includes('ExpoReactNativeFactoryProvider')) {
        src = src.replace(
          'class AppDelegate: ExpoAppDelegate {',
          'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {'
        );
        const startBlock = /#if os\(iOS\) \|\| os\(tvOS\)\n\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\n\s*factory\.startReactNative\([\s\S]*?\n#endif\n/;
        if (!startBlock.test(src)) {
          throw new Error('withSceneLifecycle: AppDelegate start block not found; template changed.');
        }
        src = src.replace(
          startBlock,
          '    // The window is created and React Native is started by `SceneDelegate` under the\n' +
            '    // scene-based life cycle (required by the iOS 27 SDK).\n'
        );
        fs.writeFileSync(appDelegatePath, src);
      }
      return c;
    },
  ]);

const withSceneXcodeProject = (config) =>
  withXcodeProject(config, (c) => {
    IOSConfig.XcodeUtils.addBuildSourceFileToGroup({
      filepath: path.join(c.modRequest.projectName, 'SceneDelegate.swift'),
      groupName: c.modRequest.projectName,
      project: c.modResults,
    });
    return c;
  });

module.exports = function withSceneLifecycle(config) {
  config = withSceneInfoPlist(config);
  config = withSceneFiles(config);
  config = withSceneXcodeProject(config);
  return config;
};
