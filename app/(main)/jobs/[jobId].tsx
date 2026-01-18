import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { JobsRepo } from "../../../src/db/repositories/jobs.repo";
import { Job } from "../../../src/types/models";
import JobOverview from "../../../src/components/jobs/JobOverview";
import JobNotes from "../../../src/components/jobs/JobNotes";
import JobVideo from "../../../src/components/jobs/JobVideo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JobDetailsScreen() {
    const router = useRouter();
    const { jobId } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState("Overview");
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const loadJob = async () => {
                if (!jobId) return;
                try {
                    const data = await JobsRepo.getById(jobId as string);
                    setJob(data);
                } catch (error) {
                    console.error("Failed to load job", error);
                } finally {
                    setLoading(false);
                }
            };
            loadJob();
        }, [jobId])
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (!job) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Job not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-2.5">
                    <Text className="text-primary">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case "Overview":
                return <JobOverview job={job} />;
            case "Notes":
                return <JobNotes jobId={job.id} />;
            case "Video":
                return <JobVideo jobId={job.id} />;
            default:
                return <JobOverview job={job} />;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" style={{ backgroundColor: "#F6F9FF" }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                {/* Header */}
                <View className="px-[18px] pt-2.5">
                    <View className="flex-row items-center justify-between">
                        {/* Back */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-[38px] h-[38px] rounded-[20px] bg-white items-center justify-center shadow-black/5 shadow-sm elevation-2"
                        >
                            <Ionicons name="arrow-back" size={20} color="#111" />
                        </TouchableOpacity>

                        {/* Edit Button */}
                        <TouchableOpacity
                            onPress={() => router.push(`/jobs/edit/${job.id}`)}
                            className="bg-primary px-3.5 py-1.5 rounded-2xl"
                        >
                            <Text className="text-white font-bold text-[13px]">
                                Edit
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Title + subtitle */}
                    <View className="mt-2.5">
                        <Text className="text-lg font-extrabold text-gray-900">
                            {job.title}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-0.5">
                            {job.company}
                        </Text>
                    </View>

                    {/* Tabs */}
                    <View className="flex-row gap-2.5 mt-3">
                        <TabButton
                            label="Overview"
                            icon="document-text-outline"
                            activeTab={activeTab}
                            onPress={() => setActiveTab("Overview")}
                        />
                        <TabButton
                            label="Notes"
                            icon="reader-outline"
                            activeTab={activeTab}
                            onPress={() => setActiveTab("Notes")}
                        />
                        <TabButton
                            label="Video"
                            icon="videocam-outline"
                            activeTab={activeTab}
                            onPress={() => setActiveTab("Video")}
                        />
                    </View>
                </View>

                {/* Content */}
                {renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
}

/* ------------------ Components ------------------ */

interface TabButtonProps {
    label: string;
    icon: any;
    activeTab: string;
    onPress: () => void;
}

function TabButton({ label, icon, activeTab, onPress }: TabButtonProps) {
    const isActive = activeTab === label;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            className={`flex-row items-center gap-1.5 px-3 py-2 rounded-2xl ${isActive ? "bg-[#EEF4FF]" : "bg-transparent"
                }`}
        >
            <Ionicons
                name={icon}
                size={16}
                color={isActive ? "#2563EB" : "#6B7280"}
            />
            <Text
                className={`text-xs font-bold ${isActive ? "text-primary" : "text-gray-500"
                    }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

