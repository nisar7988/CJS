import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    SafeAreaView,
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
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (!job) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Job not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 10 }}>
                    <Text style={{ color: "#2563EB" }}>Go Back</Text>
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F9FF" }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                {/* Header */}
                <View style={{ paddingHorizontal: 18, paddingTop: 10 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {/* Back */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: 20,
                                backgroundColor: "#FFFFFF",
                                alignItems: "center",
                                justifyContent: "center",
                                shadowColor: "#000",
                                shadowOpacity: 0.05,
                                shadowRadius: 10,
                                elevation: 2,
                            }}
                        >
                            <Ionicons name="arrow-back" size={20} color="#111" />
                        </TouchableOpacity>

                        {/* Edit Button */}
                        <TouchableOpacity
                            onPress={() => router.push(`/jobs/edit/${job.id}`)}
                            style={{
                                backgroundColor: "#2563EB",
                                paddingHorizontal: 14,
                                paddingVertical: 7,
                                borderRadius: 16,
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
                                Edit
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Title + subtitle */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>
                            {job.title}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                            {job.company}
                        </Text>
                    </View>

                    {/* Tabs */}
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 10,
                            marginTop: 12,
                        }}
                    >
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
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 16,
                backgroundColor: isActive ? "#EEF4FF" : "transparent",
            }}
        >
            <Ionicons
                name={icon}
                size={16}
                color={isActive ? "#2563EB" : "#6B7280"}
            />
            <Text
                style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: isActive ? "#2563EB" : "#6B7280",
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

