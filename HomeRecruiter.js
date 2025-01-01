import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import CustomHeaderRecruiter from "./CustomHeaderRecruiter";

const { height } = Dimensions.get("window");

export default function HomeRecruiter({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [favoritedJobs, setFavoritedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [search, setSearch] = useState("");
  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://34.87.67.60/post-service/all-jobs?sortOrder=asc&searchQuery=" + search,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const result = await response.json();

      if (result?.data && Array.isArray(result.data)) {
        setAllJobs(result.data);
      } else {
        console.warn("No jobs found or invalid data format.");
        setAllJobs([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllJobs([]); 
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
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleFavoriteToggle = (jobTitle) => {
    setFavoritedJobs((prevState) =>
      prevState.includes(jobTitle)
        ? prevState.filter((job) => job !== jobTitle)
        : [...prevState, jobTitle]
    );
  };

  const handleJobDetail = (jobTitle) => {
    navigation.navigate("Job", { jobId: jobTitle.id });
  };

  const formatter = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <View style={styles.container}>
      <CustomHeaderRecruiter search={search} onSearchChange={(text) => {
        setSearch(text);
      }} onApplyFilter={fetchData}/>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.featuredJobsContainer}>
          <View style={styles.featuredJobsHeader}>
            <Text style={styles.featuredJobsTitle}>Công việc</Text>
          </View>

          {allJobs.length > 0 ? (
            allJobs.map((job, index) => (
              <TouchableOpacity
                key={index}
                style={styles.jobCard}
                onPress={() => handleJobDetail(job)}
              >
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.jobTypeContainer}>
                  <Text style={styles.jobType}>{job.employmentType}</Text>
                  <Text style={styles.salary}>{`Salary: $${formatter.format(
                    job.salary.min
                  )} - $${formatter.format(job.salary.max)}`}</Text>
                </View>

                <View style={styles.companyContainer}>
                  <Image
                    source={require("./assets/google.png")}
                    style={styles.companyLogo}
                  />
                  <Text style={styles.companyName}>
                    {job?.companyName ?? ""}
                  </Text>
                </View>

                <View style={styles.jobLocationContainer}>
                  <Ionicons
                    name="location-outline"
                    size={height * 0.018}
                    color="gray"
                  />
                  <Text style={styles.jobLocation}>{`${job.location.city} ${
                    job.location.address ?? ""
                  }`}</Text>
                </View>

                <TouchableOpacity
                  style={styles.favoriteIcon}
                  onPress={() => handleFavoriteToggle(job.title)}
                >
                  <FontAwesome
                    name="heart"
                    size={height * 0.022}
                    color={favoritedJobs.includes(job.title) ? "red" : "white"}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Không có việc làm để hiển thị.
            </Text>
          )}
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
  featuredJobsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  featuredJobsTitle: {
    fontWeight: "bold",
    fontSize: height * 0.03,
    marginLeft: 10,
    marginRight: 10,
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
    color: "gray",
  },
  favoriteIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});