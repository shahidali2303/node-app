const mongoose = require("mongoose");
// const { Schema } = mongoose;
mongoose
  .connect("mongodb://0.0.0.0:27017/playground")
  .then(() => console.log("Connect to mongodb..."))
  .catch((err) => console.error("Could not connect to mongodb", err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = new mongoose.model("Course", courseSchema);
//create
async function createCourse() {
  const course = new Course({
    name: "React Native course",
    author: "Shahid",
    tags: ["mobile & ios", "fullStack"],
    isPublished: true,
  });

  const result = await course.save();
  console.log(result);
}
//read
async function getCourses() {
  const courses = await Course.find();
  console.log(courses);
}
getCourses();
