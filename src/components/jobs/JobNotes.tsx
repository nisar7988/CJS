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
        <View className="px-[18px] mt-[18px] gap-[14px]">
            {/* Add Note Card */}
            <View className="bg-white rounded-[18px] p-4 shadow-black/5 shadow-sm elevation-2">
                <View className="bg-[#F3F6FB] rounded-2xl px-3 py-3">
                    <TextInput
                        placeholder="Add a new note..."
                        placeholderTextColor="#9CA3AF"
                        value={noteText}
                        onChangeText={setNoteText}
                        multiline
                        className="min-h-[70px] text-[13px] text-gray-900"
                        style={{ textAlignVertical: "top" }}
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleAddNote}
                    disabled={isSubmitting}
                    className={`mt-3 h-[46px] rounded-2xl items-center justify-center flex-row gap-2 shadow-primary/25 shadow-md elevation-4 ${isSubmitting ? "bg-blue-300" : "bg-primary"
                        }`}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="add" size={18} color="#fff" />
                            <Text className="text-white text-[13px] font-extrabold">
                                Add Note
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Notes List */}
            {loading ? (
                <ActivityIndicator size="small" color="#2563EB" className="mt-5" />
            ) : notes.length === 0 ? (
                <Text className="text-center text-gray-500 mt-5">
                    No notes yet.
                </Text>
            ) : (
                notes.map((item) => (
                    <NoteCard key={item.id} note={item} />
                ))
            )}

            {/* Sync Status - Static for now or we could derive from notes sync status */}
            <View className="bg-white rounded-2xl p-[14px] flex-row items-center gap-2.5 shadow-black/5 shadow-sm elevation-2">
                <View className="w-[34px] h-[34px] rounded-[14px] bg-[#E9FFF2] items-center justify-center">
                    <Ionicons name="wifi-outline" size={18} color="#16A34A" />
                </View>

                <View>
                    <Text className="text-[13px] font-extrabold text-gray-900">
                        Sync Status
                    </Text>
                    <Text className="text-[11px] text-gray-500 mt-px">
                        Notes synced to local DB
                    </Text>
                </View>
            </View>
        </View>
    );
}
