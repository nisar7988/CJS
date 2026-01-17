import React, { useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function JobVideoScreen() {
    const router = useRouter();
    const { jobId, jobTitle, jobCompany } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState("Video");

    const handleUpload = () => {
        Alert.alert("Coming Soon", "Video upload functionality will be available in the next update.");
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
                    </View>

                    {/* Title + subtitle */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>
                            {jobTitle || "Job Video"}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                            {jobCompany || "Details"}
                        </Text>
                    </View>

                    {/* Tabs */}
                    <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                        <TabButton
                            label="Overview"
                            icon="document-text-outline"
                            activeTab={activeTab}
                            onPress={() => router.back()} // Go back to overview
                        />
                        <TabButton
                            label="Notes"
                            icon="reader-outline"
                            activeTab={activeTab}
                            onPress={() => router.push({ pathname: "/jobs/notes", params: { jobId, jobTitle, jobCompany } })}
                        />
                        <TabButton
                            label="Video"
                            icon="videocam-outline"
                            activeTab={activeTab}
                            onPress={() => setActiveTab("Video")}
                        />
                    </View>
                </View>

                {/* Video Upload Section */}
                <View style={{ paddingHorizontal: 18, marginTop: 18, gap: 14 }}>
                    {/* Upload Card */}
                    <View
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 18,
                            padding: 16,
                            shadowColor: "#000",
                            shadowOpacity: 0.05,
                            shadowRadius: 10,
                            elevation: 2,
                        }}
                    >
                        <View
                            style={{
                                borderWidth: 2,
                                borderColor: "#2563EB",
                                borderRadius: 18,
                                paddingVertical: 28,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#F9FBFF",
                            }}
                        >
                            {/* Icon box */}
                            <View
                                style={{
                                    width: 54,
                                    height: 54,
                                    borderRadius: 16,
                                    backgroundColor: "#EAF2FF",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Ionicons name="cloud-upload-outline" size={26} color="#2563EB" />
                            </View>

                            <Text
                                style={{
                                    marginTop: 14,
                                    fontSize: 14,
                                    fontWeight: "800",
                                    color: "#111827",
                                }}
                            >
                                Upload Site Video
                            </Text>

                            <Text
                                style={{
                                    marginTop: 6,
                                    fontSize: 11,
                                    color: "#6B7280",
                                }}
                            >
                                Drag and drop or click to browse
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={{
                                    marginTop: 14,
                                    backgroundColor: "#2563EB",
                                    paddingHorizontal: 18,
                                    paddingVertical: 10,
                                    borderRadius: 16,
                                    shadowColor: "#2563EB",
                                    shadowOpacity: 0.25,
                                    shadowRadius: 10,
                                    elevation: 4,
                                }}
                                onPress={handleUpload}
                            >
                                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>
                                    Browse Files
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Empty Videos Card */}
                    <View
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 18,
                            paddingVertical: 22,
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: "#000",
                            shadowOpacity: 0.05,
                            shadowRadius: 10,
                            elevation: 2,
                        }}
                    >
                        <Ionicons name="videocam-outline" size={28} color="#64748B" />
                        <Text
                            style={{
                                marginTop: 10,
                                fontSize: 11,
                                color: "#6B7280",
                            }}
                        >
                            No videos uploaded yet
                        </Text>
                    </View>

                    {/* Sync Status */}
                    <View
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 16,
                            padding: 14,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            shadowColor: "#000",
                            shadowOpacity: 0.05,
                            shadowRadius: 10,
                            elevation: 2,
                        }}
                    >
                        <View
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: 14,
                                backgroundColor: "#E9FFF2",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Ionicons name="wifi-outline" size={18} color="#16A34A" />
                        </View>

                        <View>
                            <Text style={{ fontSize: 13, fontWeight: "800", color: "#111827" }}>
                                Sync Status
                            </Text>
                            <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>
                                Video upload sync pending implementation
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ------------------ Small Components ------------------ */

interface TabButtonProps {
    label: string;
    icon: any; // Using any for vector-icons name for simplicity, or keyof typeof Ionicons.glyphMap
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
                backgroundColor: isActive ? "#EEF4FF" : "#FFFFFF",
                shadowColor: isActive ? "transparent" : "#000",
                shadowOpacity: isActive ? 0 : 0.03,
                shadowRadius: 6,
                elevation: isActive ? 0 : 1,
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
                    fontWeight: "800",
                    color: isActive ? "#2563EB" : "#6B7280",
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}
