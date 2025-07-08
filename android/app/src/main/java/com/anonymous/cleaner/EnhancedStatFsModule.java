package com.anonymous.cleaner;

import android.os.StatFs;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class EnhancedStatFsModule extends ReactContextBaseJavaModule {
    public EnhancedStatFsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "EnhancedStatFs";
    }

    @ReactMethod
    public void getPartitionInfo(String path, Promise promise) {
        try {
            StatFs stat = new StatFs(path);
            long totalBytes = stat.getTotalBytes();
            long freeBytes = stat.getAvailableBytes();
            com.facebook.react.bridge.WritableMap map = new com.facebook.react.bridge.WritableNativeMap();
            map.putDouble("totalBytes", (double) totalBytes);
            map.putDouble("freeBytes", (double) freeBytes);
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("ERROR", e);
        }
    }
} 