export default function Stepper({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="flex justify-between mb-6">
      {steps.map((label, index) => (
        <div key={index} className="flex-1 text-center">
          <div
            className={`p-2 rounded-full ${
              currentStep >= index ? "bg-[#f7931e] text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </div>
          <p className="text-xs mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
