import { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon, 
  BellIcon, 
  DocumentTextIcon,
  CalendarIcon,
  InboxIcon,
  ChevronDownIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const SidebarSubmenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedItems, setExpandedItems] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Sample menu items with submenus
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
      path: '/dashboard'
    },
    {
      id: 'users',
      name: 'Users',
      icon: <UserGroupIcon className="w-5 h-5" />,
      submenu: [
        { id: 'all-users', name: 'All Users', path: '/users' },
        { id: 'new-user', name: 'New User', path: '/users/new' },
        { id: 'roles', name: 'Roles & Permissions', path: '/users/roles' }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: <ChartBarIcon className="w-5 h-5" />,
      path: '/analytics'
    },
    {
      id: 'content',
      name: 'Content',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      submenu: [
        { id: 'posts', name: 'Posts', path: '/content/posts' },
        { id: 'media', name: 'Media Library', path: '/content/media' },
        { id: 'categories', name: 'Categories', path: '/content/categories' }
      ]
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: <CalendarIcon className="w-5 h-5" />,
      path: '/calendar'
    },
    {
      id: 'inbox',
      name: 'Inbox',
      icon: <InboxIcon className="w-5 h-5" />,
      path: '/inbox'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: <BellIcon className="w-5 h-5" />,
      path: '/notifications'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <CogIcon className="w-5 h-5" />,
      path: '/settings'
    }
  ];

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleItemClick = (itemId, hasSubmenu) => {
    if (hasSubmenu) {
      toggleExpanded(itemId);
    } else {
      setActiveItem(itemId);
      if (isMobile) {
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white shadow-lg md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:flex md:flex-shrink-0`}
        style={{ width: isOpen ? '280px' : '0px' }}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo section */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">AdminPanel</h1>
            </div>
            {!isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronDownIcon className="w-5 h-5 transform rotate-90" />
              </button>
            )}
          </div>

          {/* Navigation items */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleItemClick(item.id, item.submenu)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    activeItem === item.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={activeItem === item.id ? 'text-indigo-600' : 'text-gray-500'}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.submenu && (
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedItems[item.id] ? 'transform rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Submenu items */}
                {item.submenu && expandedItems[item.id] && (
                  <div className="mt-1 ml-4 pl-6 border-l-2 border-gray-200 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setActiveItem(subItem.id);
                          if (isMobile) setIsOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-md transition-colors duration-200 ${
                          activeItem === subItem.id
                            ? 'bg-indigo-100 text-indigo-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {subItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-medium">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">admin@example.com</p>
              </div>
              <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                <CogIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className={`flex-1 transition-all duration-300 ${isOpen && !isMobile ? 'md:ml-64' : ''}`}>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
            <p className="text-gray-600">
              Welcome to your admin dashboard. Here you can manage all aspects of your application.
            </p>
            
            {/* Sample stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {[
                { title: 'Total Users', value: '2,842', change: '+12%', color: 'bg-blue-500' },
                { title: 'Revenue', value: '$24,751', change: '+8.2%', color: 'bg-green-500' },
                { title: 'Conversion Rate', value: '4.73%', change: '+1.5%', color: 'bg-purple-500' },
                { title: 'Sessions', value: '12,938', change: '-2.4%', color: 'bg-red-500' }
              ].map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                      <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                      <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} from last week
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SidebarSubmenu;