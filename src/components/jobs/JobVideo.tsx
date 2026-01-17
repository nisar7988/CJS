import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface JobVideoProps {
    jobId: string;
}

export default function JobVideo({ jobId }: JobVideoProps) {
    const handleUpload = () => {
        Alert.alert("Coming Soon", "Video upload functionality will be available in the next update.");
    };

    return (
        <View className="px-[18px] mt-[18px] gap-[14px]">
            {/* Upload Card */}
            <View className="bg-white rounded-[18px] p-4 shadow-black/5 shadow-sm elevation-2">
                <View className="border-2 border-primary rounded-[18px] py-7 items-center justify-center bg-[#F9FBFF]">
                    {/* Icon box */}
                    <View className="w-[54px] h-[54px] rounded-2xl bg-[#EAF2FF] items-center justify-center">
                        <Ionicons name="cloud-upload-outline" size={26} color="#2563EB" />
                    </View>

                    <Text className="mt-3.5 text-sm font-extrabold text-gray-900">
                        Upload Site Video
                    </Text>

                    <Text className="mt-1.5 text-[11px] text-gray-500">
                        Drag and drop or click to browse
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="mt-3.5 bg-primary px-[18px] py-2.5 rounded-2xl shadow-primary/25 shadow-md elevation-4"
                        onPress={handleUpload}
                    >
                        <Text className="text-white text-xs font-extrabold">
                            Browse Files
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Empty Videos Card */}
            <View className="bg-white rounded-[18px] py-[22px] items-center justify-center shadow-black/5 shadow-sm elevation-2">
                <Ionicons name="videocam-outline" size={28} color="#64748B" />
                <Text className="mt-2.5 text-[11px] text-gray-500">
                    No videos uploaded yet
                </Text>
            </View>

            {/* Sync Status */}
            <View className="bg-white rounded-2xl p-[14px] flex-row items-center gap-2.5 shadow-black/5 shadow-sm elevation-2">
                <View className="w-[34px] h-[34px] rounded-[14px] bg-[#E9FFF2] items-center justify-center">
                    <Ionicons name="wifi-outline" size={18} color="#16A34A" />
                </View>

                <View>
                    <Text className="text-[13px] font-extrabold text-gray-900">
                        Sync Status
                    </Text>
                    <Text className="text-[11px] text-gray-500 mt-px">
                        Video upload sync pending implementation
                    </Text>
                </View>
            </View>
        </View>
    );
}
