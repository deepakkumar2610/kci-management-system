/* eslint-disable @typescript-eslint/no-explicit-any */
export default function SelectField({
  formik,
  name,
  options,
  labelKey = "name",
}: any) {
  return (
    <select
      name={name}
      onChange={formik.handleChange}
      value={formik.values[name]}
      className="w-full p-2 border rounded"
    >
      <option value="">Select</option>
      {options.map((opt: any) => (
        <option key={opt._id} value={opt._id}>
          {opt[labelKey]}
        </option>
      ))}
    </select>
  );
}
