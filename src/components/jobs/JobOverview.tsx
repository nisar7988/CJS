import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Job } from "../../types/models";

interface JobOverviewProps {
    job: Job;
}

export default function JobOverview({ job }: JobOverviewProps) {
    return (
        <View style={{ paddingHorizontal: 18, marginTop: 18, gap: 14 }}>
            {/* Budget Card */}
            <View
                style={{
                    borderRadius: 18,
                    padding: 18,
                    backgroundColor: "#2563EB",
                    shadowColor: "#2563EB",
                    shadowOpacity: 0.25,
                    shadowRadius: 14,
                    elevation: 5,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: 10,
                            backgroundColor: job.status === 'Active' ? "#22C55E" : "#fbbf24",
                        }}
                    />
                    <Text style={{ color: job.status === 'Active' ? "#22C55E" : "#fbbf24", fontSize: 12, fontWeight: "700" }}>
                        {job.status}
                    </Text>
                </View>

                <Text style={{ marginTop: 18, color: "#DCE7FF", fontSize: 12 }}>
                    Salary / Budget
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ color: "#DCE7FF", fontSize: 16, fontWeight: "800" }}>
                        $
                    </Text>
                    <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900" }}>
                        {job.salary || "N/A"}
                    </Text>
                </View>
            </View>

            {/* Small Cards Row */}
            <View style={{ flexDirection: "row", gap: 12 }}>
                <MiniInfoCard
                    icon="location-outline"
                    iconBg="#E9FFF2"
                    iconColor="#16A34A"
                    label="Location"
                    value="Remote" // Location removed from model, using placeholder
                />
                <MiniInfoCard
                    icon="time-outline"
                    iconBg="#FFF6E6"
                    iconColor="#F59E0B"
                    label="Created"
                    value={new Date(job.created_at).toLocaleDateString()}
                />
            </View>

            {/* Client Information */}
            <SectionCard
                title="Client Information"
                icon="person-outline"
                iconColor="#2563EB"
            >
                <View
                    style={{
                        backgroundColor: "#F3F6FB",
                        padding: 14,
                        borderRadius: 14,
                    }}
                >
                    <Text style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>
                        {job.company}
                    </Text>
                </View>
            </SectionCard>

            {/* Description */}
            <SectionCard title="Description">
                <Text style={{ fontSize: 12, color: "#6B7280", lineHeight: 18 }}>
                    {job.description || "No description provided."}
                </Text>
            </SectionCard>

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
                        backgroundColor: job.synced ? "#E9FFF2" : "#FEF3C7", // Green or Yellow
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Ionicons name={job.synced ? "cloud-done-outline" : "cloud-offline-outline"} size={18} color={job.synced ? "#16A34A" : "#D97706"} />
                </View>

                <View>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: "#111827" }}>
                        {job.synced ? "Synced" : "Pending Sync"}
                    </Text>
                    <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>
                        {job.synced ? "All changes synced" : "Changes waiting for connection"}
                    </Text>
                </View>
            </View>
        </View>
    );
}

/* ------------------ Local Components ------------------ */

interface MiniInfoCardProps {
    icon: any;
    iconBg: string;
    iconColor: string;
    label: string;
    value: string;
}

function MiniInfoCard({ icon, iconBg, iconColor, label, value }: MiniInfoCardProps) {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 14,
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
                    backgroundColor: iconBg,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Ionicons name={icon} size={18} color={iconColor} />
            </View>

            <Text style={{ marginTop: 10, fontSize: 11, color: "#6B7280" }}>
                {label}
            </Text>
            <Text style={{ marginTop: 2, fontSize: 13, fontWeight: "800", color: "#111827" }}>
                {value}
            </Text>
        </View>
    );
}

interface SectionCardProps {
    title: string;
    icon?: any;
    iconColor?: string;
    children: React.ReactNode;
}

function SectionCard({ title, icon, iconColor, children }: SectionCardProps) {
    return (
        <View
            style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 14,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {icon ? (
                    <View
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            backgroundColor: "#EEF4FF",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Ionicons name={icon} size={18} color={iconColor} />
                    </View>
                ) : null}

                <Text style={{ fontSize: 14, fontWeight: "800", color: "#111827" }}>
                    {title}
                </Text>
            </View>

            <View style={{ marginTop: 12 }}>{children}</View>
        </View>
    );
}
