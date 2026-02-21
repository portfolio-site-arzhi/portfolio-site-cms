import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import EducationFormDialog from '../src/components/education/EducationFormDialog.vue'

const {
  createEducationApiMock,
  updateEducationApiMock,
} = vi.hoisted(() => ({
  createEducationApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
      },
    },
  })),
  updateEducationApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
      },
    },
  })),
}))

vi.mock('@/api/education-service', () => ({
  createEducationApi: createEducationApiMock,
  updateEducationApi: updateEducationApiMock,
}))

describe('EducationFormDialog', () => {
  it('mengirim data ke API saat membuat education', async () => {
    const wrapper = mount(EducationFormDialog, {
      props: {
        modelValue: true,
        mode: 'create',
      },
      global: {
        stubs: {
          ExperienceDescriptionLocaleEditor: {
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
      onSubmit: () => Promise<void> | void
    }

    vm.setValues({
      institution_name: ' Institut A ',
      degree: ' S1 ',
      degree_en: ' Bachelor ',
      field_of_study: ' Informatika ',
      field_of_study_en: ' Computer Science ',
      start_date: '2018-08',
      end_date: '',
      description: '',
      description_en: '<p>EN</p>',
      location: ' ',
      is_active: true,
    })

    await vm.onSubmit()
    await flushPromises()

    expect(createEducationApiMock).toHaveBeenCalledWith({
      institution_name: 'Institut A',
      degree: 'S1',
      degree_en: 'Bachelor',
      field_of_study: 'Informatika',
      field_of_study_en: 'Computer Science',
      start_date: '2018-08-01',
      end_date: null,
      description: null,
      description_en: '<p>EN</p>',
      location: null,
      is_active: true,
    })
  })

  it('mengirim data ke API saat mengedit education', async () => {
    const existingEducation = {
      id: 7,
      institution_name: 'Institut Lama',
      degree: 'S1',
      degree_en: 'Bachelor',
      field_of_study: 'Informatika',
      field_of_study_en: 'Computer Science',
      start_date: '2018-08-01',
      end_date: null,
      description: null,
      description_en: null,
      location: null,
      sort_order: 10,
      is_active: false,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      created_by: 1,
      updated_by: 1,
    }

    const wrapper = mount(EducationFormDialog, {
      props: {
        modelValue: true,
        mode: 'edit',
        education: existingEducation,
      },
      global: {
        stubs: {
          ExperienceDescriptionLocaleEditor: {
            template: '<div />',
          },
          teleport: true,
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      setValues: (values: any) => void
      onSubmit: () => Promise<void> | void
    }

    vm.setValues({
      institution_name: 'Institut Baru',
      degree: 'S2',
      degree_en: 'Master',
      field_of_study: 'Sistem Informasi',
      field_of_study_en: 'Information Systems',
      start_date: '2020-01',
      end_date: '2022-01',
      description: '<p>ID</p>',
      description_en: '<p>EN</p>',
      location: 'Jakarta',
      is_active: true,
    })

    await vm.onSubmit()
    await flushPromises()

    expect(updateEducationApiMock).toHaveBeenCalledWith(7, expect.objectContaining({
      institution_name: 'Institut Baru',
      degree: 'S2',
      start_date: '2020-01-01',
      end_date: '2022-01-01',
      is_active: true,
    }))
  })
})
