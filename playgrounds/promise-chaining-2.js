require('../src/db/mongoose');
const Task = require('../src/models/task');

// Remove a task by ID
// Task.findByIdAndDelete('61352b2c14b5e274eb2b2624')
//   .then(() => {
//     return Task.countDocuments({ completed: false });
//   })
//   .then((result) => console.log(result))
//   .catch((e) => console.log(e));

const deleteTaskAndCount = async (id, status) => {
  const deleteTask = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: status });

  return count;
};

deleteTaskAndCount('613651a1492b75136a0b7cec', false)
  .then((count) => {
    console.log(count);
  })
  .catch((e) => console.log(e));
