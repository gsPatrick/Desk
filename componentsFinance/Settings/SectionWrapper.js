// componentsFinance/Settings/SectionWrapper.js
const SectionWrapper = ({ title, description, children }) => (
  <div className="bg-black/5 dark:bg-white/5 p-6 rounded-2xl">
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <h3 className="text-lg font-bold text-light-text dark:text-dark-text">{title}</h3>
        {description && <p className="mt-1 text-sm text-light-subtle dark:text-dark-subtle">{description}</p>}
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        {children}
      </div>
    </div>
  </div>
);
export default SectionWrapper;