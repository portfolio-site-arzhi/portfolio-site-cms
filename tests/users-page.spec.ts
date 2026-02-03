import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UserFormDialog from '../src/components/user/UserFormDialog.vue'
import UsersPage from '../src/pages/users.vue'

vi.mock('vuetify', () => ({
  useDisplay: () => ({
    smAndDown: {
      value: false,
    },
  }),
}))

const {
  fetchUsersApiMock,
  fetchUserDetailApiMock,
  createUserApiMock,
  updateUserApiMock,
  updateUserStatusApiMock,
  deleteUserApiMock,
} = vi.hoisted(() => ({
  fetchUsersApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: [
        {
          id: 1,
          email: 'user@example.com',
          name: 'User Satu',
          status: true,
          created_at: '2026-01-18T01:00:00.000Z',
          updated_at: '2026-01-18T01:00:00.000Z',
        },
      ],
      meta: {
        page: 1,
        page_size: 10,
        search: null,
        order_field: null,
        order_dir: null,
      },
    },
  })),
  fetchUserDetailApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
        email: 'user@example.com',
        name: 'User Detail',
        status: true,
        created_at: '2026-01-18T01:05:00.000Z',
        updated_at: '2026-01-18T01:05:00.000Z',
      },
    },
  })),
  createUserApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 2,
        email: 'new@example.com',
        name: 'User Baru',
        status: true,
        created_at: '2026-01-18T01:00:00.000Z',
        updated_at: '2026-01-18T01:00:00.000Z',
      },
    },
  })),
  updateUserApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
        email: 'user@example.com',
        name: 'User Diupdate',
        status: true,
        created_at: '2026-01-18T01:00:00.000Z',
        updated_at: '2026-01-18T01:10:00.000Z',
      },
    },
  })),
  updateUserStatusApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
        email: 'user@example.com',
        name: 'User Satu',
        status: false,
        created_at: '2026-01-18T01:00:00.000Z',
        updated_at: '2026-01-18T02:00:00.000Z',
      },
    },
  })),
  deleteUserApiMock: vi.fn(() => Promise.resolve({
    data: {
      message: 'User berhasil dihapus',
    },
  })),
}))

vi.mock('@/api/user-service', () => ({
  fetchUsersApi: fetchUsersApiMock,
  fetchUserDetailApi: fetchUserDetailApiMock,
  createUserApi: createUserApiMock,
  updateUserApi: updateUserApiMock,
  updateUserStatusApi: updateUserStatusApiMock,
  deleteUserApi: deleteUserApiMock,
}))

