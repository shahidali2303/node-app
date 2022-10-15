const mongoose = require("mongoose");

const { Schema } = mongoose;

// connection start
mongoose
  .connect("mongodb://0.0.0.0:27017/test")
  .then(() => console.log("Connected to database..."))
  .catch((err) => console.error("Failed to connect", err));
// connection end

//defining schema for database table --start
const courseSchema = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: { type: Boolean, required: true },
});
//defining schema for database table --end
const Course = new mongoose.model("Course", courseSchema);
//create
async function createCourse() {
  const course = new Course({
    name: "Javascript course",
    author: "Shahid",
    tags: ["mobile & ios", "fullStack"],
    isPublished: true,
  });

  const result = await course.save();
  console.log(result);
}
createCourse();
async function getCourses() {
  const course = await Course.find({ author: "Mosh" });
  console.log(course);
}
// getCourses();
//update start
async function updateCourse(id) {
  const course = await Course.findById(id);
  if (!course) return;
  course.author = "Wazid";

  const result = await course.save();
  console.log(result);
}
// updateCourse("6343c3599553badfe94e461a");
//update end

//delete start
async function deleteCourse(id) {
  const result = await Course.deleteOne({ _id: id });
  console.log(result);
}
// deleteCourse("6343c3599553badfe94e461a");
//delete end
