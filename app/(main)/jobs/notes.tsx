import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { NotesRepo } from "../../../src/db/repositories/notes.repo";
import { Note } from "../../../src/types/models";
import NoteCard from "../../../src/components/jobs/NoteCard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JobNotesScreen() {
    const router = useRouter();
    const { jobId, jobTitle, jobCompany } = useLocalSearchParams();

    const [activeTab, setActiveTab] = useState("Notes");
    const [noteText, setNoteText] = useState("");
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadNotes = async () => {
                if (!jobId) return;
                try {
                    const data = await NotesRepo.getByJobId(jobId as string);
                    setNotes(data);
                } catch (error) {
                    console.error("Failed to load notes", error);
                    Alert.alert("Error", "Failed to load notes");
                } finally {
                    setLoading(false);
                }
            };
            loadNotes();
        }, [jobId])
    );

    const handleAddNote = async () => {
        if (!noteText.trim() || !jobId) return;

        setIsSubmitting(true);
        try {
            await NotesRepo.create({
                job_id: jobId as string,
                content: noteText.trim()
            });
            setNoteText("");
            // Reload notes
            const data = await NotesRepo.getByJobId(jobId as string);
            setNotes(data);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to add note");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F9FF" }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
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
                                {jobTitle || "Job Notes"}
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
                                onPress={() => router.back()} // Basic navigation assumption
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
                                onPress={() => router.push({ pathname: "/jobs/video", params: { jobId, jobTitle, jobCompany } })}
                            />
                        </View>
                    </View>

                    {/* Content */}
                    <View style={{ paddingHorizontal: 18, marginTop: 18, gap: 14 }}>
                        {/* Add Note Card */}
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
                                    backgroundColor: "#F3F6FB",
                                    borderRadius: 16,
                                    paddingHorizontal: 12,
                                    paddingVertical: 12,
                                }}
                            >
                                <TextInput
                                    placeholder="Add a new note..."
                                    placeholderTextColor="#9CA3AF"
                                    value={noteText}
                                    onChangeText={setNoteText}
                                    multiline
                                    style={{
                                        minHeight: 70,
                                        fontSize: 13,
                                        color: "#111827",
                                        textAlignVertical: "top",
                                    }}
                                />
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={handleAddNote}
                                disabled={isSubmitting}
                                style={{
                                    marginTop: 12,
                                    height: 46,
                                    borderRadius: 16,
                                    backgroundColor: isSubmitting ? "#93C5FD" : "#2563EB",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    shadowColor: "#2563EB",
                                    shadowOpacity: 0.25,
                                    shadowRadius: 10,
                                    elevation: 4,
                                    flexDirection: "row",
                                    gap: 8,
                                }}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="add" size={18} color="#fff" />
                                        <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>
                                            Add Note
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Notes List */}
                        {loading ? (
                            <ActivityIndicator size="small" color="#2563EB" style={{ marginTop: 20 }} />
                        ) : notes.length === 0 ? (
                            <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 20 }}>
                                No notes yet.
                            </Text>
                        ) : (
                            notes.map((item) => (
                                <NoteCard key={item.id} note={item} />
                            ))
                        )}

                        {/* Sync Status - Static for now or we could derive from notes sync status */}
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
                                    Notes synced to local DB
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

/* ------------------ Components ------------------ */

function TabButton({ label, icon, activeTab, onPress }: { label: string, icon: any, activeTab: string, onPress: () => void }) {
    const isActive = activeTab === label;

    // Highlight Notes implicitly if activeTab is Notes, effectively
    // But since we are navigating, highlighting might be handled by the current page logic
    // For this screen, 'Notes' is always active logic-wise if we consider it a separate route for Notes
    // But the UI pattern seems to be persistent tabs.
    // Given we are on "Notes" screen, we should probably force highlighting "Notes"

    // Actually, refactoring the previous activeTab state in component:
    // const [activeTab, setActiveTab] = useState("Notes");
    // This is fine.

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

