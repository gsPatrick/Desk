// componentsFinance/Settings/SettingsToggle.js
import { Switch } from '@headlessui/react';

const SettingsToggle = ({ label, description, enabled, setEnabled }) => (
  <Switch.Group as="div" className="flex items-center justify-between py-4">
    <span className="flex-grow flex flex-col">
      <Switch.Label as="span" className="font-semibold text-light-text dark:text-dark-text" passive>{label}</Switch.Label>
      <Switch.Description as="span" className="text-sm text-light-subtle dark:text-dark-subtle">{description}</Switch.Description>
    </span>
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${enabled ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-700'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
    >
      <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
    </Switch>
  </Switch.Group>
);
export default SettingsToggle;