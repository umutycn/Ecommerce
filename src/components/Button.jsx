export default function Button({ children, variant = "primary", ...props }) {
  const baseClasses = "rounded-lg px-4 py-2 text-sm font-semibold transition";
  const variants = {
    primary: "bg-black text-white hover:opacity-90",
    secondary: "border border-black bg-white text-black hover:bg-gray-100",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
