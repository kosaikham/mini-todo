package com.todo;

import android.content.Intent;
import android.provider.Settings;

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
    public void open(){
        Intent intent = new Intent(Settings.ACTION_SECURITY_SETTINGS);
        getCurrentActivity().startActivity(intent);
    }
}
