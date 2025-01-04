<template>
  <ShadcnRow :gutter="10">
    <ShadcnCol span="12">
      <ShadcnCard>
        <template #title>
          <div class="flex items-center py-2 space-x-2">
            <ShadcnIcon icon="Github" size="18"/>
            <div>图表配置</div>
          </div>
        </template>

        <div class="p-6 max-w-2xl p-4 py-6">
          <ShadcnForm class="space-y-4" v-model="formState" @on-submit="onSubmit">
            <ShadcnRow :gutter="10">
              <ShadcnCol span="6">
                <ShadcnFormItem name="organization"
                                label="组织｜用户名"
                                description="请输入 GitHub 用户名或组织名，如 devlive-community"
                                :rules="[
                                  { required: true, message: '请输入 GitHub 用户名或组织名，如 devlive-community' }
                                ]">
                  <ShadcnInput v-model="formState.organization" placeholder="请输入 GitHub 用户名或组织名，如 devlive-community"/>
                </ShadcnFormItem>
              </ShadcnCol>

              <ShadcnCol span="6">
                <ShadcnFormItem name="repo"
                                label="仓库名"
                                description="请输入 GitHub 仓库名，如 badgehub"
                                :rules="[
                                  { required: true, message: '请输入 GitHub 仓库名，如 badgehub' }
                                ]">
                  <ShadcnInput v-model="formState.repo" placeholder="请输入 GitHub 仓库名，如 badgehub"/>
                </ShadcnFormItem>
              </ShadcnCol>
            </ShadcnRow>

            <div class="flex justify-end space-x-2 mt-6">
              <ShadcnButton submit :loading="loading">生成图表</ShadcnButton>
            </div>
          </ShadcnForm>
        </div>
      </ShadcnCard>
    </ShadcnCol>

    <ShadcnCol span="12">
      <ShadcnCard>
        <template #title>
          <div class="flex items-center py-2 space-x-2">
            <ShadcnIcon icon="Github" size="18"/>
            <div>预览</div>
          </div>
        </template>

        <div class="p-4 min-h-[40%] relative">
          <ShadcnSkeleton v-if="loading" animation/>

          <div v-else-if="!loading && svgContent">
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

          <ShadcnAlert v-else type="primary">请在上方配置图表信息</ShadcnAlert>
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
  organization: null,
  repo: null
})

const onSubmit = () => {
  loading.value = true

  request.get(`/chart/github/${ formState.value.organization }/${ formState.value.repo }.svg`)
         .then(response => {
           svgContent.value = response

           const root = window.location.origin
           path.value = {
             URL: `${ root }/api/chart/github/${ formState.value.organization }/${ formState.value.repo }.svg`,
             Markdown: `![Static Badge](${ root }/api/chart/github/${ formState.value.organization }/${ formState.value.repo }.svg)`,
             HTML: `<img alt="Static Badge" src="${ root }/api/chart/github/${ formState.value.organization }/${ formState.value.repo }.svg"/>`
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