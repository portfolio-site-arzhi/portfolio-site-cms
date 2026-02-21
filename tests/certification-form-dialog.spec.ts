import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import CertificationFormDialog from '../src/components/certification/CertificationFormDialog.vue'

const {
  createCertificationApiMock,
  updateCertificationApiMock,
} = vi.hoisted(() => ({
  createCertificationApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
      },
    },
  })),
  updateCertificationApiMock: vi.fn(() => Promise.resolve({
    data: {
      data: {
        id: 1,
      },
    },
  })),
}))

vi.mock('@/api/certification-service', () => ({
  createCertificationApi: createCertificationApiMock,
  updateCertificationApi: updateCertificationApiMock,
}))

describe('CertificationFormDialog', () => {
  it('mengirim data ke API saat membuat certification', async () => {
    const wrapper = mount(CertificationFormDialog, {
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
      name: ' Sertifikasi A ',
      name_en: ' Certification A ',
      issuing_organization: ' Org A ',
      issue_date: '2022-08',
      description: '',
      description_en: '<p>EN</p>',
      is_active: true,
    })

    await vm.onSubmit()
    await flushPromises()

    expect(createCertificationApiMock).toHaveBeenCalledWith({
      name: 'Sertifikasi A',
      name_en: 'Certification A',
      issuing_organization: 'Org A',
      issue_date: '2022-08-01',
      description: null,
      description_en: '<p>EN</p>',
      is_active: true,
    })
  })

  it('mengirim data ke API saat mengedit certification', async () => {
    const existingCertification = {
      id: 7,
      name: 'Sertifikasi Lama',
      name_en: 'Old Certification',
      issuing_organization: 'Org Lama',
      issue_date: '2020-01-01',
      description: null,
      description_en: null,
      sort_order: 10,
      is_active: false,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      created_by: 1,
      updated_by: 1,
    }

    const wrapper = mount(CertificationFormDialog, {
      props: {
        modelValue: true,
        mode: 'edit',
        certification: existingCertification,
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
      name: 'Sertifikasi Baru',
      name_en: 'New Certification',
      issuing_organization: 'Org Baru',
      issue_date: '2022-01',
      description: '<p>ID</p>',
      description_en: '<p>EN</p>',
      is_active: true,
    })

    await vm.onSubmit()
    await flushPromises()

    expect(updateCertificationApiMock).toHaveBeenCalledWith(7, expect.objectContaining({
      name: 'Sertifikasi Baru',
      issuing_organization: 'Org Baru',
      issue_date: '2022-01-01',
      is_active: true,
    }))
  })
})
