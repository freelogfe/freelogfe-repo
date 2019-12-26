const alphaTestApply = resolve => require.ensure([], () => resolve(require('./apply/index.vue')), '');
const alphaTestInput = resolve => require.ensure([], () => resolve(require('./input/index.vue')), '');
const alphaTestSuccess = resolve => require.ensure([], () => resolve(require('./success/index.vue')), '');

export default {
    alphaTestApply,
    alphaTestInput,
    alphaTestSuccess,
}
