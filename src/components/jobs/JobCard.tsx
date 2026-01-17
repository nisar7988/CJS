import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Job } from "../../types/models";

interface JobCardProps {
    job: Job;
    onPress?: () => void;
}

const statusStyle = (status: string) => {
    switch (status.toLowerCase()) {
        case "active":
        case "interviewing":
            return {
                badge: "bg-green-100",
                text: "text-green-700",
                dot: "bg-green-500",
            };
        case "pending":
            return {
                badge: "bg-yellow-100",
                text: "text-yellow-700",
                dot: "bg-yellow-500",
            };
        case "rejected":
            return {
                badge: "bg-red-100",
                text: "text-red-700",
                dot: "bg-red-500",
            };
        default:
            return {
                badge: "bg-blue-100",
                text: "text-blue-700",
                dot: "bg-blue-500",
            };
    }
};

export default function JobCard({ job, onPress }: JobCardProps) {
    const s = statusStyle(job.status);
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
                    <Text className="text-gray-500 mt-1" numberOfLines={1}>{job.company}</Text>
                </View>

                <View className={`px-3 py-1 rounded-full ${s.badge}`}>
                    <View className="flex-row items-center gap-2">
                        <View className={`w-2 h-2 rounded-full ${s.dot}`} />
                        <Text className={`text-xs font-medium ${s.text} uppercase`}>{job.status}</Text>
                    </View>
                </View>
            </View>

            {/* Details Row */}
            <View className="flex-row items-center justify-between mt-5">
                {/* Amount */}
                {job.salary ? (
                    <View className="flex-row items-center gap-2">
                        <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                            <Text className="text-blue-500 font-bold text-xs">$</Text>
                        </View>
                        <Text className="text-gray-900 font-semibold">{job.salary}</Text>
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
