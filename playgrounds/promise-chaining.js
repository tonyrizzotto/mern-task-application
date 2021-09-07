require('../src/db/mongoose');
const User = require('../src/models/user');

// 613520f970ddc56db0d0fd7e

// User.findByIdAndUpdate('6135274b3eb73e5cf7eff2b5', { age: 38 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 38 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => console.log(e));

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });

  return count;
};

updateAgeAndCount('6135274b3eb73e5cf7eff2b5', 2)
  .then((count) => console.log(count))
  .catch((e) => console.log(e));
