import { TabsTrigger } from "../ui/tabs"

const TabTriggerItem = ({ value, icon: Icon, activeTab }) => (
    <TabsTrigger
        value={value}
        className={`${activeTab === value ? 'bg-white dark:bg-gray-700 shadow-sm' : 'bg-transparent'} px-4 py-2 rounded-md transition-all duration-200`}
    >
        <Icon className="h-4 w-4 mr-2" />
        {value.charAt(0).toUpperCase() + value.slice(1)}
    </TabsTrigger>
)

export default TabTriggerItem