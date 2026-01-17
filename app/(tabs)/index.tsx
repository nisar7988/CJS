import React, { useCallback, useState } from "react";
import { View, Text, Pressable, ScrollView, RefreshControl } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import JobCard from "../../src/components/jobs/JobCard";
import AppSearchBar from "../../src/components/common/AppSearchBar";
import HomeHeader from "../../src/components/home/HomeHeader";
import { JobsRepo } from "../../src/db/repositories/jobs.repo";
import { Job } from "../../src/types/models";
import { FAB } from "../../src/components/common/FAB";

export default function HomeScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      const data = await JobsRepo.getAll();
      setJobs(data);
    } catch (error) {
      console.error("Failed to load jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, [])
  );

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
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadJobs} />
        }
      >
        {/* Your Jobs */}
        <View className="px-6 pt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Your Jobs ({jobs.length})
            </Text>
            <Pressable onPress={() => router.push("/jobs")}>
              <Text className="text-blue-500 font-medium">View All</Text>
            </Pressable>
          </View>

          {/* Cards */}
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onPress={() => router.push(`/jobs/${job.id}`)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Plus Button */}
      <FAB onPress={() => router.push("/jobs/create")} />
    </View>
  );
}
