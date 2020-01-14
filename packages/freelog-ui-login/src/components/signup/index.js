import {isSafeUrl} from '../../utils'
import { LOGIN_PATH } from '../../constant'
import {validateLoginName, EMAIL_REG, PHONE_REG} from '../login/validator'
import {validateUsername, USERNAME_REG} from './validator'

export default {
  name: 'f-signup',

  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('signup.passwordInputTip')))
      } else {
        if (this.model.checkPassword !== '') {
          this.$refs.signupForm.validateField('checkPassword')
        }
        callback()
      }
    }

    const validateCheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('signup.checkPasswordInputTip')))
      } else if (value !== this.model.password) {
        callback(new Error(this.$t('signup.inconsistentPasswordTip')))
      } else {
        callback()
      }
    }

    const rules = {
      loginName: [
        {required: true, message: this.$t('signup.loginNamePlaceholder'), trigger: 'blur'},
        {validator: validateLoginName.bind(this), trigger: 'blur'}
      ],
      username: [
        {required: true, message: this.$t('signup.usernamePlaceholder'), trigger: 'blur'},
        {validator: validateUsername.bind(this), trigger: 'blur'}
      ],
      password: [
        {required: true, message: this.$t('signup.passwordInputTip'), trigger: 'blur'},
        {validator: validatePassword, trigger: 'blur'},
        {min: 6, message: this.$t('signup.passwordLengthRule'), trigger: 'blur'}
      ],
      checkPassword: [
        {required: true, message: this.$t('signup.checkPasswordPlaceholder'), trigger: 'blur'},
        {validator: validateCheckPassword, trigger: 'blur'},
        {min: 6, message: this.$t('signup.passwordLengthRule'), trigger: 'blur'}
      ]
    }
    const model = {
      loginName: '',
      username: '',
      password: '',
      checkPassword: '',
      authCode: ''
    }
    return {
      model,
      rules,
      error: null,
      loading: false,
      logining: false,
      readonly: true,
      sending: false,
      waitingTimer: 0,
      loginLink: LOGIN_PATH
    }
  },

  computed: {
    disabledCheckCodeBtn() {
      return this.waitingTimer> 0 || !(EMAIL_REG.test(this.model.loginName) || PHONE_REG.test(this.model.loginName))
    },
    accountType() {
      var type = ''
      if (EMAIL_REG.test(this.model.loginName)) {
        type = 'email'
      } else if (PHONE_REG.test(this.model.loginName)) {
        type = 'phone'
      }

      return type
    },
    vcodeBtnText() {
      if (this.sending) {
        return this.$t('signup.sendingText')
      } else if (this.waitingTimer) {
        setTimeout(() => {
          this.waitingTimer--
        }, 1e3)
        return this.$t('signup.timerText', {time: this.waitingTimer})
      }

      return this.$t('signup.checkcodeBtnText')
    }
  },

  mounted() {
    //阻止浏览器自动填充
    setTimeout(() => {
      this.readonly = false
    }, 1e3)
  },

  methods: {
    submit(ref) {
      if (this.loading) {
        return
      }

      this.$refs[ref].validate((valid) => {
        if (!valid) {
          return
        }

        this.error = null
        this.loading = true

        const data = {}

        Object.keys(this.model).forEach((key) => {
          if ((key !== 'checkPassword')) {
            data[key] = this.model[key]
          }
        })

        this.$axios.post('/v1/userinfos/register', data)
          .then((res) => {
            if (res.data.errcode === 0) {
              // this.$message.success(this.$t('signup.registerSuccess'))
              if(res.data.data) {
                window.localStorage.setItem('loginName', res.data.data.loginName)
              }
              
              this.$router.push(LOGIN_PATH)
            } else {
              this.$message.error(res.data.msg)
            }
            this.loading = false
          })
          .catch((err) => {
            this.error = {title: this.$t('signup.errorTitle'), message: this.$t('signup.defaultErrorMsg')}
            switch (err.response && err.response.status) {
              case 401:
                this.error.message = this.$t('signup.identifyError')
                break
              case 500:
                this.error.message = this.$t('signup.serverError')
                break
              default:
                this.error.message = this.$t('signup.appError')
            }
            this.loading = false
          })
      })
    },
    sendCheckCodeNotifyHandler() {
      if (this.sending || !this.model.loginName) return

      if (!this.model.password) {
        return this.$message.error(this.$t('signup.passwordInputTip'))
      }

      this.sending = true
      this.$axios.post(`/v1/message/send`, {
        loginName: this.model.loginName,
        authCodeType: 'register'
      }).then(res => {
        const {ret, errcode, data, msg} = res.data

        this.sending = false
        if (ret === 0 && errcode === 0) {
          this.waitingTimer = 60
        } else {
          this.$message.error(msg)
        }
      })
    },
    refreshVcodeHandler() {
      this.t = +new Date()
    }
  }
}
