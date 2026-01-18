import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Job } from "../../types/models";

interface JobOverviewProps {
    job: Job;
}

export default function JobOverview({ job }: JobOverviewProps) {
    return (
        <View className="px-[18px] mt-[18px] gap-[14px]">
            {/* Budget Card */}
            <View className="rounded-[18px] p-[18px] bg-primary shadow-primary/25 shadow-md elevation-5">
                <View className="flex-row items-center gap-2">
                    <View
                        className="w-2.5 h-2.5 rounded-[10px] bg-[#22C55E]"
                    />
                    <Text
                        className="text-xs font-bold text-[#22C55E]"
                    >
                        Active
                    </Text>
                </View>

                <Text className="mt-[18px] text-[#DCE7FF] text-xs">
                    Salary / Budget
                </Text>

                <View className="flex-row items-center gap-2">
                    <Text className="text-[#DCE7FF] text-base font-extrabold">
                        $
                    </Text>
                    <Text className="text-white text-[22px] font-black">
                        {job.budget?.toLocaleString() || "N/A"}
                    </Text>
                </View>
            </View>

            {/* Small Cards Row */}
            <View className="flex-row gap-3">
                <MiniInfoCard
                    icon="location-outline"
                    iconBg="bg-[#E9FFF2]"
                    iconColor="#16A34A"
                    label="Location"
                    value={job.location || "Remote"}
                />
                <MiniInfoCard
                    icon="time-outline"
                    iconBg="bg-[#FFF6E6]"
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
                <View className="bg-[#F3F6FB] p-[14px] rounded-[14px]">
                    <Text className="text-[13px] font-semibold text-gray-900">
                        Client Name
                    </Text>
                </View>
            </SectionCard>

            {/* Description */}
            <SectionCard title="Description">
                <Text className="text-xs text-gray-500 leading-[18px]">
                    {job.description || "No description provided."}
                </Text>
            </SectionCard>

            {/* Sync Status */}
            <View className="bg-white rounded-2xl p-[14px] flex-row items-center gap-2.5 shadow-black/5 shadow-sm elevation-2">
                <View
                    className={`w-[34px] h-[34px] rounded-[14px] items-center justify-center ${job.synced ? "bg-[#E9FFF2]" : "bg-[#FEF3C7]" // Green or Yellow
                        }`}
                >
                    <Ionicons name={job.synced ? "cloud-done-outline" : "cloud-offline-outline"} size={18} color={job.synced ? "#16A34A" : "#D97706"} />
                </View>

                <View>
                    <Text className="text-[13px] font-bold text-gray-900">
                        {job.synced ? "Synced" : "Pending Sync"}
                    </Text>
                    <Text className="text-[11px] text-gray-500 mt-px">
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
    iconBg: string; // Expecting a Tailwind class now, e.g., "bg-[#E9FFF2]"
    iconColor: string;
    label: string;
    value: string;
}

function MiniInfoCard({ icon, iconBg, iconColor, label, value }: MiniInfoCardProps) {
    return (
        <View className="flex-1 bg-white rounded-2xl p-[14px] shadow-black/5 shadow-sm elevation-2">
            <View className={`w-[34px] h-[34px] rounded-[14px] items-center justify-center ${iconBg}`}>
                <Ionicons name={icon} size={18} color={iconColor} />
            </View>

            <Text className="mt-2.5 text-[11px] text-gray-500">
                {label}
            </Text>
            <Text className="mt-0.5 text-[13px] font-extrabold text-gray-900">
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
        <View className="bg-white rounded-2xl p-[14px] shadow-black/5 shadow-sm elevation-2">
            <View className="flex-row items-center gap-2">
                {icon ? (
                    <View className="w-8 h-8 rounded-[10px] bg-[#EEF4FF] items-center justify-center">
                        <Ionicons name={icon} size={18} color={iconColor} />
                    </View>
                ) : null}

                <Text className="text-sm font-extrabold text-gray-900">
                    {title}
                </Text>
            </View>

            <View className="mt-3">{children}</View>
        </View>
    );
}
