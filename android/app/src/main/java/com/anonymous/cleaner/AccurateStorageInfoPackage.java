package com.anonymous.cleaner;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;
import java.util.Collections;
import java.util.List;

public class AccurateStorageInfoPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(
            com.facebook.react.bridge.ReactApplicationContext reactContext) {
        return Collections.<NativeModule>singletonList(new AccurateStorageInfoModule(reactContext));
    }

    @Override
    public List<ViewManager> createViewManagers(
            com.facebook.react.bridge.ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
} 