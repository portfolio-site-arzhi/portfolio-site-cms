import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import ExportActionCard from '../src/components/export/ExportActionCard.vue'

vi.mock('vuetify', () => ({
  useDisplay: () => ({
    smAndDown: {
      value: false,
    },
  }),
}))

const CardStub = defineComponent({
  template: '<div><slot /></div>',
})

const IconStub = defineComponent({
  props: {
    icon: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: [String, Number],
      default: '',
    },
  },
  template: '<i :data-color="color" :data-icon="icon" :data-size="String(size)" />',
})

const ButtonStub = defineComponent({
  props: {
    dataTest: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  template: '<button :data-test="dataTest" @click="$emit(\'click\')"><slot /></button>',
})

describe('ExportActionCard', () => {
  it('menampilkan icon PDF tanpa badge locale', () => {
    const wrapper = mount(ExportActionCard, {
      props: {
        title: 'CV ATS',
        description: 'Ekspor CV.',
        helperText: 'Helper text export.',
        icon: 'mdi-file-account-outline',
        buttonText: 'Unduh CV',
        buttonIcon: 'mdi-download',
        loading: false,
        disabled: false,
        dataTest: 'export-cv',
      },
      global: {
        stubs: {
          'v-card': CardStub,
          'v-card-text': CardStub,
          'v-avatar': CardStub,
          'v-spacer': CardStub,
          'v-btn': ButtonStub,
          'v-icon': IconStub,
        },
      },
    })

    expect(wrapper.text()).not.toContain('Bahasa Indonesia')
    const pdfIcon = wrapper.find('[data-icon="mdi-file-pdf-box"]')
    expect(pdfIcon.exists()).toBe(true)
    expect(pdfIcon.attributes('data-color')).toBe('error')
    expect(pdfIcon.attributes('data-size')).toBe('32')
  })
})
