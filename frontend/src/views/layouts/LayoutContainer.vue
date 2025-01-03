<template>
  <ShadcnLayout class="min-h-screen">
    <ShadcnLayoutWrapper>
      <ShadcnLayoutMain>
        <ShadcnLayoutHeader>
          <LayoutHeader/>
        </ShadcnLayoutHeader>

        <ShadcnLayoutContent class="container py-4 min-h-screen">
          <RouterView/>
        </ShadcnLayoutContent>
      </ShadcnLayoutMain>
    </ShadcnLayoutWrapper>
  </ShadcnLayout>
</template>

<script setup lang="ts">
// @ts-ignore
import { setLocale } from 'view-shadcn-ui'
import LayoutHeader from '@/views/layouts/components/LayoutHeader.vue'

setLocale('zh-CN')
</script>