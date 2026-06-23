import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PortfolioImportDialog from '../src/components/portfolio/PortfolioImportDialog.vue'

describe('PortfolioImportDialog', () => {
  function createWrapper () {
    return mount(PortfolioImportDialog, {
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

    expect(html).toContain('name="portfolios_import_file"')
    expect(html).toContain('Tarik dan lepas file JSON di sini')
  })

  it('emit select-file saat file dijatuhkan ke dropzone', async () => {
    const wrapper = createWrapper()
    const file = new File(['{"portfolios": []}'], 'portfolios-import.json', {
      type: 'application/json',
    })

    await wrapper.get('[data-test="portfolio-import-dropzone"]').trigger('drop', {
      dataTransfer: {
        files: {
          item: (index: number) => (index === 0 ? file : null),
        },
      } as unknown as DataTransfer,
    })

    expect(wrapper.emitted('select-file')).toEqual([[file]])
  })
})
