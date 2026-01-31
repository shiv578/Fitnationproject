function getBMICategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi >= 18.5 && bmi < 25) return "Fit";
  if (bmi >= 25 && bmi < 30) return "Overweight";
  return "Obese";
}

module.exports = { getBMICategory };
