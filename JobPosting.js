import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomHeaderRecruiter from "./CustomHeaderRecruiter";
import Global from "./Global";
import moment from "moment";

export const categories = [
  { id: "1", name: "Graphics & Design" },
  { id: "2", name: "Code & Programming" },
  { id: "3", name: "Digital Marketing" },
  { id: "4", name: "Video & Animation" },
  { id: "5", name: "Writing & Translation" },
  { id: "6", name: "Music & Audio" },
  { id: "7", name: "Business & Finance" },
  { id: "8", name: "Lifestyle & Wellness" },
  { id: "9", name: "Photography" },
  { id: "10", name: "IT & Networking" },
  { id: "11", name: "Engineering" },
  { id: "12", name: "Education & Training" },
  { id: "13", name: "Consulting" },
];

const { height } = Dimensions.get("window");

export default function JobPosting({ navigation, route }) {
  const job = route.params?.job;
  const [jobTitle, setJobTitle] = useState(job?.title ?? "");
  const [jobLevel, setJobLevel] = useState(job?.education ?? "Intern");
  const [jobType, setJobType] = useState(job?.employmentType ?? "Full-time");
  const [city, setCity] = useState(job?.location?.city ?? "");
  const [address, setAddress] = useState(job?.location?.address ?? "");
  const [salaryMin, setSalaryMin] = useState(
    job?.salary?.min?.toString() ?? ""
  );
  const [salaryMax, setSalaryMax] = useState(
    job?.salary?.max?.toString() ?? ""
  );
  const [currency, setCurrency] = useState(job?.salary?.currency ?? "VND");
  const [applicationDate, setApplicationDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(
    job?.dueDate ? moment(parseInt(job?.dueDate)).toDate() : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState("");
  const [description, setDescription] = useState(job?.description ?? "");
  const [requirements, setRequirements] = useState(
    job?.requirements ? job?.requirements?.toString() : ""
  );
  const [category, setCategory] = useState(job?.category?.id ?? "1"); 

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  const handleConfirm = () => {
    const postData = {
      title: jobTitle,
      category: {
        id: category,
        name: categories.find((cat) => cat.id === category)?.name, 
      },
      company: null,
      postedBy: null,
      description: description,
      requirements: [requirements],
      salary: {
        min: salaryMin,
        max: salaryMax,
        currency: currency,
      },
      location: {
        city: city,
        address: address,
      },
      employmentType: jobType,
      postDate: getTodayDate(),
      dueDate: dueDate.getTime(),
      status: "Open",
      candidates: [],
    };

    updatePost(postData);
  };

  const showPicker = (dateType) => {
    setSelectedDateType(dateType);
    setShowDatePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || applicationDate;
    setShowDatePicker(false);

    if (selectedDateType === "applicationDate") {
      setApplicationDate(currentDate);
    } else if (selectedDateType === "dueDate") {
      setDueDate(currentDate);
    }
  };

  const updatePost = async (postData) => {
    console.log("postData.requirements", postData.requirements);
    try {
      const response = await fetch(
        job
          ? "http://34.87.67.60/post-service/job/update"
          : "http://34.87.67.60/post-service/job/add",
        {
          method: job ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Global.token,
          },
          body: JSON.stringify({
            id: job?.id ?? null,
            title: postData.title,
            category: {
              id: postData.category.id,
              name: postData.category.name,
            },
            description: postData.description,
            dueDate: postData.dueDate.toString(),
            education: jobLevel,
            employmentType: jobType,
            company: null,
            location: {
              city: postData.location.city,
              address: postData.location.address,
            },
            postDate: moment().valueOf(),
            postedBy: null,
            requirements: postData.requirements?.toString()?.includes(",")
              ? postData.requirements?.toString()?.split(",")
              : [postData.requirements .toString()],
            salary: {
              min: postData.salary.min,
              max: postData.salary.max,
              currency: postData.salary.currency,
            },
            status: "open",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Job post created:", responseData);

      setJobTitle("");
      setJobLevel("Intern");
      setJobType("Full-time");
      setCity("");
      setAddress("");
      setSalaryMin("");
      setSalaryMax("");
      setCurrency("VND");
      setApplicationDate(new Date());
      setDueDate(new Date());
      setDescription("");
      setRequirements("");

      Alert.alert(
        "Success",
        job
          ? "Cập nhật tin tuyển dụng thành công"
          : "Đăng tin tuyển dụng thành công!"
      );
      navigation.navigate("HomeStack");
    } catch (error) {
      console.error("Error creating job post:", error);
      Alert.alert("Error", "Có lỗi xảy ra khi đăng tin tuyển dụng.");
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeaderRecruiter
        search={""}
        onSearchChange={() => {}}
        onApplyFilter={() => {}}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.featuredJobsContainer}>
          <Text style={styles.featuredJobsTitle}>
            {job ? "Chỉnh sửa bài đăng" : "Đăng tin tuyển dụng"}
          </Text>
          <Text style={styles.label}>
            Tên công việc <Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên công việc"
            value={jobTitle}
            onChangeText={setJobTitle}
          />

          <Text style={styles.label}>Thể loại công việc</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              {categories.map((cat) => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>
            Trình độ <Text style={styles.asterisk}>*</Text>
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={jobLevel}
              style={styles.picker}
              onValueChange={(itemValue) => setJobLevel(itemValue)}
            >
              <Picker.Item label="Intern" value="Intern" />
              <Picker.Item label="Junior" value="Junior" />
              <Picker.Item label="Mid-level" value="Mid-level" />
              <Picker.Item label="Senior" value="Senior" />
              <Picker.Item label="Manager" value="Manager" />
            </Picker>
          </View>

          <Text style={styles.label}>
            Loại công việc <Text style={styles.asterisk}>*</Text>
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={jobType}
              style={styles.picker}
              onValueChange={(itemValue) => setJobType(itemValue)}
            >
              <Picker.Item label="Full-time" value="Full-time" />
              <Picker.Item label="Part-time" value="Part-time" />
              <Picker.Item label="Contract" value="Contract" />
              <Picker.Item label="Internship" value="Internship" />
            </Picker>
          </View>

          <Text style={styles.label}>
            Thành phố / Địa chỉ <Text style={styles.asterisk}>*</Text>
          </Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder="Thành phố"
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder="Địa chỉ"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <Text style={styles.label}>Mức lương</Text>
          <View style={styles.salaryContainer}>
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder="Từ"
              value={salaryMin}
              onChangeText={(text) => {
                console.log("xxxxxx", text);
                setSalaryMin(text);
              }}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder="Đến"
              value={salaryMax}
              onChangeText={(text) => setSalaryMax(text)}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Tiền tệ</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={currency}
              style={styles.picker}
              onValueChange={(itemValue) => setCurrency(itemValue)}
            >
              <Picker.Item label="VND" value="VND" />
              <Picker.Item label="USD" value="USD" />
            </Picker>
          </View>

          <Text style={styles.label}>
            Ngày nhận hồ sơ <Text style={styles.asterisk}>*</Text>
          </Text>
          <TouchableOpacity onPress={() => showPicker("applicationDate")}>
            <Text style={styles.dateText}>
              {applicationDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>
            Hạn cuối <Text style={styles.asterisk}>*</Text>
          </Text>
          <TouchableOpacity onPress={() => showPicker("dueDate")}>
            <Text style={styles.dateText}>{dueDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={
                selectedDateType === "applicationDate"
                  ? applicationDate
                  : dueDate
              }
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <Text style={styles.label}>Mô tả công việc</Text>
          <TextInput
            style={styles.input}
            placeholder="Mô tả công việc"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Yêu cầu</Text>
          <TextInput
            style={styles.input}
            placeholder="Yêu cầu"
            value={requirements}
            onChangeText={setRequirements}
            multiline
          />

          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>
              {job ? "Cập nhật" : "Đăng tin"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  featuredJobsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  featuredJobsTitle: {
    fontSize: height * 0.03,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  asterisk: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  picker: {
    height: 50,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  salaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  salaryInput: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#222FA0",
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});