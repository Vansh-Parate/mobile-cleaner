package com.anonymous.cleaner;

import android.content.Context;
import android.os.Build;
import android.os.storage.StorageManager;
import android.os.storage.StorageStatsManager;
import android.os.StatFs;
import com.facebook.react.bridge.*;
import java.io.File;
import java.util.UUID;

public class AccurateStorageInfoModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public AccurateStorageInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "AccurateStorageInfo";
    }

    @ReactMethod
    public void getStorageInfo(Promise promise) {
        // Try StorageStatsManager (Android 8+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                StorageStatsManager storageStatsManager =
                        (StorageStatsManager) reactContext.getSystemService(Context.STORAGE_STATS_SERVICE);
                StorageManager storageManager =
                        (StorageManager) reactContext.getSystemService(Context.STORAGE_SERVICE);
                UUID uuid = StorageManager.UUID_DEFAULT;

                long totalBytes = storageStatsManager.getTotalBytes(uuid);
                long freeBytes = storageStatsManager.getFreeBytes(uuid);
                long usedBytes = totalBytes - freeBytes;

                WritableMap result = Arguments.createMap();
                result.putDouble("totalBytes", totalBytes);
                result.putDouble("freeBytes", freeBytes);
                result.putDouble("usedBytes", usedBytes);

                promise.resolve(result);
                return;
            } catch (Exception e) {
                // Fallback below
            }
        }
        // Fallback: StatFs on /storage/emulated/0
        try {
            String path = "/storage/emulated/0";
            File file = new File(path);
            if (!file.exists()) {
                path = "/data";
            }
            StatFs statFs = new StatFs(path);
            long totalBytes = statFs.getTotalBytes();
            long freeBytes = statFs.getAvailableBytes();
            long usedBytes = totalBytes - freeBytes;

            WritableMap result = Arguments.createMap();
            result.putDouble("totalBytes", totalBytes);
            result.putDouble("freeBytes", freeBytes);
            result.putDouble("usedBytes", usedBytes);
            result.putString("path", path);

            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("STORAGE_ERROR", e.getMessage());
        }
    }
} 