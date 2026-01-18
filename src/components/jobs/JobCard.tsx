import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Job } from "../../types/models";
import { SyncBadge } from "../status/SyncBadge";

interface JobCardProps {
    job: Job;
    onPress?: () => void;
}

export default function JobCard({ job, onPress }: JobCardProps) {
    const date = new Date(job.created_at).toLocaleDateString();

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="bg-white rounded-2xl p-5 mb-4 border border-gray-100"
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
            }}
        >
            {/* Title + Status */}
            <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                    <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
                        {job.title}
                    </Text>
                    <Text className="text-gray-500 mt-1" numberOfLines={1}>{job.location}</Text>
                </View>

                <SyncBadge synced={job.synced} />
            </View>

            {/* Details Row */}
            <View className="flex-row items-center justify-between mt-5">
                {/* Amount */}
                {job.budget ? (
                    <View className="flex-row items-center gap-2">
                        <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                            <Text className="text-blue-500 font-bold text-xs">$</Text>
                        </View>
                        <Text className="text-gray-900 font-semibold">{job.budget}</Text>
                    </View>
                ) : (
                    <View />
                )}
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-gray-100 my-4" />

            {/* Date */}
            <View className="flex-row items-center gap-2">
                <Ionicons name="time-outline" size={16} color="#94A3B8" />
                <Text className="text-gray-500 text-sm">Applied on {date}</Text>
            </View>
        </TouchableOpacity>
    );
}
