export const Input = ({ formik, name, ...props }: any) => (
  <div>
    <input
      name={name}
      onChange={formik.handleChange}
      value={formik.values[name]}
      className="w-full p-2 border rounded"
      {...props}
    />
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-sm">{formik.errors[name]}</p>
    )}
  </div>
);

export const Select = ({ formik, name, options }: any) => (
  <select
    name={name}
    onChange={formik.handleChange}
    value={formik.values[name]}
    className="w-full p-2 border rounded"
  >
    <option value="">Select</option>
    {options.map((opt: string) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);