describe('UsersPage', () => {
  beforeEach(() => {
    fetchUsersApiMock.mockClear()
    fetchUserDetailApiMock.mockClear()
    createUserApiMock.mockClear()
    updateUserApiMock.mockClear()
    updateUserStatusApiMock.mockClear()
    deleteUserApiMock.mockClear()
  })

  it('menampilkan daftar pengguna di tabel', async () => {
    const wrapper = mount(UsersPage)

    await flushPromises()

    expect(fetchUsersApiMock).toHaveBeenCalled()
    const vm = wrapper.vm as unknown as {
      users: Array<{
        id: number
        email: string
        name: string
      }>
    }

    expect(vm.users).toHaveLength(1)
    expect(vm.users[0].name).toBe('User Satu')
    expect(vm.users[0].email).toBe('user@example.com')
  })

  it('memuat ulang daftar saat kata kunci pencarian berubah', async () => {
    const wrapper = mount(UsersPage)

    await flushPromises()

    expect(fetchUsersApiMock).toHaveBeenCalledTimes(1)

    const vm = wrapper.vm as unknown as {
      search: string
      refreshPage: () => void
    }

    vm.search = 'User'
    vm.refreshPage()

    await flushPromises()

    expect(fetchUsersApiMock).toHaveBeenCalledTimes(2)

    const calls = fetchUsersApiMock.mock
      .calls as unknown as Array<[{
        search?: string | null
      }?]>

    const lastCallTuple = calls[1]
    const lastCallArgs = lastCallTuple && lastCallTuple[0]

    expect(lastCallArgs).toMatchObject({
      search: 'User',
    })
  })

  it('memuat ulang daftar setelah pengguna dibuat', async () => {
    const wrapper = mount(UsersPage)

    await flushPromises()

    const vm = wrapper.vm as unknown as {
      onUserCreated: (user: {
        id: number
        email: string
        name: string
        status: boolean
        created_at: string
        updated_at: string
      }) => void
    }

    expect(fetchUsersApiMock).toHaveBeenCalledTimes(1)

    vm.onUserCreated({
      id: 2,
      email: 'new@example.com',
      name: 'User Baru',
      status: true,
      created_at: '2026-01-18T01:00:00.000Z',
      updated_at: '2026-01-18T01:00:00.000Z',
    })

    await flushPromises()

    expect(fetchUsersApiMock).toHaveBeenCalledTimes(2)
  })

  it('memuat ulang daftar setelah pengguna diperbarui', async () => {
    const wrapper = mount(UsersPage)

    await flushPromises()

    const vm = wrapper.vm as unknown as {
      onUserUpdated: (user: {
        id: number
        email: string
        name: string
        status: boolean
        created_at: string
        updated_at: string
      }) => void
    }

    expect(fetchUsersApiMock).toHaveBeenCalledTimes(1)

    vm.onUserUpdated({
      id: 1,
      email: 'user@example.com',
      name: 'User Diupdate',
      status: true,
      created_at: '2026-01-18T01:00:00.000Z',
      updated_at: '2026-01-18T01:10:00.000Z',
    })

    await flushPromises()

    expect(fetchUsersApiMock).toHaveBeenCalledTimes(2)
  })

  it('memuat ulang daftar setelah status pengguna diubah', async () => {
    const wrapper = mount(UsersPage)

    await flushPromises()

    const vm = wrapper.vm as unknown as {
      confirmStatusChange: () => void
      selectedUser: {
        id: number
        email: string
        name: string
        status: boolean
        created_at: string
        updated_at: string
      } | null
    }

    vm.selectedUser = {
      id: 1,
      email: 'user@example.com',
      name: 'User Satu',
      status: true,
      created_at: '2026-01-18T01:00:00.000Z',
      updated_at: '2026-01-18T01:00:00.000Z',
    }

    expect(fetchUsersApiMock).toHaveBeenCalledTimes(1)

    vm.confirmStatusChange()

    await flushPromises()

    expect(updateUserStatusApiMock).toHaveBeenCalledWith(1, {
      status: false,
    })
    expect(fetchUsersApiMock).toHaveBeenCalledTimes(2)
  })

  it('memanggil API detail saat membuka dialog edit', async () => {
    const wrapper = mount(UsersPage)

    await flushPromises()

    const vm = wrapper.vm as unknown as {
      openEditDialog: (user: {
        id: number
        email: string
        name: string
        status: boolean
        created_at: string
        updated_at: string
      }) => void
      selectedUser: {
        id: number
        email: string
        name: string
      } | null
      loadingUserId: number | null
    }

    vm.openEditDialog({
      id: 1,
      email: 'user@example.com',
      name: 'User Satu',
      status: true,
      created_at: '2026-01-18T01:00:00.000Z',
      updated_at: '2026-01-18T01:00:00.000Z',
    })

    await flushPromises()

    expect(fetchUserDetailApiMock).toHaveBeenCalledWith(1)
    expect(vm.selectedUser).not.toBeNull()
    expect(vm.selectedUser?.name).toBe('User Detail')
    expect(vm.loadingUserId).toBeNull()
  })

  it('memanggil API hapus dan memuat ulang daftar saat konfirmasi hapus', async () => {
    const wrapper = mount(UsersPage)

    await flushPromises()

    const vm = wrapper.vm as unknown as {
      confirmDelete: () => void
      selectedUser: {
        id: number
        email: string
        name: string
        status: boolean
        created_at: string
        updated_at: string
      } | null
    }

    vm.selectedUser = {
      id: 1,
      email: 'user@example.com',
      name: 'User Satu',
      status: true,
      created_at: '2026-01-18T01:00:00.000Z',
      updated_at: '2026-01-18T01:00:00.000Z',
    }

    expect(fetchUsersApiMock).toHaveBeenCalledTimes(1)

    vm.confirmDelete()

    await flushPromises()

    expect(deleteUserApiMock).toHaveBeenCalledWith(1)
    expect(fetchUsersApiMock).toHaveBeenCalledTimes(2)
  })
})

describe('UserFormDialog', () => {
  it('mengirim data ke API saat membuat pengguna baru', async () => {
    const wrapper = mount(UserFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
    })

    const vm = wrapper.vm as unknown as {
      onSubmit: (event?: Event) => Promise<void> | void
      setValues: (values: {
        email: string
        name: string
        status: boolean
      }) => void
    }

    vm.setValues({
      email: 'new@example.com',
      name: 'User Baru',
      status: true,
    })

    await vm.onSubmit()

    await flushPromises()

    expect(createUserApiMock).toHaveBeenCalledWith({
      email: 'new@example.com',
      name: 'User Baru',
      status: true,
    })
  })

  it('mengirim data ke API saat mengedit pengguna', async () => {
    const existingUser = {
      id: 1,
      email: 'user@example.com',
      name: 'User Satu',
      status: true,
      created_at: '2026-01-18T01:00:00.000Z',
      updated_at: '2026-01-18T01:00:00.000Z',
    }

    const wrapper = mount(UserFormDialog, {
      props: {
        modelValue: true,
        mode: 'edit',
        user: existingUser,
      },
    })

    const vm = wrapper.vm as unknown as {
      onSubmit: (event?: Event) => Promise<void> | void
      setValues: (values: {
        email: string
        name: string
        status: boolean
      }) => void
    }

    vm.setValues({
      email: 'user@example.com',
      name: 'User Diupdate',
      status: true,
    })

    await vm.onSubmit()

    await flushPromises()

    expect(updateUserApiMock).toHaveBeenCalledWith(1, {
      name: 'User Diupdate',
    })
  })
})
