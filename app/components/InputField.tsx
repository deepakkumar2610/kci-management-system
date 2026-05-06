export default function InputField({ formik, name, placeholder }: any) {
  return (
    <div>
      <input
        name={name}
        placeholder={placeholder}
        onChange={formik.handleChange}
        value={formik.values[name]}
        className="w-full p-2 border rounded"
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-sm">{formik.errors[name]}</p>
      )}
    </div>
  );
}
