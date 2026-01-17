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
    );
}
