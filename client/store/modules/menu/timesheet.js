import lazyLoading from './lazyLoading'

export default {
  name: 'Timesheet',
  meta: {
    icon: 'fa-calendar',
    expanded: false
  },

  children: [
    {
      name: 'Create New',
      path: '/timesheet/new',
      meta: {
        label: 'Create New'
      },
      component: lazyLoading('timesheet/Newtimesheet')
    },
    {
      name: 'View History',
      path: '/timesheet/viewhistory',
      meta: {
        label: 'View history'
      },
      component: lazyLoading('timesheet/ViewHistory')
    }
  ]
}
