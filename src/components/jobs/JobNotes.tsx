import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NotesRepo } from "../../db/repositories/notes.repo";
import { Note } from "../../types/models";
import NoteCard from "./NoteCard";

interface JobNotesProps {
    jobId: string;
}

export default function JobNotes({ jobId }: JobNotesProps) {
    const [noteText, setNoteText] = useState("");
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadNotes = useCallback(async () => {
        if (!jobId) return;
        try {
            const data = await NotesRepo.getByJobId(jobId);
            setNotes(data);
        } catch (error) {
            console.error("Failed to load notes", error);
            Alert.alert("Error", "Failed to load notes");
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    const handleAddNote = async () => {
        if (!noteText.trim() || !jobId) return;

        setIsSubmitting(true);
        try {
            await NotesRepo.create({
                job_id: jobId,
                content: noteText.trim()
            });
            setNoteText("");
            loadNotes();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to add note");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
    );
}
