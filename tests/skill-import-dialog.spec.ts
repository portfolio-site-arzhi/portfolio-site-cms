import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SkillImportDialog from '../src/components/skill/SkillImportDialog.vue'

describe('SkillImportDialog', () => {
  function createWrapper () {
    return mount(SkillImportDialog, {
      global: {
        config: {
          compilerOptions: {
            isCustomElement: tag => tag.startsWith('v-'),
          },
        },
      },
      props: {
        modelValue: true,
        loading: false,
        selectedFile: null,
        errorMessage: null,
      },
    })
  }

  it('menampilkan dropzone import dan input file dengan name stabil', () => {
    const wrapper = createWrapper()
    const html = wrapper.html()

    expect(html).toContain('name="skills_import_file"')
    expect(html).toContain('Tarik dan lepas file Excel di sini')
  })

  it('emit select-file saat file dijatuhkan ke dropzone', async () => {
    const wrapper = createWrapper()
    const file = new File(['xlsx-content'], 'skills-import.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    await wrapper.get('[data-test="skill-import-dropzone"]').trigger('drop', {
      dataTransfer: {
        files: {
          item: (index: number) => (index === 0 ? file : null),
        },
      } as unknown as DataTransfer,
    })

    expect(wrapper.emitted('select-file')).toEqual([[file]])
  })
})
