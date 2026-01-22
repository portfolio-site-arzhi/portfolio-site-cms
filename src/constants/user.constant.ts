export const USERS_TABLE_HEADERS = [
  {
    title: 'Nama',
    key: 'name',
  },
  {
    title: 'Email',
    key: 'email',
  },
  {
    title: 'Status',
    key: 'status',
    align: 'center' as const,
    width: 120,
  },
  {
    title: '',
    key: 'actions',
    align: 'end' as const,
    width: 80,
    sortable: false,
  },
] as const
