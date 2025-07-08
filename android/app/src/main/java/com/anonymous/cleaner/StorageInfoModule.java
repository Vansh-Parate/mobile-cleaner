package com.anonymous.cleaner;

import android.os.StatFs;
import android.os.Environment;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.io.File;

public class StorageInfoModule extends ReactContextBaseJavaModule {
    public StorageInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "StorageInfo";
    }

    @ReactMethod
    public void getFreeStorage(Promise promise) {
        try {
            File path = Environment.getExternalStorageDirectory(); // /storage/emulated/0
            StatFs stat = new StatFs(path.getAbsolutePath());
            long freeBytes = stat.getAvailableBytes();
            promise.resolve(freeBytes);
        } catch (Exception e) {
            promise.reject("ERROR", e);
        }
    }

    @ReactMethod
    public void getTotalStorage(Promise promise) {
        try {
            File path = Environment.getExternalStorageDirectory();
            StatFs stat = new StatFs(path.getAbsolutePath());
            long totalBytes = stat.getTotalBytes();
            promise.resolve(totalBytes);
        } catch (Exception e) {
            promise.reject("ERROR", e);
        }
    }
} 