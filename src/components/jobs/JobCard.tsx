import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Job {
    title: string;
    client: string;
    amount: string;
    location: string;
    date: string;
    status: string;
}

interface JobCardProps {
    job: Job;
}

const statusStyle = (status: string) => {
    if (status === "Active")
        return {
            badge: "bg-green-100",
            text: "text-green-700",
            dot: "bg-green-500",
        };

    if (status === "Pending")
        return {
            badge: "bg-yellow-100",
            text: "text-yellow-700",
            dot: "bg-yellow-500",
        };

    return {
        badge: "bg-blue-100",
        text: "text-blue-700",
        dot: "bg-blue-500",
    };
};

export default function JobCard({ job }: JobCardProps) {
    const s = statusStyle(job.status);

    return (
        <View
            className="bg-white rounded-2xl p-5 mb-5 border border-gray-100"
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
            }}
        >
            {/* Title + Status */}
            <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                    <Text className="text-base font-semibold text-gray-900">
                        {job.title}
                    </Text>
                    <Text className="text-gray-500 mt-1">{job.client}</Text>
                </View>

                <View className={`px-3 py-1 rounded-full ${s.badge}`}>
                    <View className="flex-row items-center gap-2">
                        <View className={`w-2 h-2 rounded-full ${s.dot}`} />
                        <Text className={`text-sm font-medium ${s.text}`}>{job.status}</Text>
                    </View>
                </View>
            </View>

            {/* Details Row */}
            <View className="flex-row items-center justify-between mt-5">
                {/* Amount */}
                <View className="flex-row items-center gap-2">
                    <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center">
                        <Text className="text-blue-500 font-bold">$</Text>
                    </View>
                    <Text className="text-gray-900 font-semibold">{job.amount}</Text>
                </View>

                {/* Location */}
                <View className="flex-row items-center gap-2">
                    <View className="w-9 h-9 rounded-full bg-green-50 items-center justify-center">
                        <Ionicons name="location-outline" size={18} color="#22C55E" />
                    </View>
                    <Text className="text-gray-700 font-medium">{job.location}</Text>
                </View>
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-gray-100 my-4" />

            {/* Date */}
            <View className="flex-row items-center gap-2">
                <Ionicons name="time-outline" size={16} color="#94A3B8" />
                <Text className="text-gray-500 text-sm">{job.date}</Text>
            </View>
        </View>
    );
}
