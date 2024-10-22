export const validateAge = (age) => {
  const errors = {};
  if (!age) {
    errors.age = "Age is required";
  } else if (isNaN(age)) {
    errors.age = "Age must be a number";
  } else if (age < 1 || age > 112) {
    errors.age = "Age must be between 1 and 100";
  }
  return errors;
};

export const validateName = (name) => {
  const errors = {};

  if (!name) {
    errors.name = "Name is required";
  } else if (name.length < 3) {
    errors.name = "Name must be at least 3 characters long";
  }
  return errors;
};
