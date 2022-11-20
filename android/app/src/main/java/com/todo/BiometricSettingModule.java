package com.todo;

import android.content.Intent;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class BiometricSettingModule extends ReactContextBaseJavaModule {
    public BiometricSettingModule(ReactApplicationContext reactContext){
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "BiometricSettingModule";
    }

    @ReactMethod
    public void open(String name){
        Log.d("CalendarModule", "Create event called with name: " + name);
//        Intent intent = new Intent(Settings.ACTION_BIOMETRIC_ENROLL);
//        getCurrentActivity().startActivity(intent);
    }
}
