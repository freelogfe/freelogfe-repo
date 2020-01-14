
export const USERNAME_REG = /^(?!-)[A-Za-z0-9-]{1,30}(?<!-)$/
export function validateUsername(rule, value, callback) {
  if (value) {
    if (!USERNAME_REG.test(value)) {
      callback(new Error(this.$t('signup.validateErrors.username')))
    } else {
      callback()
    }
  } else {
    callback(new Error(this.$t('signup.validateErrors.username')))
  }
}
