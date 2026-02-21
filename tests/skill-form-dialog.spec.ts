import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import SkillFormDialog from '../src/components/skill/SkillFormDialog.vue'
import SkillItemsEditor from '../src/components/skill/SkillItemsEditor.vue'

const smAndDownMock = ref(false)

vi.mock('vuetify', () => ({
  useDisplay: () => ({
    smAndDown: smAndDownMock,
  }),
}))

const {
  createSkillApiMock,
  updateSkillApiMock,
} = vi.hoisted(() => ({
  createSkillApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
      },
    },
  })),
  updateSkillApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
      },
    },
  })),
}))

vi.mock('@/api/skill-service', () => ({
  createSkillApi: createSkillApiMock,
  updateSkillApi: updateSkillApiMock,
}))

describe('SkillFormDialog', () => {
  it('mengirim data ke API saat membuat skill group', async () => {
    const wrapper = mount(SkillFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
      onSubmit: () => Promise<void> | void
    }

    vm.setValues({
      name: ' Frontend ',
      is_active: true,
      skills: [' Vue.js ', 'TypeScript', 'vue.js'],
    })

    await vm.onSubmit()
    await flushPromises()

    expect(createSkillApiMock).toHaveBeenCalledWith({
      name: 'Frontend',
      is_active: true,
      skills: [{ name: 'Vue.js' }, { name: 'TypeScript' }],
    })
  })

  it('mengirim data ke API saat mengedit skill group', async () => {
    const existingSkillGroup = {
      id: 7,
      name: 'Frontend',
      display_order: 1,
      is_active: true,
      skills: [
        {
          id: 11,
          skill_group_id: 7,
          name: 'Vue.js',
          display_order: 1,
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
          created_by: 1,
          updated_by: 1,
        },
      ],
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      created_by: 1,
      updated_by: 1,
    }

    const wrapper = mount(SkillFormDialog, {
      props: {
        modelValue: true,
        mode: 'edit',
        skill: existingSkillGroup,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
      onSubmit: () => Promise<void> | void
    }

    vm.setValues({
      name: 'Frontend Engineering',
      is_active: false,
      skills: ['TypeScript', 'Vue.js'],
    })

    await vm.onSubmit()
    await flushPromises()

    expect(updateSkillApiMock).toHaveBeenCalledWith(7, {
      name: 'Frontend Engineering',
      is_active: false,
      skills: [{ name: 'TypeScript' }, { name: 'Vue.js' }],
    })
  })

  it('menambahkan skill lewat dialog sebelum submit', async () => {
    const wrapper = mount(SkillFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })

    const skillsEditor = wrapper.findComponent(SkillItemsEditor)
    const skillsEditorVm = skillsEditor.vm as unknown as {
      openSkillDialog: () => void
      saveSkill: () => void
      skillName: string
    }

    skillsEditorVm.openSkillDialog()
    skillsEditorVm.skillName = 'Nuxt'
    skillsEditorVm.saveSkill()
    await flushPromises()

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
      onSubmit: () => Promise<void> | void
    }

    vm.setValues({
      name: 'Frontend',
      is_active: true,
    })
    await vm.onSubmit()
    await flushPromises()

    expect(createSkillApiMock).toHaveBeenCalledWith(expect.objectContaining({
      skills: [{ name: 'Nuxt' }],
    }))
  })

  it('menolak skill kosong dan menampilkan pesan error', async () => {
    const wrapper = mount(SkillFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })

    const skillsEditor = wrapper.findComponent(SkillItemsEditor)
    const skillsEditorVm = skillsEditor.vm as unknown as {
      openSkillDialog: () => void
      saveSkill: () => void
      skillError: string | null
    }

    skillsEditorVm.openSkillDialog()
    skillsEditorVm.saveSkill()

    expect(skillsEditorVm.skillError).toBe('Nama skill wajib diisi')
  })
})
