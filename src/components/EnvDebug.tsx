const EnvDebug = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-xs">
      <h3 className="font-bold mb-2">Environment Variables:</h3>
      <pre>
        VITE_API_BASE_URL: {import.meta.env.VITE_API_BASE_URL || "NOT SET"}
      </pre>
      <pre>MODE: {import.meta.env.MODE}</pre>
      <pre>DEV: {import.meta.env.DEV ? "true" : "false"}</pre>
    </div>
  );
};

export default EnvDebug;
