// componentsFinance/Settings/SettingsInput.js
const SettingsInput = ({ label, type, value, placeholder, disabled = false }) => (
  <div>
    <label className="block text-sm font-medium text-light-subtle dark:text-dark-subtle mb-1">{label}</label>
    <input
      type={type}
      defaultValue={value}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full p-2 bg-black/5 dark:bg-white/5 rounded-md border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
  </div>
);
export default SettingsInput;