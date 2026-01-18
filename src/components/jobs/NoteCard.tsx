import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Note } from "../../types/models";

interface NoteCardProps {
    note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
    // const formattedDate = new Date(note.created_at).toLocaleString();

    // Calculate relative time (simple version)
    const getRelativeTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <View
            style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                overflow: "hidden",
                flexDirection: "row",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
            }}
        >
            {/* Left blue indicator */}
            <View style={{ width: 4, backgroundColor: "#2563EB" }} />

            <View style={{ padding: 14, flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>
                    {note.content}
                </Text>

                <View
                    style={{
                        marginTop: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={{ fontSize: 11, color: "#6B7280" }}>{getRelativeTime(note.created_at)}</Text>
                </View>
            </View>
        </View>
    );
}
