const alphaTestResult = resolve => require.ensure([], () => resolve(require('./result/index.vue')), '');
const alphaTestApply = resolve => require.ensure([], () => resolve(require('./apply/index.vue')), '');
const alphaTestInput = resolve => require.ensure([], () => resolve(require('./input/index.vue')), '');
const alphaTestSuccess = resolve => require.ensure([], () => resolve(require('./success/index.vue')), '');

export default {
    alphaTestResult,
    alphaTestApply,
    alphaTestInput,
    alphaTestSuccess,
}
