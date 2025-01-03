<template>
  <ShadcnRow :gutter="10">
    <ShadcnCol span="8">
      <ShadcnCard>
        <template #title>
          <div class="flex items-center py-2 space-x-2">
            <ShadcnIcon icon="Badge" size="18"/>
            <div>徽章配置</div>
          </div>
        </template>

        <div class="p-6 max-w-2xl p-4 py-6">
          <ShadcnForm class="space-y-4" v-model="formState" @on-submit="onSubmit">
            <ShadcnRow>
              <ShadcnCol span="6">
                <ShadcnFormItem name="label"
                                label="徽章内容"
                                description="输入徽章的内容，根据 - 进行分割"
                                :rules="[
                                  { required: true, message: '请输入徽章内容，格式为 label-value！' }
                                ]">
                  <ShadcnInput v-model="formState.label" placeholder="徽章标签-徽章内容"/>
                </ShadcnFormItem>
              </ShadcnCol>
            </ShadcnRow>

            <ShadcnRow :gutter="10">
              <ShadcnCol span="6">
                <ShadcnFormItem name="labelColor" label="标签颜色">
                  <ShadcnColorPicker v-model="formState.labelColor"/>
                </ShadcnFormItem>
              </ShadcnCol>

              <ShadcnCol span="6">
                <ShadcnFormItem name="descriptionColor" label="内容颜色">
                  <ShadcnColorPicker v-model="formState.descriptionColor"/>
                </ShadcnFormItem>
              </ShadcnCol>
            </ShadcnRow>

            <ShadcnFormItem name="descriptionColor" label="设置 LOGO">
              <ShadcnInput v-model="formState.logo" placeholder="[可选] 仅支持系统内部相关插件"/>
            </ShadcnFormItem>

            <div class="flex justify-end space-x-2 mt-6">
              <ShadcnButton submit :loading="loading">生成徽章</ShadcnButton>
            </div>
          </ShadcnForm>
        </div>
      </ShadcnCard>
    </ShadcnCol>

    <ShadcnCol span="4">
      <ShadcnCard>
        <template #title>
          <div class="flex items-center py-2 space-x-2">
            <ShadcnIcon icon="Badge" size="18"/>
            <div>预览</div>
          </div>
        </template>

        <div class="p-4 min-h-[40%] relative">
          <ShadcnSpin v-model="loading" fixed/>

          <div v-if="!loading && svgContent">
            <ShadcnTab class="mt-2">
              <ShadcnTabItem v-for="(value, key) in path"
                             :key="key"
                             :label="key"
                             :value="key">
                <div class="bg-gray-100 p-3 rounded flex items-center space-x-2">
                  <div class="overflow-x-auto whitespace-nowrap pr-2 flex-1 scrollbar-none">
                    {{ value }}
                  </div>
                  <div class="flex-shrink-0">
                    <ShadcnCopy :text="value"/>
                  </div>
                </div>
              </ShadcnTabItem>
            </ShadcnTab>

            <div class="flex items-center justify-center mt-2">
              <div v-html="svgContent" class="svg-container"></div>
            </div>
          </div>

          <ShadcnAlert v-else type="primary">请在左侧添加徽章信息</ShadcnAlert>
        </div>
      </ShadcnCard>
    </ShadcnCol>
  </ShadcnRow>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import request from '@/utils/request'

const loading = ref(false)
const svgContent = ref(null)
const path = ref({})
const formState = ref({
  label: null,
  labelColor: '#555555',
  descriptionColor: '#44cc12',
  logo: null
})

const onSubmit = () => {
  loading.value = true
  request.get(`/badge/${ formState.value.label }.svg`, formState)
         .then(response => {
           svgContent.value = response
           const root = window.location.origin
           path.value = {
             URL: `${ root }/api/badge/${ formState.value.label }.svg`,
             Markdown: `![Static Badge](${ root }/api/badge/${ formState.value.label }.svg)`,
             HTML: `<img alt="Static Badge" src="${ root }/api/badge/${ formState.value.label }.svg"/>`
           }
         })
         .finally(() => loading.value = false)
}
</script>

<style scoped>
.overflow-x-auto {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.overflow-x-auto::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>