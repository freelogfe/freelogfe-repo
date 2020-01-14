<template>
    <label
        class="tool__search"
        :style="{backgroundColor: editable ? '#fff': ''}"
        @click="onClick"
    >
        <i
            @mousedown="onConfirm"
            class="freelog fl-icon-content"
        />
        <input
            v-show="editable"
            v-model="value"
            @blur="onBlur"
            ref="input"
            @keydown.enter="onConfirm"
            @click="$event.stopPropagation()"
        />
    </label>
</template>

<script>
    let searching = false;
    export default {
        name: "ToolSearch",
        data() {
            return {
                editable: false,
                value: '',
            }
        },
        methods: {
            onClick() {
                this.editable = true;
                // console.log(this.$refs.input);
                setTimeout(() => this.$refs.input.focus());
            },
            onBlur() {
                if (this.value || searching) {
                    return;
                }
                this.editable = false;
            },
            onConfirm(event) {
                searching = true;
                setTimeout(() => searching = false);
                if (this.value) {
                    event.stopPropagation();
                }

                if (this.editable) {
                    this.$emit('onConfirm', this.value);
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .tool__search {
        width: 200px;
        height: 34px;
        background: rgba(142, 142, 147, 0.2);
        border-radius: 2px;
        display: flex;
        align-items: center;
        cursor: pointer;
        box-sizing: border-box;
        padding: 0 12px;
        justify-content: space-between;

        &:hover {
            background: rgba(142, 142, 147, 0.4);
        }

        & > i {
            font-size: 14px;
            color: #8e8e93;
            flex-shrink: 0;
        }

        & > input {
            display: block;
            font-size: 14px;
            line-height: 20px;
            width: 150px;
            border: none;
            outline: none;
        }
    }
</style>
