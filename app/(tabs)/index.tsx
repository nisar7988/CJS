import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import JobCard from "../../src/components/jobs/JobCard";
import AppSearchBar from "../../src/components/common/AppSearchBar";
import HomeHeader from "../../src/components/home/HomeHeader";

export default function HomeScreen() {
  const jobs = [
    {
      title: "Kitchen Renovation",
      client: "Sarah Johnson",
      amount: "$45,000",
      location: "San Francisco",
      date: "Started Dec 15, 2024",
      status: "Active",
    },
    {
      title: "Bathroom Remodel",
      client: "Michael Chen",
      amount: "$28,000",
      location: "Oakland",
      date: "Started Jan 5, 2025",
      status: "Pending",
    },
    {
      title: "Deck Construction",
      client: "Emily Rodriguez",
      amount: "$15,000",
      location: "Berkeley",
      date: "Started Nov 1, 2024",
      status: "Completed",
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-14 pb-5 bg-white">
        <HomeHeader userName="Abhi" />

        {/* Search Bar */}
        <AppSearchBar
          containerStyle="mt-4"
          placeholder="Search jobs..."
        />
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Your Jobs */}
        <View className="px-6 pt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Your Jobs ({jobs.length})
            </Text>
            <Pressable>
              <Text className="text-blue-500 font-medium">View All</Text>
            </Pressable>
          </View>

          {/* Cards */}
          {jobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </View>
      </ScrollView>

      {/* Floating Plus Button */}
      <Pressable
        className="absolute right-6 bottom-8 w-16 h-16 rounded-full bg-blue-500 items-center justify-center"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        }}
        onPress={() => console.log("Add Job")}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>
    </View>
  );
}
