import { XMarkIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import NotificationBodyRightDrawer from "../features/common/components/NotificationBodyRightDrawer";
import CalendarEventsBodyRightDrawer from "../features/calendar/CalendarEventsBodyRightDrawer";
import { closeRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";

function RightSidebar() {
  const { isOpen, bodyType, extraObject, header } = useSelector(
    (state) => state.rightDrawer
  );
  const dispatch = useDispatch();

  const close = () => {
    dispatch(closeRightDrawer());
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-gray-900 bg-opacity-40 transition-all duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none delay-300"
      }`}
    >
      {/* Overlay (click to close) */}
      <div
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={close}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-sm bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-semibold text-gray-800">
              {header || "پیام‌ها"}
            </h2>
            <button
              onClick={close}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {
              {
                [RIGHT_DRAWER_TYPES.NOTIFICATION]: (
                  <NotificationBodyRightDrawer
                    {...extraObject}
                    closeRightDrawer={close}
                  />
                ),
                [RIGHT_DRAWER_TYPES.CALENDAR_EVENTS]: (
                  <CalendarEventsBodyRightDrawer
                    {...extraObject}
                    closeRightDrawer={close}
                  />
                ),
                [RIGHT_DRAWER_TYPES.DEFAULT]: <div />,
              }[bodyType]
            }
          </div>
        </div>
      </aside>
    </div>
  );
}

export default RightSidebar;