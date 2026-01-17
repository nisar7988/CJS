import React, { useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { JobsRepo } from "../../../src/db/repositories/jobs.repo";

export default function CreateJobScreen() {
    const router = useRouter();

    const [jobTitle, setJobTitle] = useState("");
    const [description, setDescription] = useState("");
    const [clientName, setClientName] = useState(""); // Maps to company
    const [city, setCity] = useState(""); // Not in model directly, maybe prepend to description or ignore?
    const [budget, setBudget] = useState(""); // Maps to salary
    const [startDate, setStartDate] = useState(""); // Not in model
    const [status, setStatus] = useState("Pending");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async () => {
        if (!jobTitle || !clientName) {
            Alert.alert("Error", "Please fill in all required fields (Job Title, Client Name)");
            return;
        }

        setIsSubmitting(true);
        try {
            await JobsRepo.create({
                title: jobTitle,
                company: clientName,
                status: status || "Pending",
                salary: budget,
                description: description + (city ? `\nLocation: ${city}` : "") + (startDate ? `\nStart Date: ${startDate}` : ""),
            });
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to create job");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F9FF" }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ paddingHorizontal: 18, paddingTop: 10 }}>
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

                    <Text
                        style={{
                            marginTop: 16,
                            fontSize: 22,
                            fontWeight: "700",
                            color: "#111827",
                            textAlign: "center",
                        }}
                    >
                        Create New Job
                    </Text>

                    <Text
                        style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: "#6B7280",
                            textAlign: "center",
                        }}
                    >
                        Fill in the details below
                    </Text>
                </View>

                {/* Content */}
                <View style={{ paddingHorizontal: 18, marginTop: 18, gap: 14 }}>
                    {/* Card 1: Job Details */}
                    <Card
                        title="Job Details"
                        icon={<Ionicons name="briefcase-outline" size={18} color="#2563EB" />}
                    >
                        <FieldLabel label="Job Title" required />
                        <Input
                            placeholder="e.g., Kitchen Renovation"
                            value={jobTitle}
                            onChangeText={setJobTitle}
                        />

                        <FieldLabel label="Description" />
                        <Input
                            placeholder="Add job description..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            height={90}
                            alignTop
                        />
                    </Card>

                    {/* Card 2: Client Info */}
                    <Card
                        title="Client Info"
                        icon={<Ionicons name="person-outline" size={18} color="#16A34A" />}
                    >
                        <FieldLabel label="Client Name" required />
                        <Input
                            placeholder="e.g., John Smith"
                            value={clientName}
                            onChangeText={setClientName}
                        />

                        <FieldLabel label="City (Optional)" />
                        <Input
                            leftIcon={<Ionicons name="location-outline" size={18} color="#6B7280" />}
                            placeholder="e.g., San Francisco"
                            value={city}
                            onChangeText={setCity}
                        />
                    </Card>

                    {/* Card 3: Budget & Timeline */}
                    <Card
                        title="Budget & Timeline"
                        icon={<Ionicons name="cash-outline" size={18} color="#F59E0B" />}
                    >
                        <FieldLabel label="Budget (USD)" />
                        <Input
                            leftIcon={<Text style={{ color: "#6B7280", fontSize: 16 }}>$</Text>}
                            placeholder="0"
                            keyboardType="numeric"
                            value={budget}
                            onChangeText={setBudget}
                        />

                        <FieldLabel label="Start Date (Optional)" />
                        <Input
                            leftIcon={<Ionicons name="calendar-outline" size={18} color="#6B7280" />}
                            placeholder="Select date"
                            value={startDate}
                            onChangeText={setStartDate}
                        />

                        <FieldLabel label="Status" />
                        <Input
                            placeholder="e.g., Pending"
                            value={status}
                            onChangeText={setStatus}
                        />
                    </Card>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: 16,
                    backgroundColor: "#F6F9FF",
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    disabled={isSubmitting}
                    style={{
                        height: 54,
                        borderRadius: 14,
                        backgroundColor: isSubmitting ? "#93C5FD" : "#2563EB",
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: "#2563EB",
                        shadowOpacity: 0.25,
                        shadowRadius: 12,
                        elevation: 4,
                    }}
                    onPress={handleCreate}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>
                            Create Job
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

/* -------------------- Small Components -------------------- */

interface CardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

function Card({ title, icon, children }: CardProps) {
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
            {/* Card header */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
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
                    {icon}
                </View>
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827" }}>
                    {title}
                </Text>
            </View>

            {/* Card content */}
            <View style={{ marginTop: 12, gap: 10 }}>{children}</View>
        </View>
    );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
    return (
        <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
            {label} {required ? <Text style={{ color: "#EF4444" }}>*</Text> : null}
        </Text>
    );
}

interface InputProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    leftIcon?: React.ReactNode;
    keyboardType?: any;
    multiline?: boolean;
    height?: number;
    alignTop?: boolean;
}

function Input({
    placeholder,
    value,
    onChangeText,
    leftIcon,
    keyboardType,
    multiline,
    height = 46,
    alignTop,
}: InputProps) {
    return (
        <View
            style={{
                height,
                backgroundColor: "#F3F6FB",
                borderRadius: 14,
                paddingHorizontal: 12,
                flexDirection: "row",
                alignItems: alignTop ? "flex-start" : "center",
                gap: 8,
                paddingTop: alignTop ? 12 : 0,
            }}
        >
            {leftIcon ? <View style={{ marginTop: alignTop ? 2 : 0 }}>{leftIcon}</View> : null}

            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                multiline={multiline}
                style={{
                    flex: 1,
                    fontSize: 14,
                    color: "#111827",
                    textAlignVertical: multiline ? "top" : "center",
                }}
            />
        </View>
    );
}
