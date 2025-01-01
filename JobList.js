import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import CustomHeader from "./CustomHeader";
import { useFocusEffect } from "@react-navigation/native";
import Global from "./Global";

const { height } = Dimensions.get("window");

export default function JobList({ navigation }) {
  const [favoritedJobs, setFavoritedJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [jobList, setJobList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://34.87.67.60/post-service/jobs-applied", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: Global.token,
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const result = await response.json();
      if (result?.data && Array.isArray(result.data)) {
        setJobList(result.data); 
      } else {
        console.warn("No jobs found or invalid data format.");
        setJobList([]); 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setJobList([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleFavoriteToggle = (jobId) => {
    setFavoritedJobs((prevState) =>
      prevState.includes(jobId)
        ? prevState.filter((job) => job !== jobId)
        : [...prevState, jobId]
    );
  };

  const handleJobDetail = (jobId) => {
    navigation.navigate("Job", { jobId: jobId });
  };
  const formatter = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return (
    <View style={styles.container}>
      <CustomHeader
        search={search}
        onSearchChange={(text) => {
          setSearch(text);
        }}
        onApplyFilter={() => {}}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.featuredJobsContainer}>
          <Text style={styles.featuredJobsTitle}>Công việc đã ứng tuyển</Text>

          {/* Job Cards from API */}
          {jobList.map((job, index) => (
            <TouchableOpacity
              key={index}
              style={styles.jobCard}
              onPress={() => handleJobDetail(job.id)}
            >
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.jobTypeContainer}>
                <Text style={styles.jobType}>
                  {job?.employmentType || "INTERNSHIP"}
                </Text>
                <Text style={styles.salary}>
                  {`Salary: $${formatter.format(
                    job?.salary?.min?.toString()
                  )} - $${formatter.format(job?.salary?.max?.toString())}`}
                </Text>
              </View>

              <View style={styles.companyContainer}>
                <Image
                  source={require("./assets/google.png")}
                  style={styles.companyLogo}
                />
                <Text style={styles.companyName}>{job?.companyName ?? ""}</Text>
              </View>

              <View style={styles.jobLocationContainer}>
                <Ionicons
                  name="location-outline"
                  size={height * 0.018}
                  color="gray"
                />
                <Text style={styles.jobLocation}>{`${
                  job?.location?.city ?? "-"
                } ${job?.location?.address ?? ""}`}</Text>
              </View>

              <TouchableOpacity
                style={styles.favoriteIcon}
                onPress={() => handleFavoriteToggle(job.id)}
              >
                <FontAwesome
                  name="heart"
                  size={height * 0.022}
                  color={favoritedJobs.includes(job.id) ? "red" : "white"}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  featuredJobsContainer: {
    marginTop: height * 0.01,
  },
  featuredJobsTitle: {
    fontWeight: "bold",
    fontSize: height * 0.03,
    marginBottom: 10,
    marginLeft: 10,
  },
  jobCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15, 
    marginVertical: 10, 
    marginHorizontal: 15,
    backgroundColor: "#ffffff", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  jobTitle: {
    fontSize: height * 0.022,
    fontWeight: "bold",
  },
  jobTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  jobType: {
    color: "gray",
  },
  salary: {
    color: "green",
  },
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  companyLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  companyName: {
    fontWeight: "bold",
  },
  jobLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  jobLocation: {
    marginLeft: 5,
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});