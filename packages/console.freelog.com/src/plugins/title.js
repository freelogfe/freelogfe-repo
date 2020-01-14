import router from '../router'

export default (Vue, options) => {
    let items

    router.afterEach((route) => {
        // items = route.matched.map(item => (item.meta && item.meta.title) || item.name || '').filter(v => !!v)

        // document.title = items.join(options.separator)
        // console.log(route.matched, 'optionsoptions');

        const title = route.matched[route.matched.length - 1].meta.title;
        document.title = title + ' - Freelog';
    })

    Object.defineProperties(Vue.prototype, {
        $title: {
            set: () => (title, fullname) => {
                if (fullname) {
                    document.title = title.toUpperCase()
                } else {
                    // partial
                    items[0] = title.toUpperCase()
                    document.title = items.join(options.separator)
                }
            }
        }
    })
}
