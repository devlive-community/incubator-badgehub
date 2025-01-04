<template>
  <ShadcnRow class="space-y-6" :gutter="10">
    <ShadcnCol class="bg-green-400 rounded-lg flex items-center justify-center py-8" span="12">
      <div class="space-y-6 my-4">
        <ShadcnText color="white" type="h3">简洁、一致且易读的徽章</ShadcnText>

        <div class="text-center flex justify-center">
          <ShadcnButton>
            <ShadcnLink link="/badge/static">
              开始使用
            </ShadcnLink>
          </ShadcnButton>
        </div>
      </div>
    </ShadcnCol>

    <ShadcnCol span="6">
      <ShadcnCard :border="false">
        <template #title>
          <div class="flex items-center justify-center py-2 space-x-2">
            <div>动态徽章</div>
          </div>
        </template>

        <div class="flex flex-col items-center justify-center space-y-3">
          <img alt="动态徽章" :src="dynamicBadge"/>

          <ShadcnText>显示项目的指标。我们有多种服务的徽章。</ShadcnText>
        </div>
      </ShadcnCard>
    </ShadcnCol>

    <ShadcnCol span="6">
      <ShadcnCard :border="false">
        <template #title>
          <div class="flex items-center justify-center py-2 space-x-2">
            <div>静态徽章</div>
          </div>
        </template>

        <div class="flex flex-col items-center justify-center space-y-3">
          <ShadcnText>通过指定特定的值，创建一个徽章。</ShadcnText>

          <img alt="静态" :src="staticBadge"/>
        </div>
      </ShadcnCard>
    </ShadcnCol>
  </ShadcnRow>
</template>

<script setup lang="ts">
const time = new Date().toTimeString()
const dynamicBadge = `${ window.location.origin }/api/badge/时间-${ time }.svg`
const staticBadge = `${ window.location.origin }/api/badge/Badge-Hub.svg`
</script>