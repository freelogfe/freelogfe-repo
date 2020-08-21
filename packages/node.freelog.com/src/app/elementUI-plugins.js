import { 
  Button, Checkbox, Form, FormItem, Input, Option, Select, Tooltip, 
  // Popover,
  Message, MessageBox, Dialog, Loading 
} from 'element-ui'

export default {
  install: function(Vue) {
    Vue.component(Button.name, Button)
    Vue.component(Checkbox.name, Checkbox)
    Vue.component(Form.name, Form)
    Vue.component(FormItem.name, FormItem)
    Vue.component(Input.name, Input)
    Vue.component(Option.name, Option)
    Vue.component(Select.name, Select)
    Vue.component(Tooltip.name, Tooltip)
    Vue.component(Dialog.name, Dialog)
    // Vue.component(Popover.name, Popover)

    Vue.prototype.$loading = Loading.service
    Vue.prototype.$message = Message
    Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$prompt = MessageBox.prompt
  }
}
