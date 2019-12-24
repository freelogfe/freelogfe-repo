export default {
  name: 'freelog-search-input',
  data() {
    return {
      input: '',
      showInput: false
    }
  },
  props: {
    showInputImmediately: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default() {
        return '300px'
      }
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.showInput = this.showInputImmediately
  },
  methods: {
    showInputHandler() {
      if(!this.showInputImmediately) {
        this.showInput = true
      }
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    hideInputHandler() {
      if(!this.showInputImmediately) {
        this.showInput = false
      }
    },
    searchHandler() {
      if(!this.showInputImmediately) {
        this.showInput = true
      }
      this.$emit('search', this.input)
    }
  }
}
